package main

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/xml"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"sort"
	"strings"
	"time"
)

// A minimal S3 client, signed with SigV4.
//
// The site reaches the same bucket through the AWS SDK; this command signs its
// own requests instead, because pulling the SDK in for four verbs would be the
// largest dependency in a tool that otherwise needs none. The endpoint is
// OVH's, which is S3-compatible but not AWS: the bucket stays in the path
// rather than becoming a subdomain.
type bucket struct {
	endpoint  string
	region    string
	name      string
	accessKey string
	secretKey string
	client    *http.Client
}

func newBucketFromEnv() (*bucket, error) {
	b := &bucket{
		endpoint:  strings.TrimSuffix(os.Getenv("S3_ENDPOINT"), "/"),
		region:    env("S3_REGION", "gra"),
		name:      os.Getenv("S3_BUCKET"),
		accessKey: os.Getenv("S3_ACCESS_KEY"),
		secretKey: os.Getenv("S3_SECRET_KEY"),
		client:    &http.Client{Timeout: 5 * time.Minute},
	}
	if b.endpoint == "" || b.name == "" || b.accessKey == "" || b.secretKey == "" {
		return nil, fmt.Errorf("set S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY and S3_SECRET_KEY")
	}
	return b, nil
}

// get returns the object, or nil when it is not there. A missing object is an
// answer here, not a failure: most articles have no audio yet.
func (b *bucket) get(ctx context.Context, key string) ([]byte, error) {
	resp, err := b.do(ctx, http.MethodGet, key, nil, nil, "")
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode == http.StatusNotFound {
		return nil, nil
	}
	if resp.StatusCode != http.StatusOK {
		return nil, statusError(resp)
	}
	return io.ReadAll(resp.Body)
}

func (b *bucket) put(ctx context.Context, key string, body []byte, contentType string) error {
	resp, err := b.do(ctx, http.MethodPut, key, nil, body, contentType)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return statusError(resp)
	}
	return nil
}

func (b *bucket) delete(ctx context.Context, key string) error {
	resp, err := b.do(ctx, http.MethodDelete, key, nil, nil, "")
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusNoContent && resp.StatusCode != http.StatusOK {
		return statusError(resp)
	}
	return nil
}

// list returns every key under a prefix, following the continuation token to
// the end so a corpus larger than one page is not silently truncated.
func (b *bucket) list(ctx context.Context, prefix string) ([]string, error) {
	var keys []string
	var token string

	for {
		query := url.Values{"list-type": {"2"}, "prefix": {prefix}}
		if token != "" {
			query.Set("continuation-token", token)
		}

		resp, err := b.do(ctx, http.MethodGet, "", query, nil, "")
		if err != nil {
			return nil, err
		}
		body, readErr := io.ReadAll(resp.Body)
		resp.Body.Close()
		if resp.StatusCode != http.StatusOK {
			return nil, fmt.Errorf("list: status %d: %s", resp.StatusCode, bytes.TrimSpace(body))
		}
		if readErr != nil {
			return nil, readErr
		}

		var parsed struct {
			Contents []struct {
				Key string `xml:"Key"`
			} `xml:"Contents"`
			IsTruncated           bool   `xml:"IsTruncated"`
			NextContinuationToken string `xml:"NextContinuationToken"`
		}
		if err := xml.Unmarshal(body, &parsed); err != nil {
			return nil, fmt.Errorf("list: %w", err)
		}
		for _, c := range parsed.Contents {
			keys = append(keys, c.Key)
		}
		if !parsed.IsTruncated || parsed.NextContinuationToken == "" {
			break
		}
		token = parsed.NextContinuationToken
	}

	sort.Strings(keys)
	return keys, nil
}

func (b *bucket) do(ctx context.Context, method, key string, query url.Values, body []byte, contentType string) (*http.Response, error) {
	path := "/" + b.name
	if key != "" {
		path += "/" + key
	}

	endpoint := b.endpoint + path
	if len(query) > 0 {
		endpoint += "?" + query.Encode()
	}

	req, err := http.NewRequestWithContext(ctx, method, endpoint, bytes.NewReader(body))
	if err != nil {
		return nil, err
	}
	if contentType != "" {
		req.Header.Set("Content-Type", contentType)
	}
	b.sign(req, path, query, body)

	return b.client.Do(req)
}

// sign applies AWS Signature Version 4 to the request.
func (b *bucket) sign(req *http.Request, path string, query url.Values, body []byte) {
	now := time.Now().UTC()
	stamp := now.Format("20060102T150405Z")
	day := now.Format("20060102")

	sum := sha256.Sum256(body)
	payloadHash := hex.EncodeToString(sum[:])

	req.Header.Set("Host", req.URL.Host)
	req.Header.Set("X-Amz-Date", stamp)
	req.Header.Set("X-Amz-Content-Sha256", payloadHash)

	signed := []string{"host", "x-amz-content-sha256", "x-amz-date"}
	var canonicalHeaders strings.Builder
	for _, h := range signed {
		value := req.Header.Get(h)
		if h == "host" {
			value = req.URL.Host
		}
		fmt.Fprintf(&canonicalHeaders, "%s:%s\n", h, strings.TrimSpace(value))
	}

	canonicalRequest := strings.Join([]string{
		req.Method,
		uriEncodePath(path),
		query.Encode(),
		canonicalHeaders.String(),
		strings.Join(signed, ";"),
		payloadHash,
	}, "\n")

	crSum := sha256.Sum256([]byte(canonicalRequest))
	scope := fmt.Sprintf("%s/%s/s3/aws4_request", day, b.region)
	toSign := strings.Join([]string{
		"AWS4-HMAC-SHA256",
		stamp,
		scope,
		hex.EncodeToString(crSum[:]),
	}, "\n")

	key := hmacSHA256([]byte("AWS4"+b.secretKey), day)
	key = hmacSHA256(key, b.region)
	key = hmacSHA256(key, "s3")
	key = hmacSHA256(key, "aws4_request")
	signature := hex.EncodeToString(hmacSHA256(key, toSign))

	req.Header.Set("Authorization", fmt.Sprintf(
		"AWS4-HMAC-SHA256 Credential=%s/%s, SignedHeaders=%s, Signature=%s",
		b.accessKey, scope, strings.Join(signed, ";"), signature,
	))
}

// uriEncodePath encodes each path segment, keeping the separators. S3 signs
// the encoded path, and url.PathEscape would also escape the slashes.
func uriEncodePath(path string) string {
	parts := strings.Split(path, "/")
	for i, p := range parts {
		parts[i] = strings.ReplaceAll(url.QueryEscape(p), "+", "%20")
	}
	return strings.Join(parts, "/")
}

func hmacSHA256(key []byte, data string) []byte {
	h := hmac.New(sha256.New, key)
	h.Write([]byte(data))
	return h.Sum(nil)
}

func statusError(resp *http.Response) error {
	detail, _ := io.ReadAll(io.LimitReader(resp.Body, 2048))
	return fmt.Errorf("status %d: %s", resp.StatusCode, bytes.TrimSpace(detail))
}

// listArticleDirs returns the article directories to consider, either the one
// asked for or every directory in the bucket.
func listArticleDirs(ctx context.Context, b *bucket, only string) ([]string, error) {
	if only != "" {
		return []string{only}, nil
	}

	keys, err := b.list(ctx, "articles/")
	if err != nil {
		return nil, err
	}

	seen := map[string]bool{}
	var dirs []string
	for _, key := range keys {
		rest := strings.TrimPrefix(key, "articles/")
		slash := strings.Index(rest, "/")
		if slash <= 0 {
			continue
		}
		dir := rest[:slash]
		if !seen[dir] {
			seen[dir] = true
			dirs = append(dirs, dir)
		}
	}
	return dirs, nil
}

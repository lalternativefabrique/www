import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

/**
 * Object storage holding the article sources.
 *
 * Publishing writes here and nothing else — no build, no image, no pipeline —
 * so this is the only place an article exists between the admin and a reader.
 * See docs/adr/0001-articles-from-bucket-ssr-blog-admin.md.
 *
 * Server-only. Importing it from a component would ship the credentials to the
 * browser; the app/server/ prefix marks that boundary.
 */

const endpoint = process.env.S3_ENDPOINT
const region = process.env.S3_REGION ?? 'fr-par'
const accessKeyId = process.env.S3_ACCESS_KEY
const secretAccessKey = process.env.S3_SECRET_KEY

export const BUCKET = process.env.S3_BUCKET ?? ''

/**
 * Absent credentials are not an error here: the dev server and the build both
 * run without them, and articles then come from the local files instead. It
 * only becomes fatal when a caller actually needs the bucket.
 */
export const bucketConfigured = Boolean(
  endpoint && accessKeyId && secretAccessKey && BUCKET,
)

let client: S3Client | undefined

function s3(): S3Client {
  if (!bucketConfigured) {
    throw new Error(
      'Object storage is not configured: set S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY and S3_BUCKET.',
    )
  }
  // Scaleway is S3-compatible but not AWS: the bucket has to stay in the path
  // rather than become a subdomain of the endpoint.
  client ??= new S3Client({
    endpoint,
    region,
    forcePathStyle: true,
    credentials: { accessKeyId: accessKeyId!, secretAccessKey: secretAccessKey! },
  })
  return client
}

export async function getObject(key: string): Promise<string | undefined> {
  try {
    const out = await s3().send(
      new GetObjectCommand({ Bucket: BUCKET, Key: key }),
    )
    return await out.Body?.transformToString()
  } catch (err) {
    if (isNotFound(err)) return undefined
    throw err
  }
}

export async function putObject(
  key: string,
  body: string | Uint8Array,
  contentType = 'text/markdown; charset=utf-8',
) {
  await s3().send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  )
}

export async function deleteObject(key: string) {
  await s3().send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
}

/** Every key under a prefix, following the continuation token to the end. */
export async function listKeys(prefix: string): Promise<string[]> {
  const keys: string[] = []
  let token: string | undefined

  do {
    const page = await s3().send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: prefix,
        ContinuationToken: token,
      }),
    )
    for (const obj of page.Contents ?? []) {
      if (obj.Key) keys.push(obj.Key)
    }
    token = page.NextContinuationToken
  } while (token)

  return keys
}

function isNotFound(err: unknown): boolean {
  const name = (err as { name?: string })?.name
  const status = (err as { $metadata?: { httpStatusCode?: number } })?.$metadata
    ?.httpStatusCode
  return name === 'NoSuchKey' || name === 'NotFound' || status === 404
}

#!/usr/bin/env node
/**
 * Uploads the article sources in the repo to the bucket.
 *
 * Needed once, when the bucket is created: the site lists object storage to
 * find articles, and an empty bucket is a revue with nothing in it. The .mdx
 * files under app/content/articles are the fallback a clone runs on, and this
 * is what makes them the starting corpus.
 *
 * Safe to re-run: every key is overwritten with the file's current content.
 *
 *   node scripts/seed-bucket.mjs           # upload
 *   node scripts/seed-bucket.mjs --dry-run # list what would be uploaded
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const DRY = process.argv.includes('--dry-run')

const endpoint = process.env.S3_ENDPOINT
const region = process.env.S3_REGION ?? 'gra'
const bucket = process.env.S3_BUCKET
const accessKeyId = process.env.S3_ACCESS_KEY
const secretAccessKey = process.env.S3_SECRET_KEY

if (!DRY && !(endpoint && bucket && accessKeyId && secretAccessKey)) {
  console.error(
    'Set S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY and S3_SECRET_KEY (see .env.example).',
  )
  process.exit(1)
}

const ARTICLES = resolve(process.cwd(), 'app/content/articles')
const IMAGES = resolve(process.cwd(), 'public/images/articles')

const MIME = {
  '.mdx': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
}

const mimeOf = (name) =>
  MIME[name.slice(name.lastIndexOf('.'))] ?? 'application/octet-stream'

/** Every (key, absolute path) pair to upload. */
function collect() {
  const items = []

  for (const dir of readdirSync(ARTICLES, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue
    for (const file of readdirSync(resolve(ARTICLES, dir.name))) {
      if (!file.endsWith('.mdx')) continue
      items.push({
        key: `articles/${dir.name}/${file}`,
        path: resolve(ARTICLES, dir.name, file),
      })
    }
  }

  // Illustrations referenced as /images/articles/<file> keep that exact path,
  // so a source written against the repo resolves against the bucket unchanged.
  try {
    for (const file of readdirSync(IMAGES)) {
      const path = resolve(IMAGES, file)
      if (!statSync(path).isFile()) continue
      items.push({ key: `images/articles/${file}`, path })
    }
  } catch {
    // No illustrations yet.
  }

  return items
}

const items = collect()

if (DRY) {
  for (const { key } of items) console.log(key)
  console.log(`\n${items.length} objects would be uploaded to ${bucket ?? '<bucket>'}.`)
  process.exit(0)
}

const s3 = new S3Client({
  endpoint,
  region,
  // OVH is S3-compatible but not AWS: the bucket stays in the path rather than
  // becoming a subdomain of the endpoint.
  forcePathStyle: true,
  credentials: { accessKeyId, secretAccessKey },
})

let done = 0
for (const { key, path } of items) {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: readFileSync(path),
      ContentType: mimeOf(key),
    }),
  )
  done += 1
  console.log(`${done}/${items.length}  ${key}`)
}

console.log(`\nUploaded ${done} objects to ${bucket}.`)

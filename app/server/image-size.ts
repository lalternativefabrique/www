/**
 * Intrinsic size of an image, read from its header.
 *
 * A <Figure> needs width and height so the browser can reserve the space before
 * the file arrives; without them the article reflows as each image loads. The
 * three formats this site publishes are covered, which is why there is no
 * dependency here — a general image library would parse dozens of formats to
 * answer the same two numbers.
 *
 * Returns undefined for anything unrecognised, so the caller can leave the
 * markdown alone rather than emit a figure with invented dimensions. SVG is
 * among those: it has no intrinsic pixel size, and its viewBox is a ratio
 * rather than the two numbers a <Figure> reserves space with.
 */

export type Size = { width: number; height: number }

export function imageSize(bytes: Uint8Array): Size | undefined {
  return png(bytes) ?? jpeg(bytes) ?? webp(bytes)
}

function png(b: Uint8Array): Size | undefined {
  // \x89PNG\r\n\x1a\n, then an IHDR chunk whose width and height are the first
  // two big-endian uint32 of its payload.
  if (b.length < 24) return undefined
  if (b[0] !== 0x89 || b[1] !== 0x50 || b[2] !== 0x4e || b[3] !== 0x47) {
    return undefined
  }
  const view = new DataView(b.buffer, b.byteOffset, b.byteLength)
  return { width: view.getUint32(16), height: view.getUint32(20) }
}

function jpeg(b: Uint8Array): Size | undefined {
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return undefined
  const view = new DataView(b.buffer, b.byteOffset, b.byteLength)

  // Walk the segment chain to the start-of-frame marker, which is the only one
  // carrying the dimensions.
  let offset = 2
  while (offset + 9 < b.length) {
    if (b[offset] !== 0xff) return undefined
    const marker = b[offset + 1]
    const length = view.getUint16(offset + 2)

    // SOF0..SOF15, excluding the DHT/JPG/DAC markers interleaved in that range.
    const isSof =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc
    if (isSof) {
      return {
        height: view.getUint16(offset + 5),
        width: view.getUint16(offset + 7),
      }
    }

    offset += 2 + length
  }
  return undefined
}

function webp(b: Uint8Array): Size | undefined {
  if (b.length < 30) return undefined
  const tag = String.fromCharCode(b[0], b[1], b[2], b[3])
  const format = String.fromCharCode(b[8], b[9], b[10], b[11])
  if (tag !== 'RIFF' || format !== 'WEBP') return undefined

  const kind = String.fromCharCode(b[12], b[13], b[14], b[15])

  // Lossy: 14 bits each, after a 3-byte sync code.
  if (kind === 'VP8 ') {
    const view = new DataView(b.buffer, b.byteOffset, b.byteLength)
    return {
      width: view.getUint16(26, true) & 0x3fff,
      height: view.getUint16(28, true) & 0x3fff,
    }
  }

  // Lossless: 14 bits each, packed across bytes 21..24, both minus one.
  if (kind === 'VP8L') {
    const bits = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24)
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    }
  }

  // Extended: 24 bits each, minus one.
  if (kind === 'VP8X') {
    return {
      width: (b[24] | (b[25] << 8) | (b[26] << 16)) + 1,
      height: (b[27] | (b[28] << 8) | (b[29] << 16)) + 1,
    }
  }

  return undefined
}

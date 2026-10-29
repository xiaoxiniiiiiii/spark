import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const root = process.cwd()
const specs = [
  ['jewelry.png', 'jewelry', 1],
  ['hands.png', 'hands', 16],
  ['hair.png', 'hair', 31],
]

await fs.mkdir(path.join(root, 'public', 'products'), { recursive: true })

for (const [file, prefix, offset] of specs) {
  const source = path.join(root, 'public', 'source-sheets', file)
  const metadata = await sharp(source).metadata()
  const tileWidth = Math.floor((metadata.width ?? 1024) / 3)
  const tileHeight = Math.floor((metadata.height ?? 1536) / 5)
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 3; col += 1) {
      const id = offset + row * 3 + col
      const left = col * tileWidth + (col ? 3 : 0)
      const top = row * tileHeight + (row ? 3 : 0)
      await sharp(source)
        .extract({ left, top, width: tileWidth - 4, height: tileHeight - 4 })
        .resize(720, 720, { fit: 'cover' })
        .webp({ quality: 88 })
        .toFile(path.join(root, 'public', 'products', `product-${id}.webp`))
    }
  }
}

console.log('Generated 45 local WebP product images.')

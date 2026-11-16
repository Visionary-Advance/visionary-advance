// scripts/generate-icons.mjs
// Generates the Visionary Advance app icon set from public/Img/VALogo.png
// (teal VA mark, transparent background) centred on black, using sharp.
// Run: node scripts/generate-icons.mjs
import sharp from 'sharp'
import { mkdir, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const LOGO = join(root, 'public', 'Img', 'VALogo.png')
const BLACK = { r: 0, g: 0, b: 0, alpha: 1 }

// `scale` is the fraction of the canvas the logo occupies. Smaller values
// keep the mark inside the maskable / apple-icon safe zone.
async function png(size, out, { scale = 0.8 } = {}) {
  const inner = Math.round(size * scale)
  const logo = await sharp(LOGO)
    .trim()
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer()
  await sharp({ create: { width: size, height: size, channels: 4, background: BLACK } })
    .composite([{ input: logo, gravity: 'center' }])
    .flatten({ background: BLACK })
    .png()
    .toFile(out)
  console.log('wrote', out)
}

async function main() {
  const iconsDir = join(root, 'public', 'icons')
  await mkdir(iconsDir, { recursive: true })

  // PWA manifest icons
  await png(192, join(iconsDir, 'icon-192.png'))
  await png(512, join(iconsDir, 'icon-512.png'))
  await png(512, join(iconsDir, 'icon-512-maskable.png'), { scale: 0.6 }) // Android maskable safe zone

  // Next.js app conventions (auto-linked)
  await png(512, join(root, 'app', 'icon.png'))                                   // site-wide favicon
  await png(180, join(root, 'app', 'admin', 'apple-icon.png'), { scale: 0.7 })    // admin apple-touch

  // Public apple-touch + favicons (referenced by manifest / admin layout)
  await png(180, join(iconsDir, 'apple-touch-icon.png'), { scale: 0.7 })
  await png(32, join(iconsDir, 'favicon-32.png'), { scale: 0.9 })
  await png(16, join(iconsDir, 'favicon-16.png'), { scale: 0.9 })

  // The old inline-SVG source is no longer the source of truth
  await rm(join(iconsDir, 'icon.svg'), { force: true })
}

main().catch((e) => { console.error(e); process.exit(1) })

// scripts/generate-icons.mjs
// Generates the Visionary Advance app icon set (V/A chevron mark, white on brand teal)
// from an inline SVG using sharp. Run: node scripts/generate-icons.mjs
import sharp from 'sharp'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BLACK = '#000000'
const TEAL = '#008070'

// "VA" monogram (solid white letterforms on brand teal) on a 512 canvas,
// echoing the solid V/A letterforms of the Visionary Advance logo.
// `scale` shrinks the marks toward the centre so maskable / apple icons
// keep their art inside the safe zone.
function svg({ bg = BLACK, scale = 1 } = {}) {
  const t = `translate(256 256) scale(${scale}) translate(-256 -256)`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${bg}"/>
  <g transform="${t}" fill="${TEAL}">
    <polygon points="104,150 160,150 186,300 212,150 268,150 214,362 158,362"/>
    <polygon points="342,150 398,150 456,362 404,362 390,308 322,308 308,362 256,362"/>
    <polygon points="356,206 374,262 338,262" fill="${bg}"/>
  </g>
</svg>`
}

async function png(svgStr, size, out) {
  await sharp(Buffer.from(svgStr)).resize(size, size).png().toFile(out)
  console.log('wrote', out)
}

async function main() {
  const iconsDir = join(root, 'public', 'icons')
  await mkdir(iconsDir, { recursive: true })

  const full = svg()
  const maskable = svg({ scale: 0.72 }) // extra padding for Android/maskable safe zone

  // PWA manifest icons
  await png(full, 192, join(iconsDir, 'icon-192.png'))
  await png(full, 512, join(iconsDir, 'icon-512.png'))
  await png(maskable, 512, join(iconsDir, 'icon-512-maskable.png'))

  // Next.js app conventions (auto-linked)
  await png(full, 512, join(root, 'app', 'icon.png'))               // site-wide favicon
  await png(svg({ scale: 0.82 }), 180, join(root, 'app', 'admin', 'apple-icon.png')) // admin apple-touch

  // Public apple-touch + favicons (referenced by manifest / admin layout)
  await png(svg({ scale: 0.82 }), 180, join(iconsDir, 'apple-touch-icon.png'))
  await png(full, 32, join(iconsDir, 'favicon-32.png'))
  await png(full, 16, join(iconsDir, 'favicon-16.png'))

  // Save the source SVG for future edits
  await writeFile(join(iconsDir, 'icon.svg'), full)

  // Remove the old favicon.ico so Next serves the new app/icon.png as the favicon
  await rm(join(root, 'app', 'favicon.ico'), { force: true })
  console.log('removed app/favicon.ico (replaced by app/icon.png)')
}

main().catch((e) => { console.error(e); process.exit(1) })

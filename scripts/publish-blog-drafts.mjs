#!/usr/bin/env node
/**
 * One-shot publisher: takes Blog-Drafts/*.md, fetches Pexels imagery,
 * uploads to Sanity assets, creates + publishes the blog posts.
 *
 * Usage: node scripts/publish-blog-drafts.mjs
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import crypto from 'node:crypto'
import { createClient } from '@sanity/client'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

// ---------------- env ----------------
async function loadEnv() {
  const raw = await fs.readFile(path.join(ROOT, '.env.local'), 'utf8')
  const env = {}
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (m) env[m[1]] = m[2].replace(/^"|"$/g, '')
  }
  return env
}
const env = await loadEnv()
const PROJECT_ID = env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'g84uoyk7'
const DATASET = env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const SANITY_TOKEN = env.SANITY_API_TOKEN
const PEXELS_KEY = env.PEXELS_API_KEY
const API_VERSION = env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-20'

if (!SANITY_TOKEN) throw new Error('SANITY_API_TOKEN missing in .env.local')
if (!PEXELS_KEY) throw new Error('PEXELS_API_KEY missing in .env.local')

const sanity = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: SANITY_TOKEN,
  useCdn: false,
})

// ---------------- post → taxonomy mapping ----------------
const AUTHOR_ID = '7bece2f4-6ba6-4ad3-9217-9e6e8ce7de2a' // Brandon Crites
const CAT = {
  seo: '27f11c50-bde8-451a-822c-9c4abf5607a4',
  webDesign: '52d95b17-c88e-49af-81d3-d0ccb061341c',
  business: '89577bd2-3c5a-4f2c-ab8f-8973f4093de8',
  construction: 'ab94f0c4-8884-444d-a21b-6f230e549a5d',
  tech: 'bd70a14a-247c-442f-8581-0f4315d7e16f',
}
const TAG = {
  webDesignTips: '1698ae26-137b-4be7-ab18-87a6db7b9c3d',
  leadGen: '38ee5df8-362a-450d-81f6-18bf0c78ea55',
  audit: '77918ae7-0f67-4e63-bfdd-ff0ef745deda',
  constructionWebsites: '7beced3b-0fd4-4860-9746-41f9674a11c3',
  contractorMarketing: 'bc6a821a-40d2-4d7f-8f05-3e0b18790cc8',
  smallBusiness: 'fbe7b229-51cf-445e-83f5-17ec15341286',
  seo: '83894eda-066a-424a-b822-82d2a1b82611',
}

const POSTS = [
  {
    file: 'construction-website-must-haves.md',
    pexelsQuery: 'construction site builder',
    categories: [CAT.construction, CAT.webDesign],
    tags: [TAG.constructionWebsites, TAG.contractorMarketing, TAG.leadGen],
  },
  {
    file: 'small-business-website-cost-guide.md',
    pexelsQuery: 'small business owner laptop',
    categories: [CAT.webDesign, CAT.business],
    tags: [TAG.smallBusiness, TAG.webDesignTips],
  },
  {
    file: 'law-firm-web-design-best-practices.md',
    pexelsQuery: 'modern law office',
    categories: [CAT.webDesign],
    tags: [TAG.webDesignTips, TAG.leadGen],
  },
  {
    file: 'responsive-web-design-explained.md',
    pexelsQuery: 'responsive web design devices',
    categories: [CAT.webDesign, CAT.tech],
    tags: [TAG.webDesignTips],
  },
  {
    file: 'ecommerce-web-design-conversion.md',
    pexelsQuery: 'ecommerce online shopping',
    categories: [CAT.webDesign, CAT.seo],
    tags: [TAG.webDesignTips, TAG.leadGen],
  },
]

// ---------------- helpers ----------------
const key = () => crypto.randomBytes(6).toString('hex')

function parseFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!m) throw new Error('Missing front matter')
  const fm = {}
  let currentKey = null
  let inList = false
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim()) continue
    const listItem = line.match(/^\s+-\s+(.*)$/)
    if (listItem && currentKey && inList) {
      fm[currentKey].push(listItem[1].trim())
      continue
    }
    const kv = line.match(/^([A-Za-z][A-Za-z0-9_]*):\s*(.*)$/)
    if (kv) {
      currentKey = kv[1]
      const val = kv[2].trim()
      if (val === '') {
        fm[currentKey] = []
        inList = true
      } else {
        // Strip surrounding quotes and unescape internal \" and \\
        const unquoted = val.replace(/^"|"$/g, '')
        fm[currentKey] = unquoted.replace(/\\"/g, '"').replace(/\\\\/g, '\\')
        inList = false
      }
    }
  }
  return { frontMatter: fm, body: m[2] }
}

// MD → Portable Text. Handles: # h1 (skipped), ## h2, ### h3,
// paragraphs, bold (**), italic (*), bullets (-), numbered lists (1.),
// inline links [text](url), pipe tables (rendered as paragraphs of text), --- divider.
function mdToPortableText(md) {
  const lines = md.split(/\r?\n/)
  const blocks = []
  let i = 0

  const pushPara = (text, style = 'normal') => {
    if (!text.trim()) return
    blocks.push(makeBlock(text, style))
  }

  while (i < lines.length) {
    const line = lines[i]

    // Skip H1 (we use front matter title)
    if (/^#\s+/.test(line)) {
      i++
      continue
    }
    // H2
    if (/^##\s+/.test(line)) {
      pushPara(line.replace(/^##\s+/, ''), 'h2')
      i++
      continue
    }
    // H3
    if (/^###\s+/.test(line)) {
      pushPara(line.replace(/^###\s+/, ''), 'h3')
      i++
      continue
    }
    // Horizontal rule
    if (/^---\s*$/.test(line)) {
      i++
      continue
    }
    // Pipe table — accumulate as a single styled paragraph (best effort)
    if (/^\|.*\|\s*$/.test(line)) {
      const tableLines = []
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) {
        if (!/^\|[\s|:-]+\|\s*$/.test(lines[i])) tableLines.push(lines[i])
        i++
      }
      const rendered = tableLines
        .map((row) =>
          row
            .replace(/^\||\|$/g, '')
            .split('|')
            .map((c) => c.trim())
            .join(' — ')
        )
        .join('\n')
      pushPara(rendered, 'normal')
      continue
    }
    // Bullet list
    if (/^-\s+/.test(line)) {
      while (i < lines.length && /^-\s+/.test(lines[i])) {
        const text = lines[i].replace(/^-\s+/, '')
        blocks.push(makeBlock(text, 'normal', 'bullet'))
        i++
      }
      continue
    }
    // Numbered list
    if (/^\d+\.\s+/.test(line)) {
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        const text = lines[i].replace(/^\d+\.\s+/, '')
        blocks.push(makeBlock(text, 'normal', 'number'))
        i++
      }
      continue
    }
    // Blank line
    if (!line.trim()) {
      i++
      continue
    }
    // Paragraph (may span multiple lines until blank)
    let para = line
    i++
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^#{1,3}\s/.test(lines[i]) &&
      !/^-\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i]) &&
      !/^\|.*\|\s*$/.test(lines[i]) &&
      !/^---\s*$/.test(lines[i])
    ) {
      para += ' ' + lines[i]
      i++
    }
    pushPara(para, 'normal')
  }

  return blocks
}

// Build a portable-text block with inline mark parsing for **bold**, *italic*, [link](url).
function makeBlock(text, style = 'normal', listItem = undefined) {
  const children = []
  const markDefs = []

  const remaining = text
  // Tokenize: walk through text, extract links / bold / italic in order.
  // We'll do a simple state-machine approach.
  let cursor = 0
  const pushSpan = (txt, marks = []) => {
    if (!txt) return
    children.push({
      _key: key(),
      _type: 'span',
      text: txt,
      marks,
    })
  }

  const tokenRegex = /(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(\*([^*\n]+)\*)/g
  let lastIndex = 0
  let match
  while ((match = tokenRegex.exec(remaining)) !== null) {
    if (match.index > lastIndex) {
      pushSpan(remaining.slice(lastIndex, match.index))
    }
    if (match[1]) {
      // [text](url) link
      const linkText = match[2]
      const href = match[3]
      const linkKey = key()
      markDefs.push({
        _key: linkKey,
        _type: 'link',
        href,
      })
      pushSpan(linkText, [linkKey])
    } else if (match[4]) {
      // **bold**
      pushSpan(match[5], ['strong'])
    } else if (match[6]) {
      // *italic*
      pushSpan(match[7], ['em'])
    }
    lastIndex = tokenRegex.lastIndex
  }
  if (lastIndex < remaining.length) {
    pushSpan(remaining.slice(lastIndex))
  }
  if (children.length === 0) {
    pushSpan(text)
  }

  const block = {
    _key: key(),
    _type: 'block',
    style,
    markDefs,
    children,
  }
  if (listItem) block.listItem = listItem
  return block
}

// ---------------- Pexels ----------------
async function searchPexels(query) {
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`
  const res = await fetch(url, {
    headers: { Authorization: PEXELS_KEY },
  })
  if (!res.ok) throw new Error(`Pexels search failed: ${res.status} ${await res.text()}`)
  const json = await res.json()
  if (!json.photos || json.photos.length === 0) {
    throw new Error(`No Pexels results for "${query}"`)
  }
  return json.photos[0]
}

async function downloadImage(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Image download failed: ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

async function uploadToSanity(buffer, filename, alt) {
  const asset = await sanity.assets.upload('image', buffer, {
    filename,
    contentType: 'image/jpeg',
  })
  return asset
}

// ---------------- main ----------------
async function publishOne(postSpec) {
  const draftPath = path.join(ROOT, 'Blog-Drafts', postSpec.file)
  const raw = await fs.readFile(draftPath, 'utf8')
  const { frontMatter, body } = parseFrontMatter(raw)

  console.log(`\n→ ${frontMatter.title}`)

  // 1. Pexels: search + download
  console.log(`  Pexels search: "${postSpec.pexelsQuery}"`)
  const photo = await searchPexels(postSpec.pexelsQuery)
  console.log(`  → photo by ${photo.photographer} (id ${photo.id})`)
  const imgBuffer = await downloadImage(photo.src.large2x || photo.src.large)

  // 2. Sanity asset upload
  const asset = await uploadToSanity(
    imgBuffer,
    `${frontMatter.slug}.jpg`,
    frontMatter.featuredImageAlt
  )
  console.log(`  → uploaded asset ${asset._id}`)

  // 3. Convert MD body to portable text
  const portableText = mdToPortableText(body)

  // 4. Build document
  const doc = {
    _type: 'post',
    title: frontMatter.title,
    slug: { _type: 'slug', current: frontMatter.slug },
    excerpt: frontMatter.excerpt,
    mainImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
      alt: frontMatter.featuredImageAlt,
      attribution: `Photo by ${photo.photographer} on Pexels`,
    },
    body: portableText,
    author: { _type: 'reference', _ref: AUTHOR_ID },
    categories: postSpec.categories.map((id) => ({
      _key: key(),
      _type: 'reference',
      _ref: id,
    })),
    tags: postSpec.tags.map((id) => ({
      _key: key(),
      _type: 'reference',
      _ref: id,
    })),
    publishedAt: new Date().toISOString(),
    featured: false,
    seo: {
      metaTitle: frontMatter.metaTitle,
      metaDescription: frontMatter.metaDescription,
      keywords: frontMatter.keywords || [],
    },
  }

  // 5. Create + publish (use createOrReplace by deterministic ID for idempotency)
  const docId = `post-${frontMatter.slug}`
  const created = await sanity.createOrReplace({ _id: docId, ...doc })
  console.log(`  → published _id=${created._id} slug=${frontMatter.slug}`)

  return created
}

async function main() {
  console.log(`Publishing to project=${PROJECT_ID} dataset=${DATASET}`)
  for (const post of POSTS) {
    try {
      await publishOne(post)
    } catch (err) {
      console.error(`✗ Failed on ${post.file}:`, err.message)
      throw err
    }
  }
  console.log('\nAll 5 posts published.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

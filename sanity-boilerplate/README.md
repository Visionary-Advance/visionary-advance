# Sanity CMS + Next.js Blog Boilerplate

A complete, production-ready integration of Sanity CMS with Next.js for building a full-featured blog. This boilerplate includes everything you need to get a professional blog up and running quickly.

## What's Included

### Content Schemas (6 types)
- **Post**: Complete blog post with rich text, SEO fields, categories, tags, series support
- **Author**: Author profiles with bio, social links, and images
- **Category**: Hierarchical categorization with icons and colors
- **Tag**: Flexible tagging system
- **Series**: Multi-part blog post series
- **Block Content**: Rich portable text with custom components

### Rich Content Components
- Syntax-highlighted code blocks (10+ languages)
- Callout boxes (info, warning, success, tip)
- Image galleries (2-col, 3-col, carousel)
- Video embeds (YouTube, Vimeo)
- Pull quotes with author attribution
- Embedded CTAs (4 types)

### Blog Features
- 5 page routes (listing, post, category, tag, series)
- 15+ reusable React components
- RSS feed generation
- Related posts algorithm
- Table of contents from headings
- Read time calculation
- Social sharing buttons
- Breadcrumb navigation
- Full SEO with JSON-LD structured data
- Static generation with ISR (1-hour revalidation)

### Developer Experience
- Comprehensive GROQ query library (~550 lines)
- Draft preview mode support
- Custom Sanity Studio structure
- Vision plugin for query testing
- Image optimization utilities
- Type-safe patterns

---

## Quick Start

### 1. Prerequisites

- Node.js 18+ and npm
- A Next.js 14+ project (App Router)
- A Sanity account ([sign up free](https://www.sanity.io))

### 2. Create Sanity Project

```bash
# Install Sanity CLI globally
npm install -g sanity

# Create a new Sanity project (or use existing)
sanity init

# Note your Project ID and Dataset name
```

### 3. Install Dependencies

Add these packages to your Next.js project:

```bash
npm install sanity next-sanity @sanity/client @sanity/code-input @sanity/image-url @sanity/vision @portabletext/react lucide-react
```

Or copy the dependencies from `package.json.example`.

### 4. Copy Files to Your Project

From this boilerplate folder, copy the following to your Next.js project:

```
Your Next.js Project Root/
├── sanity.config.js          ← Copy from boilerplate root
├── sanity.cli.js             ← Copy from boilerplate root
├── sanity/
│   ├── schemas/              ← Copy entire folder
│   └── lib/                  ← Copy client.js and image.js
├── lib/
│   └── sanity.js             ← Copy from boilerplate/lib/
├── Components/
│   └── Blog/                 ← Copy entire folder
└── app/
    └── blog/                 ← Copy from example-pages/blog/
```

### 5. Configure Environment Variables

Create/update your `.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-read-token  # Optional, for preview mode
```

Get your Project ID from: https://www.sanity.io/manage > Your Project > Settings

### 6. Update Configuration Files

**sanity.config.js**:
```javascript
name: 'your-project-name',      // Line 12
title: 'Your Project Name',     // Line 13
projectId: 'your-project-id',   // Line 16 (or use env var)
dataset: 'production',          // Line 17 (or use env var)
studioHost: 'your-studio-name', // Optional, for hosted studio
```

**sanity.cli.js**:
```javascript
projectId: 'your-project-id',   // Line 8
dataset: 'production',          // Line 9
studioHost: 'your-studio-name', // Line 13 (optional)
```

### 7. Deploy Schemas to Sanity

```bash
# From your project root
npm run sanity deploy
```

This deploys your Sanity Studio to `your-studio-name.sanity.studio`.

### 8. Create Content

1. Visit your Sanity Studio: `https://your-studio-name.sanity.studio`
2. Create an Author
3. Create Categories and Tags
4. Create your first Post
5. Set `publishedAt` to a past date to publish it

### 9. Run Your Next.js App

```bash
npm run dev
```

Visit `http://localhost:3000/blog` to see your blog!

---

## File Structure Explained

```
sanity-boilerplate/
├── sanity.config.js              # Sanity Studio config (root level)
├── sanity.cli.js                 # Sanity CLI config (root level)
├── schemas/                      # Content type definitions
│   ├── index.js                  # Exports all schemas
│   ├── post.js                   # Main blog post schema
│   ├── author.js                 # Author profiles
│   ├── category.js               # Categories with icons/colors
│   ├── tag.js                    # Simple tags
│   ├── series.js                 # Multi-part series
│   └── blockContent.js           # Rich text editor config
├── lib/                          # Utilities and queries
│   ├── client.js                 # Sanity client setup (sanity/lib/)
│   ├── image.js                  # Image optimization helpers (sanity/lib/)
│   └── sanity.js                 # GROQ queries library (lib/)
├── Components/Blog/              # React components
│   ├── BlogPostCard.jsx          # Post preview card
│   ├── BlogPostContent.jsx       # Portable text renderer
│   ├── BlogHero.jsx              # Post header section
│   ├── TableOfContents.jsx       # Auto-generated TOC
│   ├── RelatedPosts.jsx          # Related posts grid
│   ├── SocialShare.jsx           # Share buttons
│   ├── BlogCTA.jsx               # Lead capture form
│   ├── CategoryBadge.jsx         # Category display
│   └── PortableText/             # Custom portable text components
│       ├── CodeBlock.jsx         # Syntax highlighting
│       ├── Callout.jsx           # Info/warning/success boxes
│       ├── ImageGallery.jsx      # Multi-layout galleries
│       ├── VideoEmbed.jsx        # YouTube/Vimeo embeds
│       ├── Quote.jsx             # Pull quotes
│       └── EmbeddedCTA.jsx       # In-content CTAs
├── example-pages/blog/           # Next.js App Router pages
│   ├── page.jsx                  # Blog listing page
│   ├── [slug]/page.jsx           # Individual post
│   ├── category/[slug]/page.jsx  # Category archive
│   ├── tag/[slug]/page.jsx       # Tag archive
│   ├── series/[slug]/page.jsx    # Series page
│   └── rss.xml/route.js          # RSS feed generator
├── .env.example                  # Environment variables template
├── package.json.example          # Required dependencies
└── README.md                     # This file
```

---

## Key Features Explained

### 1. Static Site Generation (SSG) with ISR

All blog pages use `generateStaticParams` for static generation with 1-hour revalidation:

```javascript
// In any blog page
export const revalidate = 3600; // 1 hour

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs;
}
```

### 2. Draft Preview Mode

Enable preview of draft content before publishing:

```javascript
import { previewClient } from '@/sanity/lib/client';

// Use previewClient instead of client for drafts
const post = await previewClient.fetch(query);
```

Requires `SANITY_API_TOKEN` in `.env.local`.

### 3. Image Optimization

All images are optimized using Sanity's image CDN:

```javascript
import { urlForImage } from '@/sanity/lib/image';

const imageUrl = urlForImage(post.mainImage)
  .width(800)
  .height(400)
  .quality(80)
  .auto('format')
  .url();
```

### 4. Rich Content Rendering

Portable text is rendered with custom components:

```javascript
import { PortableText } from '@portabletext/react';
import { components } from '@/Components/Blog/BlogPostContent';

<PortableText value={post.body} components={components} />
```

### 5. SEO & JSON-LD

Every page includes:
- Open Graph meta tags
- Twitter Card meta tags
- Canonical URLs
- JSON-LD structured data (BlogPosting, BreadcrumbList)

### 6. Related Posts Algorithm

Posts are related by shared categories and tags:

```javascript
const related = await getRelatedPosts(
  post._id,
  post.categories,
  post.tags,
  3 // limit
);
```

### 7. Read Time Calculation

Automatically calculated at 200 words per minute:

```javascript
// In lib/sanity.js
const words = body.map(block => block.text).join(' ').split(/\s+/).length;
const readTime = Math.ceil(words / 200);
```

---

## Available GROQ Queries

All queries are in `lib/sanity.js`:

### Posts
- `getAllPosts(options)` - Get all published posts with pagination
- `getPostBySlug(slug)` - Get single post with full content
- `getPostsByCategory(categorySlug, limit)` - Posts in category
- `getPostsByTag(tagSlug, limit)` - Posts with tag
- `getPostsBySeries(seriesSlug)` - Posts in series (ordered)
- `getRelatedPosts(postId, categoryRefs, tagRefs, limit)` - Related posts
- `getFeaturedPosts(limit)` - Featured posts only
- `getPostCount()` - Total post count
- `searchPosts(keyword, limit)` - Search by title/excerpt
- `getAllPostSlugs()` - For static generation

### Categories
- `getAllCategories()` - All categories with post counts
- `getCategoryBySlug(slug)` - Single category
- `getAllCategorySlugs()` - For static generation

### Tags
- `getAllTags()` - All tags with post counts
- `getTagBySlug(slug)` - Single tag
- `getAllTagSlugs()` - For static generation

### Series
- `getAllSeries()` - All series with post counts
- `getSeriesBySlug(slug)` - Single series with ordered posts
- `getAllSeriesSlugs()` - For static generation

### Authors
- `getAllAuthors()` - All authors with post counts
- `getAuthorBySlug(slug)` - Single author with their posts

### Utilities
- `generateBreadcrumbSchema(breadcrumbs)` - JSON-LD breadcrumbs
- `extractHeadings(body)` - For table of contents

---

## Customization Guide

### 1. Modify Content Schema

Edit files in `schemas/` to add/remove fields:

```javascript
// schemas/post.js
{
  name: 'customField',
  title: 'Custom Field',
  type: 'string',
}
```

After changes, redeploy:
```bash
npm run sanity deploy
```

### 2. Add Custom Portable Text Components

Create a new component in `Components/Blog/PortableText/`:

```javascript
// MyCustomBlock.jsx
export default function MyCustomBlock({ value }) {
  return <div>{value.content}</div>;
}
```

Register it in `schemas/blockContent.js` and `BlogPostContent.jsx`.

### 3. Change Blog URL

To use a different URL (e.g., `/news` instead of `/blog`):

1. Rename `app/blog/` to `app/news/`
2. Update breadcrumb links in components
3. Update RSS feed route

### 4. Customize Studio Theme

Edit `sanity.config.js`:

```javascript
theme: {
  colors: {
    primary: {
      bg: '#your-color',
      fg: '#ffffff',
    },
  },
},
```

### 5. Add More Content Types

Create new schema in `schemas/`:

```javascript
// schemas/project.js
export default {
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    { name: 'title', type: 'string' },
    // ...
  ],
};
```

Export from `schemas/index.js`:
```javascript
export const schemaTypes = [post, author, category, tag, series, blockContent, project];
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Your Sanity project ID from sanity.io/manage |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Dataset name (usually `production`) |
| `SANITY_API_TOKEN` | No | Read token for preview mode (from Sanity > API > Tokens) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | No | API version (defaults to `2025-01-20`) |

---

## Common Tasks

### Create First Author
```bash
# In Sanity Studio
1. Click "Authors"
2. Click "Create new Author"
3. Fill: name, slug (auto-generated), bio, image
4. Click "Publish"
```

### Create First Post
```bash
# In Sanity Studio
1. Click "Posts" > "All Posts"
2. Click "Create new Post"
3. Fill: title, slug, excerpt, body
4. Select author, categories, tags
5. Set "publishedAt" to current date/time
6. Click "Publish"
```

### Enable Preview Mode
```bash
# 1. Get API token from Sanity
Visit: https://www.sanity.io/manage > Your Project > API > Tokens
Create a token with "Viewer" permissions

# 2. Add to .env.local
SANITY_API_TOKEN=your-token-here

# 3. Use previewClient in your code
import { previewClient } from '@/sanity/lib/client';
const drafts = await previewClient.fetch(query);
```

### Deploy Studio Updates
```bash
# After changing schemas or config
npm run sanity deploy
```

### Run Local Studio (Alternative to Hosted)
```bash
# Install Sanity CLI
npm install -g sanity

# Start local studio
sanity dev

# Opens at http://localhost:3333
```

---

## Troubleshooting

### Issue: "Cannot find module '@/sanity/lib/client'"

**Solution**: Check your import paths match your file structure. Update paths if needed:
```javascript
// Change from:
import { client } from '@/sanity/lib/client';

// To (if using jsconfig.json with @ alias):
import { client } from '@/sanity/lib/client';

// Or (relative path):
import { client } from '../../sanity/lib/client';
```

### Issue: "projectId is required"

**Solution**: Ensure environment variables are set:
```bash
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz
NEXT_PUBLIC_SANITY_DATASET=production
```

Restart dev server after adding env vars.

### Issue: No posts showing on blog page

**Solution**:
1. Check `publishedAt` date is in the past
2. Verify posts are published (not drafts) in Sanity Studio
3. Check query in browser DevTools Network tab
4. Try revalidating: visit `/blog` with `?revalidate=1`

### Issue: Images not loading

**Solution**:
1. Verify image is uploaded in Sanity Studio
2. Check `NEXT_PUBLIC_SANITY_PROJECT_ID` is correct
3. Ensure images have `alt` text (required field)
4. Check browser console for CORS errors

### Issue: "Error deploying studio"

**Solution**:
1. Verify you're logged in: `sanity login`
2. Check project ID in `sanity.config.js` matches Sanity account
3. Ensure all required fields in schemas have values

---

## Next Steps

Once your blog is running:

1. **Customize Components**: Edit `Components/Blog/` to match your design
2. **Add Analytics**: Integrate Google Analytics, Plausible, etc.
3. **Setup Search**: Add full-text search with Algolia or built-in search
4. **Enable Comments**: Integrate Disqus, Giscus, or custom solution
5. **Add Newsletter**: Connect to ConvertKit, Mailchimp, etc.
6. **Performance**: Add lazy loading for images, code splitting
7. **Accessibility**: Test with screen readers, improve ARIA labels
8. **Internationalization**: Add i18n for multi-language support

---

## Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Portable Text](https://portabletext.org)
- [Sanity Community Slack](https://slack.sanity.io)

---

## Support

If you encounter issues:

1. Check this README's Troubleshooting section
2. Review Sanity's [Help Center](https://www.sanity.io/help)
3. Ask in [Sanity Community Slack](https://slack.sanity.io)
4. Search [Stack Overflow](https://stackoverflow.com/questions/tagged/sanity)

---

## License

This boilerplate is provided as-is for use in your projects. No attribution required.

---

**Built with Sanity CMS + Next.js** | Last Updated: January 2026

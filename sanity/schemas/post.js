// sanity/schemas/post.js
// Main blog post schema

export default {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'meta', title: 'Metadata' },
  ],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required().max(100),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'Short summary (max 160 chars for meta description)',
      validation: (Rule) => Rule.required().max(160),
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      group: 'content',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          description: 'Important for SEO and accessibility',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
        {
          name: 'attribution',
          type: 'string',
          title: 'Attribution',
          description: 'Photo credit or source',
        },
      ],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'body',
      title: 'Body',
      type: 'blockContent',
      group: 'content',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'meta',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      group: 'meta',
      validation: (Rule) => Rule.required().min(1).max(3),
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
      group: 'meta',
      validation: (Rule) => Rule.max(10),
    },
    {
      name: 'series',
      title: 'Series',
      type: 'reference',
      to: [{ type: 'series' }],
      group: 'meta',
      description: 'If this post is part of a series',
    },
    {
      name: 'seriesOrder',
      title: 'Order in Series',
      type: 'number',
      group: 'meta',
      description: 'Position in series (1, 2, 3, etc.)',
      hidden: ({ document }) => !document?.series,
      validation: (Rule) =>
        Rule.custom((seriesOrder, context) => {
          if (context.document?.series && !seriesOrder) {
            return 'Series order is required when post is part of a series';
          }
          return true;
        }).positive().integer(),
    },
    {
      name: 'relatedPosts',
      title: 'Related Posts',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'post' }] }],
      group: 'meta',
      validation: (Rule) => Rule.max(3),
      description: 'Manually select related posts (max 3)',
    },
    {
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      group: 'meta',
      description: 'Display on homepage or blog hero section',
      initialValue: false,
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      group: 'seo',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Override default title (max 60 chars)',
          validation: (Rule) => Rule.max(60),
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 2,
          description: 'Override excerpt (max 160 chars)',
          validation: (Rule) => Rule.max(160),
        },
        {
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image',
          description: 'Social media share image (1200x630 recommended)',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'SEO keywords (press enter after each)',
          validation: (Rule) => Rule.max(10),
        },
        {
          name: 'canonicalUrl',
          title: 'Canonical URL',
          type: 'url',
          description: 'Use if this content was published elsewhere first',
        },
      ],
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
  ],
  orderings: [
    {
      title: 'Published Date, Newest',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Published Date, Oldest',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
    {
      title: 'Title, A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      publishedAt: 'publishedAt',
      featured: 'featured',
    },
    prepare({ title, author, media, publishedAt, featured }) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString()
        : 'Draft';
      return {
        title: `${featured ? '⭐ ' : ''}${title}`,
        subtitle: `${author} • ${date}`,
        media,
      };
    },
  },
};

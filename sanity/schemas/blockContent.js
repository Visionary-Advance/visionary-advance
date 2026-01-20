// sanity/schemas/blockContent.js
// Defines the portable text configuration for blog post content

export default {
  name: 'blockContent',
  title: 'Block Content',
  type: 'array',
  of: [
    {
      type: 'block',
      title: 'Block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
          { title: 'Underline', value: 'underline' },
          { title: 'Strike', value: 'strike-through' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (Rule) =>
                  Rule.uri({
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              },
              {
                name: 'openInNewTab',
                type: 'boolean',
                title: 'Open in new tab',
                initialValue: true,
              },
            ],
          },
          {
            name: 'highlight',
            type: 'object',
            title: 'Highlight',
            fields: [
              {
                name: 'color',
                type: 'string',
                title: 'Color',
                options: {
                  list: [
                    { title: 'Yellow', value: '#fef3c7' },
                    { title: 'Green', value: '#d1fae5' },
                    { title: 'Blue', value: '#dbeafe' },
                    { title: 'Pink', value: '#fce7f3' },
                  ],
                },
              },
            ],
          },
        ],
      },
    },
    {
      type: 'image',
      title: 'Image',
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
    },
    {
      name: 'codeBlock',
      type: 'code',
      title: 'Code Block',
      options: {
        language: 'javascript',
        languageAlternatives: [
          { title: 'JavaScript', value: 'javascript' },
          { title: 'TypeScript', value: 'typescript' },
          { title: 'JSX', value: 'jsx' },
          { title: 'HTML', value: 'html' },
          { title: 'CSS', value: 'css' },
          { title: 'Python', value: 'python' },
          { title: 'Bash', value: 'bash' },
          { title: 'JSON', value: 'json' },
          { title: 'SQL', value: 'sql' },
        ],
        withFilename: true,
      },
    },
    {
      name: 'callout',
      type: 'object',
      title: 'Callout',
      fields: [
        {
          name: 'type',
          type: 'string',
          title: 'Type',
          options: {
            list: [
              { title: 'Info', value: 'info' },
              { title: 'Warning', value: 'warning' },
              { title: 'Success', value: 'success' },
              { title: 'Tip', value: 'tip' },
            ],
          },
          initialValue: 'info',
        },
        {
          name: 'title',
          type: 'string',
          title: 'Title',
        },
        {
          name: 'content',
          type: 'text',
          title: 'Content',
          rows: 3,
        },
      ],
      preview: {
        select: {
          title: 'title',
          type: 'type',
        },
        prepare({ title, type }) {
          return {
            title: title || 'Callout',
            subtitle: type,
          };
        },
      },
    },
    {
      name: 'imageGallery',
      type: 'object',
      title: 'Image Gallery',
      fields: [
        {
          name: 'images',
          type: 'array',
          title: 'Images',
          of: [
            {
              type: 'image',
              options: { hotspot: true },
              fields: [
                {
                  name: 'alt',
                  type: 'string',
                  title: 'Alt text',
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'caption',
                  type: 'string',
                  title: 'Caption',
                },
              ],
            },
          ],
        },
        {
          name: 'layout',
          type: 'string',
          title: 'Layout',
          options: {
            list: [
              { title: '2 Columns', value: 'two-columns' },
              { title: '3 Columns', value: 'three-columns' },
              { title: 'Carousel', value: 'carousel' },
            ],
          },
          initialValue: 'two-columns',
        },
      ],
      preview: {
        select: {
          images: 'images',
        },
        prepare({ images }) {
          return {
            title: 'Image Gallery',
            subtitle: `${images?.length || 0} images`,
          };
        },
      },
    },
    {
      name: 'embeddedCTA',
      type: 'object',
      title: 'Embedded CTA',
      fields: [
        {
          name: 'title',
          type: 'string',
          title: 'Title',
          initialValue: 'Ready to get started?',
        },
        {
          name: 'description',
          type: 'text',
          title: 'Description',
          rows: 2,
        },
        {
          name: 'ctaType',
          type: 'string',
          title: 'CTA Type',
          options: {
            list: [
              { title: 'Website Audit', value: 'audit' },
              { title: 'Free Consultation', value: 'consultation' },
              { title: 'Download Guide', value: 'download' },
              { title: 'Contact Us', value: 'contact' },
            ],
          },
          initialValue: 'audit',
        },
        {
          name: 'buttonText',
          type: 'string',
          title: 'Button Text',
          initialValue: 'Get Your Free Audit',
        },
      ],
      preview: {
        select: {
          title: 'title',
          type: 'ctaType',
        },
        prepare({ title, type }) {
          return {
            title: title,
            subtitle: `CTA: ${type}`,
          };
        },
      },
    },
    {
      name: 'videoEmbed',
      type: 'object',
      title: 'Video Embed',
      fields: [
        {
          name: 'url',
          type: 'url',
          title: 'Video URL',
          description: 'YouTube or Vimeo URL',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['https'],
            }),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
        },
      ],
      preview: {
        select: {
          url: 'url',
        },
        prepare({ url }) {
          return {
            title: 'Video',
            subtitle: url,
          };
        },
      },
    },
    {
      name: 'quote',
      type: 'object',
      title: 'Pull Quote',
      fields: [
        {
          name: 'quote',
          type: 'text',
          title: 'Quote',
          rows: 3,
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'author',
          type: 'string',
          title: 'Author',
        },
        {
          name: 'role',
          type: 'string',
          title: 'Role/Title',
        },
      ],
      preview: {
        select: {
          quote: 'quote',
          author: 'author',
        },
        prepare({ quote, author }) {
          return {
            title: quote,
            subtitle: author || 'Anonymous',
          };
        },
      },
    },
  ],
};

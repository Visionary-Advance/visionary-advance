'use client';

// Components/Blog/BlogPostContent.jsx
// Portable text renderer for blog post content

import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { urlForImage } from '@/lib/sanity';

// Import custom PortableText components
import CodeBlock from './PortableText/CodeBlock';
import Callout from './PortableText/Callout';
import ImageGallery from './PortableText/ImageGallery';
import VideoEmbed from './PortableText/VideoEmbed';
import Quote from './PortableText/Quote';
import EmbeddedCTA from './PortableText/EmbeddedCTA';

// Custom components for portable text blocks
const components = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-anton text-3xl md:text-4xl text-white mt-12 mb-6 scroll-mt-24" id={children?.toString().toLowerCase().replace(/\s+/g, '-')}>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-anton text-2xl md:text-3xl text-white mt-10 mb-5 scroll-mt-24" id={children?.toString().toLowerCase().replace(/\s+/g, '-')}>
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-manrope font-bold text-xl md:text-2xl text-white mt-8 mb-4 scroll-mt-24">
        {children}
      </h4>
    ),
    normal: ({ children }) => (
      <p className="font-manrope text-lg text-gray-300 mb-6 leading-relaxed">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[#008070] pl-6 py-2 my-8 italic text-gray-200 bg-white/5 rounded-r">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-6 text-gray-300 font-manrope text-lg ml-4">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-6 text-gray-300 font-manrope text-lg ml-4">
        {children}
      </ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    number: ({ children }) => (
      <li className="leading-relaxed">{children}</li>
    ),
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-white">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-white/10 text-[#008070] px-2 py-1 rounded font-mono text-sm">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const target = value?.openInNewTab ? '_blank' : undefined;
      const rel = target === '_blank' ? 'noopener noreferrer' : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={rel}
          className="text-[#008070] hover:underline font-semibold transition-colors"
        >
          {children}
        </a>
      );
    },
    highlight: ({ children, value }) => (
      <span
        className="px-1 rounded"
        style={{ backgroundColor: value?.color || '#fef3c7' }}
      >
        {children}
      </span>
    ),
  },

  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;

      return (
        <figure className="my-10">
          <div className="relative w-full h-auto rounded-lg overflow-hidden">
            <Image
              src={urlForImage(value).width(800).url()}
              alt={value.alt || 'Blog image'}
              width={800}
              height={600}
              className="w-full h-auto"
            />
          </div>
          {(value.caption || value.attribution) && (
            <figcaption className="text-sm text-gray-400 mt-3 text-center font-manrope">
              {value.caption}
              {value.attribution && (
                <span className="block text-xs mt-1">
                  Photo: {value.attribution}
                </span>
              )}
            </figcaption>
          )}
        </figure>
      );
    },

    codeBlock: CodeBlock,
    callout: Callout,
    imageGallery: ImageGallery,
    videoEmbed: VideoEmbed,
    quote: Quote,
    embeddedCTA: EmbeddedCTA,
  },
};

export default function BlogPostContent({ body }) {
  return (
    <article className="prose prose-invert prose-lg max-w-none">
      <PortableText value={body} components={components} />
    </article>
  );
}

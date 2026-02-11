// Components/Blog/BlogHero.jsx
// Hero section for individual blog posts

import Image from 'next/image';
import { urlForImage } from '@/lib/sanity';
import { format } from 'date-fns';
import CategoryBadge from './CategoryBadge';

export default function BlogHero({ post }) {
  const {
    title,
    excerpt,
    mainImage,
    publishedAt,
    author,
    categories,
    readTime,
  } = post;

  const formattedDate = publishedAt
    ? format(new Date(publishedAt), 'MMMM dd, yyyy')
    : 'Draft';

  return (
    <section className="relative w-full min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {mainImage?.asset && (
        <>
          <Image
            src={urlForImage(mainImage).width(1200).height(630).url()}
            alt={mainImage.alt || title}
            fill
            priority
            className="object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 py-16 text-center">
        {/* Categories */}
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {categories.map((category) => (
              <CategoryBadge key={category._id} category={category} clickable={false} />
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="font-anton text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
          {title}
        </h1>

        {/* Excerpt */}
        {excerpt && (
          <p className="font-manrope text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            {excerpt}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-gray-300 font-manrope">
          {/* Date */}
          <time dateTime={publishedAt}>{formattedDate}</time>

          {/* Separator */}
          {readTime && <span className="hidden sm:inline text-gray-500">•</span>}

          {/* Read Time */}
          {readTime && <span>{readTime} min read</span>}
        </div>
      </div>
    </section>
  );
}

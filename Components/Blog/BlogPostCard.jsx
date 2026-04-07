import Link from 'next/link'
import Image from 'next/image'
import { urlForImage } from '@/lib/sanity'
import { format } from 'date-fns'
import CategoryBadge from './CategoryBadge'

export default function BlogPostCard({ post }) {
  const { title, slug, excerpt, mainImage, publishedAt, categories, readTime } = post

  const formattedDate = publishedAt
    ? format(new Date(publishedAt), 'MMM dd, yyyy')
    : 'Draft'

  const estimatedReadTime = readTime || Math.max(1, Math.ceil(excerpt?.length / 1000))

  return (
    <Link href={`/blog/${slug.current}`}>
      <article className="group bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#008070]/40 hover:shadow-lg hover:shadow-black/5">
        {/* Image */}
        {mainImage?.asset && (
          <div className="relative w-full h-48 md:h-56 overflow-hidden">
            <Image
              src={urlForImage(mainImage).width(400).height(300).url()}
              alt={mainImage.alt || title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Categories */}
          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {categories.slice(0, 2).map((category) => (
                <CategoryBadge key={category._id} category={category} clickable={false} />
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="font-inter-display text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#008070] transition-colors">
            {title}
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p className="font-manrope text-gray-500 text-sm md:text-base mb-4 line-clamp-3">
              {excerpt}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center justify-between text-sm text-gray-400 font-manrope">
            <span>{formattedDate}</span>
            <span>{estimatedReadTime} min read</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

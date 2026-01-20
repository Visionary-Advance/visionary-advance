// app/blog/series/[slug]/page.jsx
// Series archive page

import { getSeriesBySlug, getAllSeriesSlugs, urlForImage, generateBreadcrumbSchema } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllSeriesSlugs();
  return slugs;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);

  if (!series) {
    return { title: 'Series Not Found' };
  }

  const ogImage = series.seo?.ogImage || series.coverImage;
  const ogImageUrl = ogImage ? urlForImage(ogImage).width(1200).height(630).url() : null;

  return {
    title: series.seo?.metaTitle || `${series.title} | Blog Series | Visionary Advance`,
    description: series.seo?.metaDescription || series.description || `A blog series about ${series.title}`,
    keywords: series.seo?.keywords?.join(', '),
    openGraph: {
      title: series.seo?.metaTitle || series.title,
      description: series.seo?.metaDescription || series.description,
      type: 'website',
      url: `https://visionaryadvance.com/blog/series/${series.slug.current}`,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: series.seo?.metaTitle || series.title,
      description: series.seo?.metaDescription || series.description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    alternates: {
      canonical: `https://visionaryadvance.com/blog/series/${series.slug.current}`,
    },
  };
}

export default async function SeriesPage({ params }) {
  const { slug } = await params;
  const series = await getSeriesBySlug(slug);

  if (!series) {
    notFound();
  }

  const posts = series.posts || [];

  // Generate breadcrumb structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://visionaryadvance.com' },
    { name: 'Blog', url: 'https://visionaryadvance.com/blog' },
    { name: series.title, url: `https://visionaryadvance.com/blog/series/${series.slug.current}` },
  ]);

  return (
    <>
      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen bg-[#191E1E]">
      {/* Breadcrumbs */}
      <section className="px-4 md:px-16 pt-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center gap-2 text-sm font-manrope text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white transition-colors">
              Blog
            </Link>
            <span>/</span>
            <span className="text-white">{series.title}</span>
          </nav>
        </div>
      </section>

      {/* Series Header */}
      <section className="px-4 md:px-16 py-16">
        <div className="max-w-4xl mx-auto">
          {series.coverImage?.asset && (
            <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
              <Image
                src={urlForImage(series.coverImage).width(1200).height(600).url()}
                alt={series.coverImage.alt || series.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          )}

          <h1 className="font-anton text-4xl md:text-6xl text-white mb-6">
            {series.title}
          </h1>

          {series.description && (
            <p className="font-manrope text-lg md:text-xl text-gray-300 leading-relaxed">
              {series.description}
            </p>
          )}

          <p className="font-manrope text-sm text-gray-500 mt-6">
            {posts.length} {posts.length === 1 ? 'part' : 'parts'} in this series
          </p>
        </div>
      </section>

      {/* Series Posts List */}
      <section className="px-4 md:px-16 pb-24">
        <div className="max-w-4xl mx-auto">
          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post, index) => (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug.current}`}
                  className="block group"
                >
                  <article className="bg-black/30 border border-white/10 rounded-xl p-6 transition-all duration-300 hover:border-[#008070]/50 hover:shadow-lg hover:shadow-[#008070]/10">
                    <div className="flex items-start gap-6">
                      {/* Part Number */}
                      <div className="flex-shrink-0 w-16 h-16 rounded-full bg-[#008070]/20 border-2 border-[#008070] flex items-center justify-center">
                        <span className="font-anton text-2xl text-[#008070]">
                          {post.seriesOrder || index + 1}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="font-anton text-xl md:text-2xl text-white mb-2 group-hover:text-[#008070] transition-colors">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="font-manrope text-gray-300 mb-3 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                        {post.publishedAt && (
                          <p className="font-manrope text-sm text-gray-500">
                            {format(new Date(post.publishedAt), 'MMM dd, yyyy')}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-manrope text-gray-400 text-lg mb-6">
                No posts in this series yet.
              </p>
              <Link
                href="/blog"
                className="inline-block px-6 py-3 bg-[#008070] hover:bg-[#006b5d] text-white font-manrope rounded-lg transition-colors"
              >
                Browse All Posts
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
    </>
  );
}

import { getAllPosts, getAllCategories, generateBreadcrumbSchema } from '@/lib/sanity'
import BlogPostCard from '@/Components/Blog/BlogPostCard'
import SplitText from '@/Components/SplitText'

export const metadata = {
  title: 'Web Design & Development Blog',
  description:
    'Tips on web design, SEO, and custom business systems from a Eugene, OR dev team. Practical guides for growing your online presence.',
  alternates: {
    canonical: 'https://visionaryadvance.com/blog',
  },
  openGraph: {
    title: 'Web Design & Development Blog | Visionary Advance',
    description:
      'Tips on web design, SEO, and custom business systems from a Eugene, OR dev team. Practical guides for growing your online presence.',
    type: 'website',
  },
  twitter: {
    title: 'Web Design & Development Blog | Visionary Advance',
    description:
      'Tips on web design, SEO, and custom business systems from a Eugene, OR dev team. Practical guides for growing your online presence.',
  },
}

export const revalidate = 3600

function PillBadge({ text }) {
  return (
    <span className="inline-flex items-center gap-3 rounded-full px-7 py-3 font-manrope font-bold text-base border border-gray-300 text-gray-700">
      <span className="w-3.5 h-3.5 rounded-full bg-[#008070]" />
      {text}
    </span>
  )
}

export default async function BlogPage() {
  const posts = await getAllPosts({ limit: 50 })
  const categories = await getAllCategories()

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://visionaryadvance.com' },
    { name: 'Blog', url: 'https://visionaryadvance.com/blog' },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen bg-white pt-32">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4 text-center md:px-16">
          <div className="mb-6">
            <PillBadge text="Our Blog" />
          </div>

          <h1 className="font-inter-display text-5xl font-bold text-black md:text-7xl lg:text-8xl lg:leading-none">
            <SplitText text="Blog & Insights" />
          </h1>

          <p className="mx-auto mt-6 max-w-[680px] font-inter-display text-lg font-semibold leading-snug text-black/70 md:text-2xl">
            Expert insights on web design, SEO, and digital marketing strategies to grow your business.
          </p>
        </section>

        {/* ── All Posts ─────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-16 md:py-24">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogPostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="font-manrope text-lg text-gray-400">
                No posts yet. Check back soon!
              </p>
            </div>
          )}
        </section>

        {/* ── Categories ───────────────────────────────────────────────── */}
        {categories.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 pb-24 md:px-16">
            <h2 className="font-inter-display text-2xl font-bold text-black mb-6">
              Browse by Category
            </h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <a
                  key={category._id}
                  href={`/blog/category/${category.slug.current}`}
                  className="px-6 py-3 bg-gray-50 border border-gray-200 rounded-lg font-manrope text-gray-700 hover:border-[#008070]/50 hover:bg-[#008070]/5 transition-all"
                >
                  {category.title}
                  {category.postCount > 0 && (
                    <span className="ml-2 text-sm text-gray-400">
                      ({category.postCount})
                    </span>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  )
}

// app/blog/page.jsx
// Blog listing page

import { getAllPosts, getAllCategories, getFeaturedPosts, generateBreadcrumbSchema } from '@/lib/sanity';
import BlogPostCard from '@/Components/Blog/BlogPostCard';

export const metadata = {
  title: 'Blog | Visionary Advance',
  description: 'Insights on web design, SEO, and digital marketing for construction companies and contractors.',
  openGraph: {
    title: 'Blog | Visionary Advance',
    description: 'Insights on web design, SEO, and digital marketing for construction companies and contractors.',
    type: 'website',
  },
};

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  const posts = await getAllPosts({ limit: 12 });
  const featuredPosts = await getFeaturedPosts(1);
  const categories = await getAllCategories();

  const featuredPost = featuredPosts?.[0];
  const regularPosts = featuredPost
    ? posts.filter((post) => post._id !== featuredPost._id)
    : posts;

  // Generate breadcrumb structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://visionaryadvance.com' },
    { name: 'Blog', url: 'https://visionaryadvance.com/blog' },
  ]);

  return (
    <>
      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen py-20 bg-[#191E1E]">
      {/* Hero Section */}
      <section className="px-4 md:px-16 py-16 md:py-24">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-anton text-4xl md:text-6xl text-white mb-6">
            Blog & Insights
          </h1>
          <p className="font-manrope text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Expert insights on web design, SEO, and digital marketing strategies for construction companies.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="px-4 md:px-16 pb-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-anton text-2xl text-white mb-6">Featured Post</h2>
            <div className="max-w-3xl">
              <BlogPostCard post={featuredPost} />
            </div>
          </div>
        </section>
      )}

      {/* All Posts Grid */}
      <section className="px-4 md:px-16 pb-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-anton text-2xl text-white mb-6">
            {featuredPost ? 'Latest Posts' : 'All Posts'}
          </h2>

          {regularPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <BlogPostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-manrope text-gray-400 text-lg">
                No posts yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="px-4 md:px-16 pb-24">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-anton text-2xl text-white mb-6">Browse by Category</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <a
                  key={category._id}
                  href={`/blog/category/${category.slug.current}`}
                  className="px-6 py-3 bg-black/30 border border-white/10 rounded-lg text-white font-manrope hover:border-[#008070]/50 hover:bg-[#008070]/10 transition-all"
                  style={{ borderColor: `${category.color}40` }}
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
          </div>
        </section>
      )}
    </main>
    </>
  );
}

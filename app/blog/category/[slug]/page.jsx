// app/blog/category/[slug]/page.jsx
// Category archive page

import { getCategoryBySlug, getPostsByCategory, getAllCategorySlugs, urlForImage, generateBreadcrumbSchema } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import BlogPostCard from '@/Components/Blog/BlogPostCard';
import Link from 'next/link';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs;
}

export async function generateMetadata({ params }) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    return { title: 'Category Not Found' };
  }

  const ogImage = category.seo?.ogImage;
  const ogImageUrl = ogImage ? urlForImage(ogImage).width(1200).height(630).url() : null;

  return {
    title: category.seo?.metaTitle || `${category.title} | Blog | Visionary Advance`,
    description: category.seo?.metaDescription || category.description || `Articles about ${category.title}`,
    keywords: category.seo?.keywords?.join(', '),
    openGraph: {
      title: category.seo?.metaTitle || category.title,
      description: category.seo?.metaDescription || category.description,
      type: 'website',
      url: `https://visionaryadvance.com/blog/category/${category.slug.current}`,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: category.seo?.metaTitle || category.title,
      description: category.seo?.metaDescription || category.description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    alternates: {
      canonical: `https://visionaryadvance.com/blog/category/${category.slug.current}`,
    },
  };
}

export default async function CategoryPage({ params }) {
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const posts = await getPostsByCategory(params.slug);

  // Generate breadcrumb structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://visionaryadvance.com' },
    { name: 'Blog', url: 'https://visionaryadvance.com/blog' },
    { name: category.title, url: `https://visionaryadvance.com/blog/category/${category.slug.current}` },
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
            <span className="text-white">{category.title}</span>
          </nav>
        </div>
      </section>

      {/* Category Header */}
      <section className="px-4 md:px-16 py-16">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            {category.icon && <span className="text-4xl">{category.icon}</span>}
            <h1 className="font-anton text-4xl md:text-6xl text-white">
              {category.title}
            </h1>
          </div>
          {category.description && (
            <p className="font-manrope text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mt-4">
              {category.description}
            </p>
          )}
          <p className="font-manrope text-sm text-gray-500 mt-4">
            {category.postCount} {category.postCount === 1 ? 'post' : 'posts'}
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="px-4 md:px-16 pb-24">
        <div className="max-w-7xl mx-auto">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogPostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-manrope text-gray-400 text-lg mb-6">
                No posts in this category yet.
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

// app/blog/tag/[slug]/page.jsx
// Tag archive page

import { getTagBySlug, getPostsByTag, getAllTagSlugs, generateBreadcrumbSchema } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import BlogPostCard from '@/Components/Blog/BlogPostCard';
import Link from 'next/link';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllTagSlugs();
  return slugs;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return { title: 'Tag Not Found' };
  }

  const description = tag.description || `Articles tagged with ${tag.title}`;

  return {
    title: `#${tag.title} | Blog | Visionary Advance`,
    description,
    openGraph: {
      title: `#${tag.title}`,
      description,
      type: 'website',
      url: `https://visionaryadvance.com/blog/tag/${tag.slug.current}`,
    },
    twitter: {
      card: 'summary',
      title: `#${tag.title}`,
      description,
    },
    alternates: {
      canonical: `https://visionaryadvance.com/blog/tag/${tag.slug.current}`,
    },
  };
}

export default async function TagPage({ params }) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  const posts = await getPostsByTag(slug);

  // Generate breadcrumb structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://visionaryadvance.com' },
    { name: 'Blog', url: 'https://visionaryadvance.com/blog' },
    { name: `#${tag.title}`, url: `https://visionaryadvance.com/blog/tag/${tag.slug.current}` },
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
            <span className="text-white">#{tag.title}</span>
          </nav>
        </div>
      </section>

      {/* Tag Header */}
      <section className="px-4 md:px-16 py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-anton text-4xl md:text-6xl text-white mb-4">
            #{tag.title}
          </h1>
          {tag.description && (
            <p className="font-manrope text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              {tag.description}
            </p>
          )}
          <p className="font-manrope text-sm text-gray-500 mt-4">
            {tag.postCount} {tag.postCount === 1 ? 'post' : 'posts'}
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
                No posts with this tag yet.
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

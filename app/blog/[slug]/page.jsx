// app/blog/[slug]/page.jsx
// Individual blog post page

import { getPostBySlug, getAllPostSlugs, generateBreadcrumbSchema, extractHeadings } from '@/lib/sanity';
import { notFound } from 'next/navigation';
import BlogHero from '@/Components/Blog/BlogHero';
import BlogPostContent from '@/Components/Blog/BlogPostContent';
import SocialShare from '@/Components/Blog/SocialShare';
import RelatedPosts from '@/Components/Blog/RelatedPosts';
import BlogCTA from '@/Components/Blog/BlogCTA';
import TableOfContents from '@/Components/Blog/TableOfContents';
import { urlForImage } from '@/lib/sanity';

export const revalidate = 3600; // Revalidate every hour

// Generate static params for all blog posts
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs;
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const ogImage = post.seo?.ogImage || post.mainImage;
  const ogImageUrl = ogImage ? urlForImage(ogImage).width(1200).height(630).url() : null;

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    keywords: post.seo?.keywords?.join(', '),
    authors: post.author ? [{ name: post.author.name }] : [],
    openGraph: {
      type: 'article',
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      images: ogImageUrl ? [ogImageUrl] : [],
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author.name] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
    alternates: {
      canonical: post.seo?.canonicalUrl || `https://visionaryadvance.com/blog/${post.slug.current}`,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Generate JSON-LD structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.mainImage ? urlForImage(post.mainImage).width(1200).height(630).url() : undefined,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt,
    author: post.author
      ? {
          '@type': 'Person',
          name: post.author.name,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Visionary Advance',
      logo: {
        '@type': 'ImageObject',
        url: 'https://visionaryadvance.com/VALogo.png',
      },
    },
    description: post.excerpt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://visionaryadvance.com/blog/${post.slug.current}`,
    },
  };

  // Generate breadcrumb structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: 'https://visionaryadvance.com' },
    { name: 'Blog', url: 'https://visionaryadvance.com/blog' },
    { name: post.title, url: `https://visionaryadvance.com/blog/${post.slug.current}` },
  ]);

  // Extract headings for table of contents
  const headings = extractHeadings(post.body);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Breadcrumb JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen bg-[#191E1E]">
        {/* Hero */}
        <BlogHero post={post} />

        {/* Content with Sidebar */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
          <div className={headings.length > 0 ? 'lg:grid lg:grid-cols-[1fr_280px] lg:gap-12' : ''}>
            {/* Main Content */}
            <article className={headings.length > 0 ? 'max-w-4xl' : 'max-w-4xl mx-auto'}>
              <BlogPostContent body={post.body} />

              {/* Social Share */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <SocialShare
                  title={post.title}
                  url={`https://visionaryadvance.com/blog/${post.slug.current}`}
                />
              </div>
            </article>

            {/* Table of Contents Sidebar */}
            {headings.length > 0 && (
              <aside>
                <TableOfContents headings={headings} />
              </aside>
            )}
          </div>
        </div>

        {/* Author Bio */}
        {post.author && (
          <section className="max-w-4xl mx-auto px-4 md:px-8 pb-16">
            <div className="bg-black/30 border border-white/10 rounded-xl p-8">
              <h3 className="font-anton text-xl text-white mb-4">About the Author</h3>
              <div className="flex items-start gap-4">
                {post.author.image?.asset && (
                  <img
                    src={urlForImage(post.author.image).width(80).height(80).url()}
                    alt={post.author.name}
                    className="w-16 h-16 rounded-full"
                  />
                )}
                <div>
                  <h4 className="font-manrope font-bold text-white text-lg mb-2">
                    {post.author.name}
                  </h4>
                  {post.author.bio && (
                    <p className="font-manrope text-gray-300 text-sm">
                      {post.author.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Lead Capture CTA */}
        <section className="max-w-4xl mx-auto px-4 md:px-8 pb-16">
          <BlogCTA categories={post.categories || []} />
        </section>

        {/* Related Posts */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <RelatedPosts posts={post.relatedPosts} />
        )}
      </main>
    </>
  );
}

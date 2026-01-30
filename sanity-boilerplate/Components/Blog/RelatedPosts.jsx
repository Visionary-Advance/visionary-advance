// Components/Blog/RelatedPosts.jsx
// Related posts section

import BlogPostCard from './BlogPostCard';

export default function RelatedPosts({ posts }) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
      <h2 className="font-anton text-3xl md:text-4xl text-white mb-8">
        Related Articles
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogPostCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
}

// app/blog/rss.xml/route.js
// RSS feed generation for blog posts

import { getAllPosts } from '@/lib/sanity';

export async function GET() {
  const posts = await getAllPosts({ limit: 50 });
  const baseUrl = 'https://visionaryadvance.com';

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Visionary Advance Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Expert insights on web design, SEO, and digital marketing strategies for construction companies.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug.current}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${post.slug.current}</guid>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      ${post.categories ? post.categories.map(cat => `<category>${cat.title}</category>`).join('\n      ') : ''}
      ${post.author ? `<author>${post.author.name}</author>` : ''}
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

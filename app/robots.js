// app/robots.js
// Dynamic robots.txt generation for Next.js

export default function robots() {
  const baseUrl = 'https://visionaryadvance.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/login',
          '/api/',
          '/connect-square',
          '/connect-jobber',
          '/connect-facebook',
          '/square/',
          '/proposals/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

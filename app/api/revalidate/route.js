// app/api/revalidate/route.js
// Webhook endpoint for Sanity to trigger on-demand revalidation

import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Verify webhook secret for security
    const secret = request.headers.get('x-sanity-webhook-secret');

    if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
      console.error('Invalid webhook secret');
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const body = await request.json();

    if (!body || !body._type) {
      console.error('Invalid webhook payload:', body);
      return NextResponse.json(
        { message: 'Invalid payload' },
        { status: 400 }
      );
    }

    const { _type, slug } = body;
    const paths = [];

    console.log(`[Revalidate] Received webhook for ${_type}:`, slug?.current || 'unknown');

    // Determine which paths to revalidate based on content type
    switch (_type) {
      case 'post':
        // Revalidate blog listing
        paths.push('/blog');

        // Revalidate the specific post page if slug exists
        if (slug?.current) {
          paths.push(`/blog/${slug.current}`);
        }

        // Revalidate category pages (if post has categories)
        if (body.categories) {
          for (const category of body.categories) {
            if (category.slug?.current) {
              paths.push(`/blog/category/${category.slug.current}`);
            }
          }
        }

        // Revalidate tag pages (if post has tags)
        if (body.tags) {
          for (const tag of body.tags) {
            if (tag.slug?.current) {
              paths.push(`/blog/tag/${tag.slug.current}`);
            }
          }
        }

        // Revalidate series page (if post is part of series)
        if (body.series?.slug?.current) {
          paths.push(`/blog/series/${body.series.slug.current}`);
        }

        // Revalidate homepage if post is featured
        if (body.featured) {
          paths.push('/');
        }
        break;

      case 'category':
        // Revalidate blog listing (shows categories)
        paths.push('/blog');

        // Revalidate the category archive page
        if (slug?.current) {
          paths.push(`/blog/category/${slug.current}`);
        }
        break;

      case 'tag':
        // Revalidate blog listing
        paths.push('/blog');

        // Revalidate the tag archive page
        if (slug?.current) {
          paths.push(`/blog/tag/${slug.current}`);
        }
        break;

      case 'series':
        // Revalidate blog listing
        paths.push('/blog');

        // Revalidate the series page
        if (slug?.current) {
          paths.push(`/blog/series/${slug.current}`);
        }
        break;

      case 'author':
        // Revalidate all posts by this author
        // For now, just revalidate blog listing
        paths.push('/blog');
        break;

      default:
        console.warn(`[Revalidate] Unknown content type: ${_type}`);
        return NextResponse.json(
          { message: 'Unknown content type' },
          { status: 400 }
        );
    }

    // Revalidate all affected paths
    const results = [];
    for (const path of paths) {
      try {
        revalidatePath(path);
        results.push({ path, status: 'success' });
        console.log(`[Revalidate] ✓ ${path}`);
      } catch (error) {
        results.push({ path, status: 'error', error: error.message });
        console.error(`[Revalidate] ✗ ${path}:`, error);
      }
    }

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      type: _type,
      slug: slug?.current,
      paths: results,
    });

  } catch (error) {
    console.error('[Revalidate] Error:', error);
    return NextResponse.json(
      {
        message: 'Error revalidating',
        error: error.message
      },
      { status: 500 }
    );
  }
}

// Optional: Handle GET requests for testing
export async function GET(request) {
  return NextResponse.json({
    message: 'Revalidation webhook endpoint',
    method: 'POST',
    documentation: 'Send POST requests from Sanity webhooks to trigger revalidation',
  });
}

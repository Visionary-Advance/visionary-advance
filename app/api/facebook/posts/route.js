import { NextResponse } from 'next/server';
import { getPagePosts, getFacebookAccount, getInstagramMedia } from '@/lib/facebook';

// GET /api/facebook/posts?page=<facebook page ID>&limit=10
// Returns the page's Facebook posts plus its linked Instagram account's media.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const pageId = searchParams.get('page');

  try {
    const account = await getFacebookAccount(pageId);

    if (!account) {
      return NextResponse.json(
        { error: 'No Facebook page connected' },
        { status: 404 }
      );
    }

    // Instagram is best-effort: a missing permission or unlinked account shouldn't hide the Facebook posts
    const [posts, instagram] = await Promise.all([
      getPagePosts(limit, account.account_id),
      getInstagramMedia(account, limit).catch((err) => {
        console.error('❌ Error fetching Instagram media:', err);
        return [];
      })
    ]);

    return NextResponse.json({
      success: true,
      pageId: account.account_id,
      pageName: account.account_name,
      instagramUsername: account.instagram_username,
      posts: posts,
      instagram: instagram
    });

  } catch (err) {
    console.error('❌ Error fetching Facebook posts:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

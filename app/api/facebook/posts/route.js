import { NextResponse } from 'next/server';
import { getPagePosts, getFacebookAccount } from '@/lib/facebook';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  try {
    const account = await getFacebookAccount();

    if (!account) {
      return NextResponse.json(
        { error: 'No Facebook page connected' },
        { status: 404 }
      );
    }

    const posts = await getPagePosts(limit);

    return NextResponse.json({
      success: true,
      pageId: account.account_id,
      pageName: account.account_name,
      posts: posts
    });

  } catch (err) {
    console.error('❌ Error fetching Facebook posts:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

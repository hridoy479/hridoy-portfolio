import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { blogIds, userIdentifier } = await request.json();

    if (!userIdentifier || !blogIds || !Array.isArray(blogIds)) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Fetch all likes for this user and these blogs in one query
    const { data, error } = await supabase
      .from('user_likes')
      .select('content_id')
      .eq('user_identifier', userIdentifier)
      .eq('content_type', 'blog')
      .in('content_id', blogIds);

    if (error) throw error;

    // Return array of liked blog IDs
    const likedIds = data.map(item => item.content_id);
    return NextResponse.json({ likedIds });
  } catch (error: any) {
    console.error('Error fetching batch likes:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch likes' },
      { status: 500 }
    );
  }
}

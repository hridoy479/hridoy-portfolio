import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { projectIds, userIdentifier } = await request.json();

    if (!userIdentifier || !projectIds || !Array.isArray(projectIds)) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Fetch all likes for this user and these projects in one query
    const { data, error } = await supabase
      .from('user_likes')
      .select('content_id')
      .eq('user_identifier', userIdentifier)
      .eq('content_type', 'project')
      .in('content_id', projectIds.map(String));

    if (error) throw error;

    // Return array of liked project IDs (convert back to numbers)
    const likedIds = data.map(item => parseInt(item.content_id));
    return NextResponse.json({ likedIds });
  } catch (error: any) {
    console.error('Error fetching batch likes:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch likes' },
      { status: 500 }
    );
  }
}

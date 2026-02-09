import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const { userIdentifier } = await request.json();

    if (!userIdentifier) {
      return NextResponse.json(
        { error: 'User identifier is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Check if already liked
    const { data: existingLike } = await supabase
      .from('user_likes')
      .select('*')
      .eq('user_identifier', userIdentifier)
      .eq('content_type', 'blog')
      .eq('content_id', id)
      .single();

    if (existingLike) {
      // Unlike: remove like and decrement counter
      const { error: deleteError } = await supabase
        .from('user_likes')
        .delete()
        .eq('user_identifier', userIdentifier)
        .eq('content_type', 'blog')
        .eq('content_id', id);

      if (deleteError) {
        console.error('Error deleting like:', deleteError);
        throw deleteError;
      }

      const { error: decrementError } = await supabase.rpc('decrement_blog_likes', { blog_id: id });
      
      if (decrementError) {
        console.error('Error decrementing likes:', decrementError);
        throw decrementError;
      }

      return NextResponse.json({ liked: false });
    } else {
      // Like: add like and increment counter
      const { error: insertError } = await supabase
        .from('user_likes')
        .insert([{
          user_identifier: userIdentifier,
          content_type: 'blog',
          content_id: id
        }]);

      if (insertError) {
        console.error('Error inserting like:', insertError);
        throw insertError;
      }

      const { error: incrementError } = await supabase.rpc('increment_blog_likes', { blog_id: id });
      
      if (incrementError) {
        console.error('Error incrementing likes:', incrementError);
        throw incrementError;
      }

      return NextResponse.json({ liked: true });
    }
  } catch (error: any) {
    console.error('Error toggling blog like:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to toggle like' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userIdentifier = searchParams.get('userIdentifier');

    if (!userIdentifier) {
      return NextResponse.json({ liked: false });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data } = await supabase
      .from('user_likes')
      .select('*')
      .eq('user_identifier', userIdentifier)
      .eq('content_type', 'blog')
      .eq('content_id', id)
      .single();

    return NextResponse.json({ liked: !!data });
  } catch (error) {
    return NextResponse.json({ liked: false });
  }
}

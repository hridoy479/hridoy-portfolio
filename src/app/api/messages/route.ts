import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Use admin client to bypass RLS for fetching messages in dashboard
    const client = supabaseAdmin || supabase;
    
    const { data, error } = await client
      .from('messages')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const message = await request.json();
    
    // Use admin client to bypass RLS for public contact form submissions
    const client = supabaseAdmin || supabase;
    
    const { data, error } = await client
      .from('messages')
      .insert([message])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to create message' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const message = await request.json();
    
    // Use admin client to bypass RLS for updating messages
    const client = supabaseAdmin || supabase;
    
    const { data, error } = await client
      .from('messages')
      .update(message)
      .eq('id', message.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Message ID is required' },
        { status: 400 }
      );
    }

    // Use admin client to bypass RLS for deleting messages
    const client = supabaseAdmin || supabase;

    const { error } = await client
      .from('messages')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}

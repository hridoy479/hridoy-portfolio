import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('year', { ascending: false });

    if (error) throw error;

    // Transform snake_case to camelCase for frontend
    const transformedData = data.map(project => ({
      id: project.id,
      year: project.year,
      type: project.type,
      titlePart1: project.title_part1,
      titlePart2: project.title_part2,
      imageSrc: project.image_src,
      imageAlt: project.image_alt,
      gradientClass: project.gradient_class,
      aiPowered: project.ai_powered,
      techIcons: project.tech_icons,
      likes: project.likes,
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const project = await request.json();
    
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: authHeader ? { Authorization: authHeader } : {},
        },
      }
    );
    
    // Transform camelCase to snake_case for database
    const dbProject = {
      year: project.year,
      type: project.type,
      title_part1: project.titlePart1,
      title_part2: project.titlePart2,
      image_src: project.imageSrc,
      image_alt: project.imageAlt,
      gradient_class: project.gradientClass,
      ai_powered: project.aiPowered,
      tech_icons: project.techIcons,
      likes: project.likes || 0,
    };

    const { data, error } = await supabase
      .from('projects')
      .insert([dbProject])
      .select()
      .single();

    if (error) throw error;

    // Transform back to camelCase
    const transformedData = {
      id: data.id,
      year: data.year,
      type: data.type,
      titlePart1: data.title_part1,
      titlePart2: data.title_part2,
      imageSrc: data.image_src,
      imageAlt: data.image_alt,
      gradientClass: data.gradient_class,
      aiPowered: data.ai_powered,
      techIcons: data.tech_icons,
      likes: data.likes,
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const project = await request.json();
    
    const authHeader = request.headers.get('authorization');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: authHeader ? { Authorization: authHeader } : {},
        },
      }
    );
    
    // Transform camelCase to snake_case for database
    const dbProject = {
      year: project.year,
      type: project.type,
      title_part1: project.titlePart1,
      title_part2: project.titlePart2,
      image_src: project.imageSrc,
      image_alt: project.imageAlt,
      gradient_class: project.gradientClass,
      ai_powered: project.aiPowered,
      tech_icons: project.techIcons,
      likes: project.likes,
    };

    const { data, error } = await supabase
      .from('projects')
      .update(dbProject)
      .eq('id', project.id)
      .select()
      .single();

    if (error) throw error;

    // Transform back to camelCase
    const transformedData = {
      id: data.id,
      year: data.year,
      type: data.type,
      titlePart1: data.title_part1,
      titlePart2: data.title_part2,
      imageSrc: data.image_src,
      imageAlt: data.image_alt,
      gradientClass: data.gradient_class,
      aiPowered: data.ai_powered,
      techIcons: data.tech_icons,
      likes: data.likes,
    };

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
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
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const authHeader = request.headers.get('authorization');
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: authHeader ? { Authorization: authHeader } : {},
        },
      }
    );

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', parseInt(id));

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}

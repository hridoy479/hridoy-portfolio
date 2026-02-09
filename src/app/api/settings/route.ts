import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*');

    if (error) throw error;

    // Transform array to object format
    const settings: any = {};
    data.forEach(item => {
      settings[item.section] = item.data;
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const settings = await request.json();
    
    // Update hero section
    if (settings.hero) {
      const { error: heroError } = await supabase
        .from('site_settings')
        .update({ data: settings.hero })
        .eq('section', 'hero');

      if (heroError) throw heroError;
    }

    // Update about section
    if (settings.about) {
      const { error: aboutError } = await supabase
        .from('site_settings')
        .update({ data: settings.about })
        .eq('section', 'about');

      if (aboutError) throw aboutError;
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Settings saved successfully' 
    });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const regencyId = searchParams.get('regency_id');

  let query = supabase.from('districts').select('*');

  if (regencyId) {
    query = query.eq('regency_id', regencyId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching districts:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
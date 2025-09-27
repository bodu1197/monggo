import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provinceId = searchParams.get('province_id');

  let query = supabase.from('regencies').select('*');

  if (provinceId) {
    query = query.eq('province_id', provinceId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching regencies:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
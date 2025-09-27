import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // 1. Input validation
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    // 2. Check if user already exists
    const { data: existingUser, error: selectError } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116: 'No rows found'
        console.error('Error checking for existing user:', selectError);
        return NextResponse.json({ error: 'Database error while checking user.' }, { status: 500 });
    }

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists.' }, { status: 409 });
    }

    // 3. Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4. Insert the new user into the database
    const { data, error: insertError } = await supabase
      .from('users')
      .insert([{ email, password: passwordHash, name }])
      .select('id, email, name, created_at')
      .single();

    if (insertError) {
      console.error('Error inserting new user:', insertError);
      return NextResponse.json({ error: 'Failed to create user.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'User created successfully', user: data }, { status: 201 });

  } catch (error) {
    console.error('Signup API Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
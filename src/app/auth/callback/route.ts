import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  // Check if Supabase is configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    // Redirect to login with error if Supabase is not configured
    return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=supabase_not_configured`);
  }

  if (code) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to dashboard after successful authentication
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
    }
  }

  // Redirect to login page if there was an error or no code
  return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_callback_error`);
}
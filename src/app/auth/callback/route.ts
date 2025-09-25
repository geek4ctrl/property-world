import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect to dashboard after successful authentication
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
    }
  }

  // Redirect to login page if there was an error or no code
  return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_callback_error`);
}
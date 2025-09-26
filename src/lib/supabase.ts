import { createClient } from '@supabase/supabase-js'

// Get environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Check if Supabase is properly configured
const isSupabaseConfigured = 
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('placeholder') &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id') &&
  !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.includes('your-anon-key') &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith('https://') &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 100 // Supabase anon keys are JWT tokens, typically > 100 chars

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Helper to check if Supabase is available
export const isSupabaseAvailable = () => isSupabaseConfigured

// Auth helper functions
export const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
  if (!isSupabaseConfigured) {
    // Development mode - simulate successful signup
    console.warn('⚠️ Supabase not configured - using mock authentication')
    return { 
      data: { 
        user: { 
          email, 
          id: 'mock-user-id',
          user_metadata: metadata 
        } 
      }, 
      error: null 
    }
  }
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  if (!isSupabaseConfigured) {
    // Development mode - simulate successful signin
    console.warn('⚠️ Supabase not configured - using mock authentication')
    return { 
      data: { 
        user: { 
          email, 
          id: 'mock-user-id',
          user_metadata: { email }
        },
        session: {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token'
        }
      }, 
      error: null 
    }
  }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  if (!isSupabaseConfigured) {
    return { error: { message: 'Supabase is not configured' } }
  }
  
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  if (!isSupabaseConfigured) {
    return { user: null, error: { message: 'Supabase is not configured' } }
  }
  
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const resetPassword = async (email: string) => {
  if (!isSupabaseConfigured) {
    return { data: null, error: { message: 'Supabase is not configured' } }
  }
  
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  })
  return { data, error }
}

export const updatePassword = async (password: string) => {
  if (!isSupabaseConfigured) {
    return { data: null, error: { message: 'Supabase is not configured' } }
  }
  
  const { data, error } = await supabase.auth.updateUser({
    password,
  })
  return { data, error }
}
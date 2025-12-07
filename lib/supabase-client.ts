import { createBrowserClient } from '@supabase/ssr'

// Client-side Supabase client for browser (use in client components)
// This properly handles cookies for session persistence
export function createClientSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}




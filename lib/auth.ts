'use client'

import { createClientSupabase } from './supabase-client'

export async function signIn(email: string, password: string) {
  const supabase = createClientSupabase()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const supabase = createClientSupabase()
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getSession() {
  const supabase = createClientSupabase()
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

export async function getUser() {
  const supabase = createClientSupabase()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}


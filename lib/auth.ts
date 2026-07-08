// lib/auth.ts
import type { SupabaseClient } from '@supabase/supabase-js'

export async function signInWithPassword(
  supabase: SupabaseClient,
  email: string,
  password: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Email o contraseña incorrectos' }
  }

  return { error: null }
}

export async function signOut(supabase: SupabaseClient) {
  const { error } = await supabase.auth.signOut()
  return { error }
}

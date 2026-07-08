// app/admin/login/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signInWithPassword } from '@/lib/auth'

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')

  const supabase = await createClient()
  const { error } = await signInWithPassword(supabase, email, password)

  if (error) {
    redirect('/admin/login?error=1')
  }

  redirect('/admin')
}

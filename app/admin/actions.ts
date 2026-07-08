// app/admin/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/lib/auth'

export async function logoutAction() {
  const supabase = await createClient()
  await signOut(supabase)
  redirect('/admin/login')
}

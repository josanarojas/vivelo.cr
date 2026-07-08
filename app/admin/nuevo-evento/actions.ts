// app/admin/nuevo-evento/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createEvent } from '@/lib/events'
import { validateEventForm, buildSubmittedValueParams } from './validate'

export async function createEventAction(formData: FormData) {
  const { value, errors } = validateEventForm(formData)

  if (!value) {
    const params = new URLSearchParams(errors)
    const submitted = buildSubmittedValueParams(formData)
    submitted.forEach((val, key) => params.set(key, val))
    redirect(`/admin/nuevo-evento?${params.toString()}`)
  }

  const supabase = await createClient()
  const { error } = await createEvent(supabase, value)

  if (error) {
    const params = new URLSearchParams({ error: 'No se pudo crear el evento' })
    const submitted = buildSubmittedValueParams(formData)
    submitted.forEach((val, key) => params.set(key, val))
    redirect(`/admin/nuevo-evento?${params.toString()}`)
  }

  revalidatePath('/admin')
  redirect('/admin')
}

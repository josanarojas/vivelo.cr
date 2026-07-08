// app/admin/eventos/[id]/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { updateEvent, deleteEvent } from '@/lib/events'
import { validateEventForm, buildSubmittedValueParams } from '@/app/admin/nuevo-evento/validate'

export async function updateEventAction(id: string, formData: FormData) {
  const { value, errors } = validateEventForm(formData)

  if (!value) {
    const params = new URLSearchParams(errors)
    const submitted = buildSubmittedValueParams(formData)
    submitted.forEach((val, key) => params.set(key, val))
    redirect(`/admin/eventos/${id}?${params.toString()}`)
  }

  // `estado` is not editable from this form (no UI control for it) — strip it
  // so updating an event never resets its estado back to 'borrador'.
  const { estado: _estado, ...updatePayload } = value

  const supabase = await createClient()
  const { error } = await updateEvent(supabase, id, updatePayload)

  if (error) {
    const params = new URLSearchParams({ error: 'No se pudo actualizar el evento' })
    const submitted = buildSubmittedValueParams(formData)
    submitted.forEach((val, key) => params.set(key, val))
    redirect(`/admin/eventos/${id}?${params.toString()}`)
  }

  revalidatePath('/admin')
  redirect('/admin')
}

export async function deleteEventAction(id: string) {
  const supabase = await createClient()
  const { error } = await deleteEvent(supabase, id)

  if (error) {
    redirect(`/admin/eventos/${id}?error=No se pudo eliminar el evento`)
  }

  revalidatePath('/admin')
  redirect('/admin')
}

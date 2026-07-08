// app/admin/eventos/[id]/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { updateEvent, deleteEvent } from '@/lib/events'
import { validateEventForm } from '@/app/admin/nuevo-evento/validate'

export async function updateEventAction(id: string, formData: FormData) {
  const { value, errors } = validateEventForm(formData)

  if (!value) {
    const params = new URLSearchParams(errors)
    const fields = ['nombre', 'tipo_evento', 'fecha_evento', 'ubicacion', 'slug', 'paquete']
    for (const field of fields) {
      const raw = formData.get(field)
      if (raw !== null) {
        params.set(`v_${field}`, String(raw))
      }
    }
    redirect(`/admin/eventos/${id}?${params.toString()}`)
  }

  const supabase = await createClient()
  const { error } = await updateEvent(supabase, id, value)

  if (error) {
    redirect(`/admin/eventos/${id}?error=No se pudo actualizar el evento`)
  }

  revalidatePath('/admin')
  redirect('/admin')
}

export async function deleteEventAction(id: string) {
  const supabase = await createClient()
  await deleteEvent(supabase, id)

  revalidatePath('/admin')
  redirect('/admin')
}

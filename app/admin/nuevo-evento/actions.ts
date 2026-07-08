// app/admin/nuevo-evento/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createEvent } from '@/lib/events'
import { validateEventForm } from './validate'

export async function createEventAction(formData: FormData) {
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
    redirect(`/admin/nuevo-evento?${params.toString()}`)
  }

  const supabase = await createClient()
  const { error } = await createEvent(supabase, value)

  if (error) {
    redirect('/admin/nuevo-evento?error=No se pudo crear el evento')
  }

  revalidatePath('/admin')
  redirect('/admin')
}

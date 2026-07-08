// app/admin/nuevo-evento/validate.ts
import type { EventPackage } from '@/types/database'

const VALID_PACKAGES: EventPackage[] = ['esencial', 'clasico', 'premium']

export interface EventFormValue {
  nombre: string
  tipo_evento: string
  fecha_evento: string
  ubicacion: string
  slug: string
  paquete: EventPackage
  estado: 'borrador'
}

const FORM_FIELDS = ['nombre', 'tipo_evento', 'fecha_evento', 'ubicacion', 'slug', 'paquete'] as const

/**
 * Builds `v_*` params that carry the submitted (unvalidated) form values so a
 * redirect can repopulate the form instead of wiping it out.
 */
export function buildSubmittedValueParams(formData: FormData): URLSearchParams {
  const params = new URLSearchParams()
  for (const field of FORM_FIELDS) {
    const raw = formData.get(field)
    if (raw !== null) {
      params.set(`v_${field}`, String(raw))
    }
  }
  return params
}

export function validateEventForm(formData: FormData): {
  value: EventFormValue | null
  errors: Record<string, string>
} {
  const nombre = String(formData.get('nombre') ?? '').trim()
  const tipo_evento = String(formData.get('tipo_evento') ?? '').trim()
  const fecha_evento = String(formData.get('fecha_evento') ?? '').trim()
  const ubicacion = String(formData.get('ubicacion') ?? '').trim()
  const slug = String(formData.get('slug') ?? '').trim()
  const paquete = String(formData.get('paquete') ?? '').trim()

  const errors: Record<string, string> = {}

  if (!nombre) errors.nombre = 'El nombre es requerido'
  if (!tipo_evento) errors.tipo_evento = 'El tipo de evento es requerido'
  if (!fecha_evento) errors.fecha_evento = 'La fecha es requerida'
  if (!ubicacion) errors.ubicacion = 'La ubicación es requerida'
  if (!slug) errors.slug = 'El slug es requerido'
  if (!VALID_PACKAGES.includes(paquete as EventPackage)) {
    errors.paquete = 'Selecciona un paquete válido'
  }

  if (Object.keys(errors).length > 0) {
    return { value: null, errors }
  }

  return {
    value: {
      nombre,
      tipo_evento,
      fecha_evento,
      ubicacion,
      slug,
      paquete: paquete as EventPackage,
      estado: 'borrador',
    },
    errors: {},
  }
}

// app/admin/nuevo-evento/__tests__/validate.test.ts
import { describe, it, expect } from 'vitest'
import { validateEventForm } from '@/app/admin/nuevo-evento/validate'

function buildFormData(overrides: Record<string, string> = {}) {
  const defaults = {
    nombre: 'Boda de Ana y Luis',
    tipo_evento: 'boda',
    fecha_evento: '2026-12-01T18:00',
    ubicacion: 'San José, Costa Rica',
    slug: 'ana-luis-2026',
    paquete: 'clasico',
  }
  const data = new FormData()
  for (const [key, value] of Object.entries({ ...defaults, ...overrides })) {
    data.set(key, value)
  }
  return data
}

describe('validateEventForm', () => {
  it('returns parsed input with no errors for valid data', () => {
    const result = validateEventForm(buildFormData())

    expect(result.errors).toEqual({})
    expect(result.value).toEqual({
      nombre: 'Boda de Ana y Luis',
      tipo_evento: 'boda',
      fecha_evento: '2026-12-01T18:00',
      ubicacion: 'San José, Costa Rica',
      slug: 'ana-luis-2026',
      paquete: 'clasico',
      estado: 'borrador',
    })
  })

  it('requires nombre', () => {
    const result = validateEventForm(buildFormData({ nombre: '' }))
    expect(result.errors.nombre).toBe('El nombre es requerido')
  })

  it('requires a valid fecha_evento', () => {
    const result = validateEventForm(buildFormData({ fecha_evento: '' }))
    expect(result.errors.fecha_evento).toBe('La fecha es requerida')
  })

  it('requires paquete to be one of the known values', () => {
    const result = validateEventForm(buildFormData({ paquete: 'oro' }))
    expect(result.errors.paquete).toBe('Selecciona un paquete válido')
  })
})

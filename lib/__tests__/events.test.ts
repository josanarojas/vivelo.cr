// lib/__tests__/events.test.ts
import { describe, it, expect, vi } from 'vitest'
import { listEvents, getEvent, createEvent, updateEvent, deleteEvent } from '@/lib/events'

function mockSupabase(overrides: Record<string, any> = {}) {
  const chain: any = {
    select: vi.fn(() => chain),
    insert: vi.fn(() => chain),
    update: vi.fn(() => chain),
    delete: vi.fn(() => chain),
    eq: vi.fn(() => chain),
    single: vi.fn(() => Promise.resolve({ data: overrides.single ?? null, error: overrides.error ?? null })),
    order: vi.fn(() => Promise.resolve({ data: overrides.list ?? [], error: overrides.error ?? null })),
    ...overrides.chainOverrides,
  }
  return { from: vi.fn(() => chain), _chain: chain }
}

describe('listEvents', () => {
  it('returns events ordered by fecha_evento', async () => {
    const events = [{ id: '1', nombre: 'Boda' }]
    const supabase = mockSupabase({ list: events })

    const result = await listEvents(supabase as any)

    expect(supabase.from).toHaveBeenCalledWith('events')
    expect(supabase._chain.select).toHaveBeenCalledWith('*')
    expect(supabase._chain.order).toHaveBeenCalledWith('fecha_evento', { ascending: true })
    expect(result).toEqual({ data: events, error: null })
  })
})

describe('getEvent', () => {
  it('returns a single event by id', async () => {
    const event = { id: '1', nombre: 'Boda' }
    const supabase = mockSupabase({ single: event })

    const result = await getEvent(supabase as any, '1')

    expect(supabase._chain.eq).toHaveBeenCalledWith('id', '1')
    expect(result).toEqual({ data: event, error: null })
  })
})

describe('createEvent', () => {
  it('inserts a new event and returns it', async () => {
    const input = {
      nombre: 'Boda de Ana y Luis',
      tipo_evento: 'boda',
      fecha_evento: '2026-12-01T18:00:00Z',
      ubicacion: 'San José',
      slug: 'ana-luis-2026',
      paquete: 'clasico' as const,
      estado: 'borrador' as const,
    }
    const created = { id: '1', created_at: '2026-07-07T00:00:00Z', ...input }
    const supabase = mockSupabase({ single: created })

    const result = await createEvent(supabase as any, input)

    expect(supabase._chain.insert).toHaveBeenCalledWith(input)
    expect(result).toEqual({ data: created, error: null })
  })
})

describe('updateEvent', () => {
  it('updates an event by id', async () => {
    const updated = { id: '1', nombre: 'Nuevo nombre' }
    const supabase = mockSupabase({ single: updated })

    const result = await updateEvent(supabase as any, '1', { nombre: 'Nuevo nombre' })

    expect(supabase._chain.update).toHaveBeenCalledWith({ nombre: 'Nuevo nombre' })
    expect(supabase._chain.eq).toHaveBeenCalledWith('id', '1')
    expect(result).toEqual({ data: updated, error: null })
  })
})

describe('deleteEvent', () => {
  it('deletes an event by id', async () => {
    const supabase = mockSupabase({ single: null })

    const result = await deleteEvent(supabase as any, '1')

    expect(supabase._chain.delete).toHaveBeenCalled()
    expect(supabase._chain.eq).toHaveBeenCalledWith('id', '1')
    expect(result).toEqual({ data: null, error: null })
  })
})

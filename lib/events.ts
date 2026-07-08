// lib/events.ts
import type { Database, EventRow } from '@/types/database'
import type { SupabaseClient } from '@supabase/supabase-js'

type Client = SupabaseClient<Database>
type EventInsert = Database['public']['Tables']['events']['Insert']
type EventUpdate = Database['public']['Tables']['events']['Update']

export async function listEvents(supabase: Client) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('fecha_evento', { ascending: true })

  return { data: data as EventRow[] | null, error }
}

export async function getEvent(supabase: Client, id: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  return { data: data as EventRow | null, error }
}

export async function createEvent(supabase: Client, input: EventInsert) {
  const { data, error } = await supabase
    .from('events')
    .insert(input)
    .select('*')
    .single()

  return { data: data as EventRow | null, error }
}

export async function updateEvent(supabase: Client, id: string, input: EventUpdate) {
  const { data, error } = await supabase
    .from('events')
    .update(input)
    .eq('id', id)
    .select('*')
    .single()

  return { data: data as EventRow | null, error }
}

export async function deleteEvent(supabase: Client, id: string) {
  const { error } = await supabase.from('events').delete().eq('id', id)
  return { data: null, error: error ?? null }
}

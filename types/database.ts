// types/database.ts
export type EventStatus = 'borrador' | 'activo' | 'finalizado'
export type EventPackage = 'esencial' | 'clasico' | 'premium'

export interface EventRow {
  id: string
  created_at: string
  nombre: string
  tipo_evento: string
  fecha_evento: string
  ubicacion: string
  slug: string
  paquete: EventPackage
  estado: EventStatus
}

export interface Database {
  public: {
    Tables: {
      events: {
        Row: Pick<EventRow, keyof EventRow>
        Insert: Omit<EventRow, 'id' | 'created_at'>
        Update: Partial<Omit<EventRow, 'id' | 'created_at'>>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

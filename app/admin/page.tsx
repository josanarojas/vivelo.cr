// app/admin/page.tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { listEvents } from '@/lib/events'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: events, error } = await listEvents(supabase)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Eventos</h1>
        <Link href="/admin/nuevo-evento" className="rounded bg-black px-3 py-2 text-white">
          + Nuevo evento
        </Link>
      </div>

      {error && <p className="text-red-600">No se pudieron cargar los eventos.</p>}

      {!error && events?.length === 0 && <p>No hay eventos todavía.</p>}

      {!error && events && events.length > 0 && (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Nombre</th>
              <th className="py-2">Fecha</th>
              <th className="py-2">Paquete</th>
              <th className="py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b">
                <td className="py-2">
                  <Link href={`/admin/eventos/${event.id}`} className="underline">
                    {event.nombre}
                  </Link>
                </td>
                <td className="py-2">{new Date(event.fecha_evento).toLocaleDateString('es-CR')}</td>
                <td className="py-2">{event.paquete}</td>
                <td className="py-2">{event.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

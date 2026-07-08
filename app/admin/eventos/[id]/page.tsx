// app/admin/eventos/[id]/page.tsx
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getEvent } from '@/lib/events'
import { updateEventAction, deleteEventAction } from './actions'
import { DeleteEventButton } from './DeleteEventButton'

export default async function EditEventoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string>>
}) {
  const { id } = await params
  const query = await searchParams

  const supabase = await createClient()
  const { data: event } = await getEvent(supabase, id)

  if (!event) {
    notFound()
  }

  const boundUpdate = updateEventAction.bind(null, id)
  const boundDelete = deleteEventAction.bind(null, id)

  return (
    <div className="max-w-lg space-y-6">
      <form action={boundUpdate} className="space-y-4">
        <h1 className="text-lg font-semibold">Editar evento</h1>

        {query.error && <p className="text-sm text-red-600">{query.error}</p>}

        <div className="space-y-1">
          <label htmlFor="nombre" className="block text-sm font-medium">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            defaultValue={query.v_nombre ?? event.nombre}
            className="w-full rounded border px-3 py-2"
          />
          {query.nombre && <p className="text-sm text-red-600">{query.nombre}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="tipo_evento" className="block text-sm font-medium">Tipo de evento</label>
          <select
            id="tipo_evento"
            name="tipo_evento"
            defaultValue={query.v_tipo_evento ?? event.tipo_evento}
            className="w-full rounded border px-3 py-2"
          >
            <option value="boda">Boda</option>
            <option value="cumpleanos">Cumpleaños</option>
            <option value="otro">Otro</option>
          </select>
          {query.tipo_evento && <p className="text-sm text-red-600">{query.tipo_evento}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="fecha_evento" className="block text-sm font-medium">Fecha y hora</label>
          <input
            id="fecha_evento"
            name="fecha_evento"
            type="datetime-local"
            defaultValue={query.v_fecha_evento ?? event.fecha_evento.slice(0, 16)}
            className="w-full rounded border px-3 py-2"
          />
          {query.fecha_evento && <p className="text-sm text-red-600">{query.fecha_evento}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="ubicacion" className="block text-sm font-medium">Ubicación</label>
          <input
            id="ubicacion"
            name="ubicacion"
            defaultValue={query.v_ubicacion ?? event.ubicacion}
            className="w-full rounded border px-3 py-2"
          />
          {query.ubicacion && <p className="text-sm text-red-600">{query.ubicacion}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="slug" className="block text-sm font-medium">Slug (URL)</label>
          <input
            id="slug"
            name="slug"
            defaultValue={query.v_slug ?? event.slug}
            className="w-full rounded border px-3 py-2"
          />
          {query.slug && <p className="text-sm text-red-600">{query.slug}</p>}
        </div>

        <div className="space-y-1">
          <label htmlFor="paquete" className="block text-sm font-medium">Paquete</label>
          <select
            id="paquete"
            name="paquete"
            defaultValue={query.v_paquete ?? event.paquete}
            className="w-full rounded border px-3 py-2"
          >
            <option value="esencial">Esencial</option>
            <option value="clasico">Clásico</option>
            <option value="premium">Premium</option>
          </select>
          {query.paquete && <p className="text-sm text-red-600">{query.paquete}</p>}
        </div>

        <button type="submit" className="rounded bg-black px-4 py-2 text-white">
          Guardar cambios
        </button>
      </form>

      <DeleteEventButton action={boundDelete} />
    </div>
  )
}

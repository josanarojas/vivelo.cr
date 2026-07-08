// app/admin/nuevo-evento/page.tsx
import { createEventAction } from './actions'

export default async function NuevoEventoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams

  return (
    <form action={createEventAction} className="max-w-lg space-y-4">
      <h1 className="text-lg font-semibold">Nuevo evento</h1>

      {params.error && <p className="text-sm text-red-600">{params.error}</p>}

      <div className="space-y-1">
        <label htmlFor="nombre" className="block text-sm font-medium">Nombre</label>
        <input id="nombre" name="nombre" className="w-full rounded border px-3 py-2" />
        {params.nombre && <p className="text-sm text-red-600">{params.nombre}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="tipo_evento" className="block text-sm font-medium">Tipo de evento</label>
        <select id="tipo_evento" name="tipo_evento" className="w-full rounded border px-3 py-2">
          <option value="boda">Boda</option>
          <option value="cumpleanos">Cumpleaños</option>
          <option value="otro">Otro</option>
        </select>
        {params.tipo_evento && <p className="text-sm text-red-600">{params.tipo_evento}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="fecha_evento" className="block text-sm font-medium">Fecha y hora</label>
        <input
          id="fecha_evento"
          name="fecha_evento"
          type="datetime-local"
          className="w-full rounded border px-3 py-2"
        />
        {params.fecha_evento && <p className="text-sm text-red-600">{params.fecha_evento}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="ubicacion" className="block text-sm font-medium">Ubicación</label>
        <input id="ubicacion" name="ubicacion" className="w-full rounded border px-3 py-2" />
        {params.ubicacion && <p className="text-sm text-red-600">{params.ubicacion}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="slug" className="block text-sm font-medium">Slug (URL)</label>
        <input id="slug" name="slug" className="w-full rounded border px-3 py-2" />
        {params.slug && <p className="text-sm text-red-600">{params.slug}</p>}
      </div>

      <div className="space-y-1">
        <label htmlFor="paquete" className="block text-sm font-medium">Paquete</label>
        <select id="paquete" name="paquete" className="w-full rounded border px-3 py-2">
          <option value="esencial">Esencial</option>
          <option value="clasico">Clásico</option>
          <option value="premium">Premium</option>
        </select>
        {params.paquete && <p className="text-sm text-red-600">{params.paquete}</p>}
      </div>

      <button type="submit" className="rounded bg-black px-4 py-2 text-white">
        Crear evento
      </button>
    </form>
  )
}

// app/admin/eventos/[id]/DeleteEventButton.tsx
'use client'

export function DeleteEventButton({ action }: { action: () => void }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm('¿Eliminar este evento permanentemente?')) {
          e.preventDefault()
        }
      }}
    >
      <button type="submit" className="rounded border border-red-600 px-4 py-2 text-red-600">
        Eliminar evento
      </button>
    </form>
  )
}

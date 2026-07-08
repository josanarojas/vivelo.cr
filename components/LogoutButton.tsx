// components/LogoutButton.tsx
import { logoutAction } from '@/app/admin/actions'

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit" className="text-sm underline">
        Cerrar sesión
      </button>
    </form>
  )
}

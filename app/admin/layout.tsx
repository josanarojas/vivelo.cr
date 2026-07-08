// app/admin/layout.tsx
import { LogoutButton } from '@/components/LogoutButton'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b p-4">
        <span className="font-semibold">Vívelo.cr — Panel Admin</span>
        <LogoutButton />
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}

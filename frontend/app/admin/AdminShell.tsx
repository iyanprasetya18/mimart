'use client'

import { usePathname, useRouter } from 'next/navigation'

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 px-5 py-2 flex justify-end shrink-0">
        <button
          type="button"
          onClick={logout}
          className="text-sm font-medium text-gray-700 hover:text-black underline-offset-2 hover:underline"
        >
          Logout
        </button>
      </header>

      <div className="flex-1">{children}</div>
    </div>
  )
}

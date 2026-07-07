"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/admin", label: "Inicio", icon: "🏠", exact: true },
  { href: "/admin/contactos", label: "Contactos", icon: "👥" },
  { href: "/admin/emails", label: "Emails", icon: "✉️", exact: true },
  { href: "/admin/emails/historial", label: "Historial", icon: "📋" },
  { href: "/admin/metricas", label: "Métricas", icon: "📊" },
  { href: "/admin/asistente", label: "Asistente", icon: "💬" },
]

type AdminShellProps = {
  children: React.ReactNode
  title: string
  subtitle?: string
}

const isNavActive = (pathname: string, href: string, exact?: boolean) => {
  if (exact) return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

export const AdminShell = ({ children, title, subtitle }: AdminShellProps) => {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/admin/auth/login", { method: "DELETE" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b-2 border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[#0096D6]">
              Air Products · Admin
            </p>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 text-lg text-slate-600">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="rounded-xl border-2 border-slate-300 px-4 py-2 text-base font-semibold text-slate-700 hover:border-[#0096D6] hover:text-[#0096D6]"
            >
              Ver sitio web
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-slate-800 px-4 py-2 text-base font-semibold text-white hover:bg-slate-700"
            >
              Salir
            </button>
          </div>
        </div>

        <nav className="border-t border-slate-100 bg-slate-50" aria-label="Navegación admin">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 sm:px-6">
            {NAV_ITEMS.map((item) => {
              const active = isNavActive(pathname, item.href, item.exact)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-xl px-5 py-3 text-lg font-semibold transition",
                    active
                      ? "bg-[#0096D6] text-white shadow-md"
                      : "text-slate-700 hover:bg-white hover:shadow"
                  )}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  )
}

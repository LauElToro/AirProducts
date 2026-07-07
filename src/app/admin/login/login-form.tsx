"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        setError(data.error ?? "Error de autenticación")
        return
      }

      const from = searchParams.get("from") ?? "/admin"
      router.push(from)
      router.refresh()
    } catch {
      setError("No se pudo conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-lg sm:p-10">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#0096D6]">
            Air Products SRL
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Panel de Administración</h1>
          <p className="mt-2 text-lg text-slate-600">Ingrese sus credenciales para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="mb-2 block text-lg font-semibold text-slate-800">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full rounded-xl border-2 border-slate-300 px-4 py-4 text-lg focus:border-[#0096D6] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-lg font-semibold text-slate-800">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-xl border-2 border-slate-300 px-4 py-4 text-lg focus:border-[#0096D6] focus:outline-none"
            />
          </div>

          {error && (
            <div className="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-lg text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#0096D6] px-6 py-4 text-xl font-bold text-white transition hover:bg-[#007bb5] disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  )
}

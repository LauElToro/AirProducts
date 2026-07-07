"use client"

import { useState } from "react"
import { companyInfo } from "@/data/company"
import { useLocale } from "@/i18n/locale-context"

export const ContactForm = () => {
  const { dict } = useLocale()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const form = e.currentTarget
    const data = new FormData(form)
    const nombre = data.get("nombre") as string
    const email = data.get("email") as string
    const asunto = data.get("asunto") as string
    const mensaje = data.get("mensaje") as string

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, asunto, mensaje }),
      })

      if (!res.ok) {
        const body = (await res.json()) as { error?: string }
        setError(body.error ?? "Error al enviar")
        return
      }

      setSubmitted(true)
    } catch {
      setError("No se pudo enviar el mensaje. Intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="font-semibold text-green-800">{dict.contact.thanks}</p>
        <p className="mt-2 text-sm text-green-700">
          {dict.contact.thanksNote}{" "}
          <a href={`mailto:${companyInfo.email}`} className="underline">
            {companyInfo.email}
          </a>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-slate-700">
          {dict.contact.name}
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-[#0096D6] focus:outline-none focus:ring-1 focus:ring-[#0096D6]"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          {dict.contact.emailField}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-[#0096D6] focus:outline-none focus:ring-1 focus:ring-[#0096D6]"
        />
      </div>
      <div>
        <label htmlFor="asunto" className="block text-sm font-medium text-slate-700">
          {dict.contact.subject}
        </label>
        <input
          id="asunto"
          name="asunto"
          type="text"
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-[#0096D6] focus:outline-none focus:ring-1 focus:ring-[#0096D6]"
        />
      </div>
      <div>
        <label htmlFor="mensaje" className="block text-sm font-medium text-slate-700">
          {dict.contact.message}
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={5}
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-[#0096D6] focus:outline-none focus:ring-1 focus:ring-[#0096D6]"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[#0096D6] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#007bb5] disabled:opacity-60"
      >
        {loading ? "Enviando..." : dict.contact.send}
      </button>
    </form>
  )
}

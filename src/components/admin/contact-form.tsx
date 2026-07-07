"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { Contact, ContactFrequency } from "@/lib/admin/types"

type ContactFormProps = {
  contact?: Contact | null
  title: string
  backHref?: string
}

const EMPTY_FORM = {
  email: "",
  nombre: "",
  apellido: "",
  empresa: "",
  interesProducto: "",
  lugar: "",
  vecesCompro: 0,
  emailsEnviados: 0,
  emailsRecibidos: 0,
  puntosInteres: "",
  frecuencia: "media" as ContactFrequency,
  notas: "",
}

export const ContactForm = ({
  contact,
  title,
  backHref = "/admin/contactos",
}: ContactFormProps) => {
  const router = useRouter()
  const [form, setForm] = useState(
    contact
      ? {
          email: contact.email,
          nombre: contact.nombre ?? "",
          apellido: contact.apellido ?? "",
          empresa: contact.empresa ?? "",
          interesProducto: contact.interesProducto ?? "",
          lugar: contact.lugar ?? "",
          vecesCompro: contact.vecesCompro,
          emailsEnviados: contact.emailsEnviados,
          emailsRecibidos: contact.emailsRecibidos,
          puntosInteres: contact.puntosInteres.join(", "),
          frecuencia: contact.frecuencia,
          notas: contact.notas ?? "",
        }
      : EMPTY_FORM
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const payload = {
      ...form,
      puntosInteres: form.puntosInteres
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }

    try {
      const url = contact ? `/api/admin/contacts/${contact.id}` : "/api/admin/contacts"
      const method = contact ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        setError(data.error ?? "Error al guardar")
        return
      }

      router.push(`/admin/contactos?refresh=${Date.now()}`)
    } catch {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const fieldClass =
    "w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-lg focus:border-[#0096D6] focus:outline-none"

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-lg font-semibold text-[#0096D6] hover:underline"
      >
        ← Volver a contactos
      </Link>

      <div className="mt-6 rounded-2xl border-2 border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Email *">
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={fieldClass}
              />
            </Field>
            <Field label="Empresa">
              <input
                value={form.empresa}
                onChange={(e) => setForm({ ...form, empresa: e.target.value })}
                className={fieldClass}
              />
            </Field>
            <Field label="Nombre">
              <input
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className={fieldClass}
              />
            </Field>
            <Field label="Apellido">
              <input
                value={form.apellido}
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                className={fieldClass}
              />
            </Field>
            <Field label="Ubicación">
              <input
                value={form.lugar}
                onChange={(e) => setForm({ ...form, lugar: e.target.value })}
                className={fieldClass}
                placeholder="Ciudad, país"
              />
            </Field>
            <Field label="Interés en producto">
              <input
                value={form.interesProducto}
                onChange={(e) => setForm({ ...form, interesProducto: e.target.value })}
                className={fieldClass}
                placeholder="Ej: OX300, OX500"
              />
            </Field>
            <Field label="Veces que compró">
              <input
                type="number"
                min={0}
                value={form.vecesCompro}
                onChange={(e) => setForm({ ...form, vecesCompro: Number(e.target.value) })}
                className={fieldClass}
              />
            </Field>
            <Field label="Frecuencia de contacto">
              <select
                value={form.frecuencia}
                onChange={(e) =>
                  setForm({ ...form, frecuencia: e.target.value as ContactFrequency })
                }
                className={fieldClass}
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="muy_alta">Muy alta</option>
              </select>
            </Field>
            <Field label="Emails enviados">
              <input
                type="number"
                min={0}
                value={form.emailsEnviados}
                onChange={(e) => setForm({ ...form, emailsEnviados: Number(e.target.value) })}
                className={fieldClass}
              />
            </Field>
            <Field label="Emails recibidos">
              <input
                type="number"
                min={0}
                value={form.emailsRecibidos}
                onChange={(e) => setForm({ ...form, emailsRecibidos: Number(e.target.value) })}
                className={fieldClass}
              />
            </Field>
          </div>

          <Field label="Puntos de interés (separados por coma)">
            <input
              value={form.puntosInteres}
              onChange={(e) => setForm({ ...form, puntosInteres: e.target.value })}
              className={fieldClass}
              placeholder="Certificación CE, exportación, OX1000"
            />
          </Field>

          <Field label="Notas">
            <textarea
              rows={4}
              value={form.notas}
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
              className={fieldClass}
            />
          </Field>

          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-lg text-red-700">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-[#0096D6] py-3 text-lg font-bold text-white hover:bg-[#007bb5] disabled:opacity-60"
            >
              {loading ? "Guardando..." : "Guardar contacto"}
            </button>
            <Link
              href={backHref}
              className="rounded-xl border-2 border-slate-300 px-6 py-3 text-lg font-semibold text-center"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-base font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  )
}

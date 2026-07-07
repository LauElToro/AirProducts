"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { AdminShell } from "@/components/admin/admin-shell"
import { ContactForm } from "@/components/admin/contact-form"
import type { Contact } from "@/lib/admin/types"

type PageProps = {
  params: Promise<{ id: string }>
}

export default function EditarContactoPage({ params }: PageProps) {
  const { id } = use(params)
  const [contact, setContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false
    fetch(`/api/admin/contacts/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Contacto no encontrado")
        return r.json()
      })
      .then((data: Contact) => {
        if (!cancelled) setContact(data)
      })
      .catch(() => {
        if (!cancelled) setError("No se pudo cargar el contacto")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <AdminShell title="Editar contacto" subtitle="Modifique los datos del contacto">
      {loading && <p className="text-xl text-slate-500">Cargando contacto...</p>}
      {error && (
        <div className="rounded-xl bg-red-50 p-6 text-lg text-red-700">
          {error}
          <Link href="/admin/contactos" className="mt-4 block font-semibold text-[#0096D6]">
            ← Volver a contactos
          </Link>
        </div>
      )}
      {contact && <ContactForm contact={contact} title="Editar contacto" />}
    </AdminShell>
  )
}

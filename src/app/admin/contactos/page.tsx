"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { EditHistoryPanel } from "@/components/admin/edit-history-panel"
import type { Contact, ContactFrequency } from "@/lib/admin/types"
import { cn } from "@/lib/utils"

const FREQ_LABELS: Record<ContactFrequency, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
  muy_alta: "Muy alta",
}

export default function AdminContactosPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Contact | null>(null)

  const loadContacts = () => {
    setLoading(true)
    fetch("/api/admin/contacts")
      .then((r) => r.json())
      .then((data) => setContacts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let cancelled = false
    fetch("/api/admin/contacts")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setContacts(Array.isArray(data) ? data : [])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase()
    return (
      c.email.toLowerCase().includes(q) ||
      (c.nombre?.toLowerCase().includes(q) ?? false) ||
      (c.apellido?.toLowerCase().includes(q) ?? false) ||
      (c.empresa?.toLowerCase().includes(q) ?? false)
    )
  })

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este contacto?")) return
    await fetch(`/api/admin/contacts/${id}`, { method: "DELETE" })
    loadContacts()
    if (selected?.id === id) setSelected(null)
  }

  return (
    <AdminShell
      title="Contactos"
      subtitle="Gestione clientes, leads e historial de comunicaciones"
    >
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <input
          type="search"
          placeholder="Buscar por nombre, email o empresa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[280px] flex-1 rounded-xl border-2 border-slate-300 px-4 py-3 text-lg focus:border-[#0096D6] focus:outline-none"
        />
        <Link
          href="/admin/contactos/nuevo"
          className="rounded-xl bg-[#0096D6] px-6 py-3 text-lg font-bold text-white hover:bg-[#007bb5]"
        >
          + Nuevo contacto
        </Link>
      </div>

      {loading ? (
        <p className="text-xl text-slate-500">Cargando contactos...</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            {filtered.length === 0 && (
              <p className="rounded-xl bg-slate-50 p-6 text-lg text-slate-600">
                No hay contactos.{" "}
                <Link href="/admin/contactos/nuevo" className="font-semibold text-[#0096D6]">
                  Agregue uno nuevo
                </Link>{" "}
                o espere leads del formulario web.
              </p>
            )}
            {filtered.map((contact) => (
              <button
                key={contact.id}
                type="button"
                onClick={() => setSelected(contact)}
                className={cn(
                  "w-full rounded-xl border-2 p-4 text-left transition hover:shadow-md",
                  selected?.id === contact.id
                    ? "border-[#0096D6] bg-[#0096D6]/5"
                    : "border-slate-200 bg-white"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xl font-bold text-slate-900">
                      {[contact.nombre, contact.apellido].filter(Boolean).join(" ") || "Sin nombre"}
                    </p>
                    <p className="text-lg text-[#0096D6]">{contact.email}</p>
                    {contact.empresa && (
                      <p className="text-base text-slate-600">{contact.empresa}</p>
                    )}
                  </div>
                  <span className="shrink-0 rounded-lg bg-slate-100 px-3 py-1 text-sm font-semibold">
                    {FREQ_LABELS[contact.frecuencia]}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">
                  <span>📤 {contact.emailsEnviados} enviados</span>
                  <span>📥 {contact.emailsRecibidos} recibidos</span>
                  <span>🛒 {contact.vecesCompro} compras</span>
                </div>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border-2 border-slate-200 bg-white p-6">
            {selected ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-2xl font-bold text-slate-900">Detalle del contacto</h2>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/contactos/${selected.id}/editar`}
                      className="rounded-lg bg-[#0096D6] px-4 py-2 font-semibold text-white"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(selected.id)}
                      className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                <dl className="mt-6 space-y-4 text-lg">
                  <DetailRow label="Email" value={selected.email} />
                  <DetailRow
                    label="Nombre"
                    value={[selected.nombre, selected.apellido].filter(Boolean).join(" ") || "—"}
                  />
                  <DetailRow label="Empresa" value={selected.empresa ?? "—"} />
                  <DetailRow label="Ubicación" value={selected.lugar ?? "—"} />
                  <DetailRow label="Interés en producto" value={selected.interesProducto ?? "—"} />
                  <DetailRow label="Veces que compró" value={String(selected.vecesCompro)} />
                  <DetailRow label="Emails enviados" value={String(selected.emailsEnviados)} />
                  <DetailRow label="Emails recibidos" value={String(selected.emailsRecibidos)} />
                  <DetailRow label="Frecuencia" value={FREQ_LABELS[selected.frecuencia]} />
                  <DetailRow
                    label="Puntos de interés"
                    value={selected.puntosInteres.join(", ") || "—"}
                  />
                  <DetailRow label="Notas" value={selected.notas ?? "—"} />
                  <DetailRow
                    label="Creado"
                    value={new Date(selected.createdAt).toLocaleString("es-AR")}
                  />
                  <DetailRow
                    label="Última edición"
                    value={new Date(selected.updatedAt).toLocaleString("es-AR")}
                  />
                </dl>

                <EditHistoryPanel history={selected.editHistory} />
              </>
            ) : (
              <p className="text-xl text-slate-500">
                Seleccione un contacto de la lista para ver sus detalles
              </p>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-100 pb-3">
      <dt className="text-sm font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-slate-900">{value}</dd>
    </div>
  )
}

"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { EditHistoryPanel } from "@/components/admin/edit-history-panel"
import type { EmailRecord } from "@/lib/admin/types"
import { cn } from "@/lib/utils"

const STATUS_LABELS: Record<string, string> = {
  draft: "Borrador",
  scored: "Calificado",
  sent: "Enviado",
  failed: "Fallido",
}

export default function AdminEmailsHistorialPage() {
  const [emails, setEmails] = useState<EmailRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<EmailRecord | null>(null)
  const [filter, setFilter] = useState<string>("all")

  useEffect(() => {
    let cancelled = false
    fetch("/api/admin/emails")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setEmails(data.emails ?? [])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = emails.filter((e) => filter === "all" || e.status === filter)

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este registro de email?")) return
    await fetch(`/api/admin/emails/${id}`, { method: "DELETE" })
    setEmails((prev) => prev.filter((e) => e.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  return (
    <AdminShell
      title="Historial de Emails"
      subtitle="Consulte todos los emails redactados, calificados y enviados"
    >
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border-2 border-slate-300 px-4 py-3 text-lg"
        >
          <option value="all">Todos</option>
          <option value="draft">Borradores</option>
          <option value="scored">Calificados</option>
          <option value="sent">Enviados</option>
          <option value="failed">Fallidos</option>
        </select>
        <Link
          href="/admin/emails"
          className="rounded-xl bg-[#0096D6] px-6 py-3 text-lg font-bold text-white hover:bg-[#007bb5]"
        >
          + Redactar email
        </Link>
      </div>

      {loading ? (
        <p className="text-xl text-slate-500">Cargando historial...</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            {filtered.length === 0 && (
              <p className="rounded-xl bg-slate-50 p-6 text-lg text-slate-600">
                No hay emails en esta categoría.
              </p>
            )}
            {filtered.map((email) => (
              <button
                key={email.id}
                type="button"
                onClick={() => setSelected(email)}
                className={cn(
                  "w-full rounded-xl border-2 p-4 text-left transition hover:shadow-md",
                  selected?.id === email.id
                    ? "border-[#0096D6] bg-[#0096D6]/5"
                    : "border-slate-200 bg-white"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-lg font-bold text-slate-900">{email.asunto}</p>
                  <StatusBadge status={email.status} score={email.score} />
                </div>
                <p className="mt-1 text-base text-[#0096D6]">{email.destino}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {new Date(email.updatedAt).toLocaleString("es-AR")}
                </p>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border-2 border-slate-200 bg-white p-6">
            {selected ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="text-2xl font-bold text-slate-900">Detalle del email</h2>
                  <div className="flex flex-wrap gap-2">
                    {selected.status !== "sent" && (
                      <Link
                        href={`/admin/emails?borrador=${selected.id}`}
                        className="rounded-lg bg-[#0096D6] px-4 py-2 font-semibold text-white"
                      >
                        Continuar editando
                      </Link>
                    )}
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
                  <DetailRow label="Estado" value={STATUS_LABELS[selected.status] ?? selected.status} />
                  <DetailRow label="Destino" value={selected.destino} />
                  <DetailRow label="Asunto" value={selected.asunto} />
                  {selected.score !== undefined && (
                    <DetailRow label="Calificación" value={`${selected.score}%`} />
                  )}
                  {selected.scoreFeedback && (
                    <DetailRow label="Feedback IA" value={selected.scoreFeedback} />
                  )}
                  {selected.sentAt && (
                    <DetailRow
                      label="Enviado"
                      value={new Date(selected.sentAt).toLocaleString("es-AR")}
                    />
                  )}
                  <DetailRow
                    label="Creado"
                    value={new Date(selected.createdAt).toLocaleString("es-AR")}
                  />
                  <DetailRow
                    label="Última edición"
                    value={new Date(selected.updatedAt).toLocaleString("es-AR")}
                  />
                </dl>

                <div className="mt-6 rounded-xl bg-slate-50 p-4">
                  <p className="text-sm font-semibold uppercase text-slate-500">Mensaje</p>
                  <p className="mt-2 whitespace-pre-wrap text-base text-slate-800">
                    {selected.mensaje}
                  </p>
                </div>

                <EditHistoryPanel history={selected.editHistory} />
              </>
            ) : (
              <p className="text-xl text-slate-500">
                Seleccione un email del historial para ver sus detalles
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

function StatusBadge({ status, score }: { status: string; score?: number }) {
  const colors: Record<string, string> = {
    draft: "bg-slate-200 text-slate-700",
    scored: "bg-amber-100 text-amber-800",
    sent: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  }
  return (
    <span
      className={cn(
        "shrink-0 rounded-lg px-2 py-1 text-xs font-bold",
        colors[status] ?? colors.draft
      )}
    >
      {STATUS_LABELS[status] ?? status}
      {score !== undefined ? ` ${score}%` : ""}
    </span>
  )
}

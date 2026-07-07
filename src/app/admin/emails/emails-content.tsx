"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { AdminShell } from "@/components/admin/admin-shell"
import type { Contact, EmailRecord } from "@/lib/admin/types"
import { cn } from "@/lib/utils"

export default function AdminEmailsContent() {
  const searchParams = useSearchParams()
  const borradorId = searchParams.get("borrador")

  const [contacts, setContacts] = useState<Contact[]>([])
  const [threshold, setThreshold] = useState(70)
  const [selectedContactId, setSelectedContactId] = useState("")
  const [destino, setDestino] = useState("")
  const [asunto, setAsunto] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [currentEmailId, setCurrentEmailId] = useState<string | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [purpose, setPurpose] = useState("Seguimiento comercial para cotización")

  const hasContent = Boolean(selectedContactId && destino && asunto && mensaje)
  const meetsThreshold = score !== null && score >= threshold

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/contacts").then((r) => r.json()),
      fetch("/api/admin/emails").then((r) => r.json()),
    ]).then(([contactsData, emailsData]) => {
      setContacts(Array.isArray(contactsData) ? contactsData : [])
      setThreshold(emailsData.scoreThreshold ?? 70)

      if (borradorId) {
        const email = (emailsData.emails as EmailRecord[] | undefined)?.find(
          (e) => e.id === borradorId
        )
        if (email && email.status !== "sent") {
          setCurrentEmailId(email.id)
          setSelectedContactId(email.contactId)
          setDestino(email.destino)
          setAsunto(email.asunto)
          setMensaje(email.mensaje)
          setScore(email.score ?? null)
        }
      }
    })
  }, [borradorId])

  const syncEmail = async (): Promise<{ id: string; score: number | null }> => {
    const payload = { contactId: selectedContactId, destino, asunto, mensaje }
    const url = currentEmailId ? `/api/admin/emails/${currentEmailId}` : "/api/admin/emails"
    const method = currentEmailId ? "PUT" : "POST"
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = (await res.json()) as EmailRecord & { error?: string }
    if (!res.ok || data.error || !data.id) {
      throw new Error(data.error ?? "Error al guardar el borrador")
    }
    setCurrentEmailId(data.id)
    setScore(data.score ?? null)
    return { id: data.id, score: data.score ?? null }
  }

  const handleDraft = async () => {
    if (!selectedContactId) return alert("Seleccione un contacto")
    setLoading("draft")
    try {
      const res = await fetch("/api/admin/emails/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactId: selectedContactId,
          purpose,
          emailId: currentEmailId ?? undefined,
          destino: destino || undefined,
        }),
      })
      const data = (await res.json()) as {
        asunto?: string
        mensaje?: string
        destino?: string
        emailId?: string
        score?: number
        canSend?: boolean
        error?: string
      }
      if (!res.ok || data.error) return alert(data.error ?? "Error al generar borrador")

      setAsunto(data.asunto ?? "")
      setMensaje(data.mensaje ?? "")
      if (data.destino) setDestino(data.destino)
      if (data.emailId) setCurrentEmailId(data.emailId)
      setScore(data.score ?? null)

      if (data.canSend === false) {
        alert(
          `Borrador generado (calidad ${data.score ?? "—"}%). Podés enviarlo igual; el umbral recomendado es ${threshold}%.`
        )
      }
    } catch {
      alert("Error al generar borrador")
    } finally {
      setLoading(null)
    }
  }

  const handleSave = async () => {
    if (!hasContent) return alert("Complete todos los campos")
    setLoading("save")
    try {
      await syncEmail()
      alert("Email guardado")
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al guardar")
    } finally {
      setLoading(null)
    }
  }

  const handleSend = async () => {
    if (!hasContent) return alert("Complete todos los campos")

    setLoading("send")
    try {
      const { id, score: latestScore } = await syncEmail()

      const needsConfirm =
        latestScore !== null && latestScore < threshold
          ? confirm(
              `Calidad del borrador: ${latestScore}% (recomendado ≥ ${threshold}%).\n\n¿Enviar igual?`
            )
          : confirm("¿Enviar este email al contacto?")

      if (!needsConfirm) {
        setLoading(null)
        return
      }

      const res = await fetch("/api/admin/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailId: id,
          force: latestScore !== null && latestScore < threshold,
        }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok || data.error) return alert(data.error ?? "Error al enviar")
      alert("¡Email enviado correctamente!")
      resetForm()
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al enviar")
    } finally {
      setLoading(null)
    }
  }

  const resetForm = () => {
    setSelectedContactId("")
    setDestino("")
    setAsunto("")
    setMensaje("")
    setCurrentEmailId(null)
    setScore(null)
  }

  const fieldClass =
    "w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-lg focus:border-[#0096D6] focus:outline-none"

  return (
    <AdminShell
      title="Emails Comerciales"
      subtitle="Redacte con IA y envíe emails optimizados para ventas"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-lg text-slate-600">
          La IA evalúa cada borrador automáticamente. Umbral recomendado:{" "}
          <strong className="text-[#0096D6]">{threshold}%</strong>
        </p>
        <div className="flex gap-3">
          <Link
            href="/admin/emails/historial"
            className="rounded-xl border-2 border-slate-300 px-5 py-2 text-lg font-semibold text-slate-700 hover:border-[#0096D6]"
          >
            Ver historial →
          </Link>
          {currentEmailId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border-2 border-slate-300 px-5 py-2 text-lg font-semibold"
            >
              Nuevo email
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-bold text-slate-900">Redactar email</h2>

          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="mb-1 block text-lg font-semibold">Contacto destino</span>
              <select
                value={selectedContactId}
                onChange={(e) => {
                  const id = e.target.value
                  setSelectedContactId(id)
                  const contact = contacts.find((c) => c.id === id)
                  if (contact) setDestino(contact.email)
                }}
                className={fieldClass}
              >
                <option value="">— Seleccionar contacto —</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {[c.nombre, c.apellido].filter(Boolean).join(" ")} — {c.email}
                    {c.empresa ? ` (${c.empresa})` : ""}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-lg font-semibold">Propósito del email</span>
              <input
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className={fieldClass}
              />
            </label>

            <button
              type="button"
              onClick={handleDraft}
              disabled={loading === "draft" || !selectedContactId}
              className="w-full rounded-xl bg-violet-600 py-3 text-lg font-bold text-white hover:bg-violet-700 disabled:opacity-50"
            >
              {loading === "draft" ? "Generando y evaluando con IA..." : "✨ Redactar con Gemini"}
            </button>

            <label className="block">
              <span className="mb-1 block text-lg font-semibold">Destino (email)</span>
              <input
                type="email"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-lg font-semibold">Asunto</span>
              <input
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                className={fieldClass}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-lg font-semibold">Mensaje</span>
              <textarea
                rows={10}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                className={fieldClass}
              />
            </label>
          </div>

          {score !== null && (
            <p
              className={cn(
                "mt-4 rounded-xl px-4 py-3 text-lg font-semibold",
                meetsThreshold
                  ? "bg-green-50 text-green-800"
                  : "bg-amber-50 text-amber-900"
              )}
            >
              {meetsThreshold
                ? `✓ Borrador evaluado (${score}%) — listo para enviar`
                : `Borrador evaluado (${score}%). Umbral recomendado: ${threshold}%. Podés enviar igual.`}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={!!loading || !hasContent}
              className="rounded-xl bg-slate-700 px-6 py-3 text-lg font-bold text-white hover:bg-slate-600 disabled:opacity-50"
            >
              {loading === "save" ? "Guardando..." : "Guardar borrador"}
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={!!loading || !hasContent}
              className="rounded-xl bg-[#0096D6] px-6 py-3 text-lg font-bold text-white hover:bg-[#007bb5] disabled:opacity-50"
            >
              {loading === "send" ? "Enviando..." : "📤 Enviar email"}
            </button>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}

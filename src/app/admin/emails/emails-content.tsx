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
  const [scoreFeedback, setScoreFeedback] = useState("")
  const [scoreDetails, setScoreDetails] = useState<EmailRecord["scoreDetails"]>()
  const [loading, setLoading] = useState<string | null>(null)
  const [purpose, setPurpose] = useState("Seguimiento comercial para cotización")

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
          setScoreFeedback(email.scoreFeedback ?? "")
          setScoreDetails(email.scoreDetails)
        }
      }
    })
  }, [borradorId])

  const handleDraft = async () => {
    if (!selectedContactId) return alert("Seleccione un contacto")
    setLoading("draft")
    try {
      const res = await fetch("/api/admin/emails/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId: selectedContactId, purpose }),
      })
      const data = (await res.json()) as { asunto?: string; mensaje?: string; error?: string }
      if (data.error) return alert(data.error)
      setAsunto(data.asunto ?? "")
      setMensaje(data.mensaje ?? "")
      setScore(null)
      setScoreFeedback("")
    } catch {
      alert("Error al generar borrador")
    } finally {
      setLoading(null)
    }
  }

  const handleSave = async () => {
    if (!selectedContactId || !destino || !asunto || !mensaje) {
      return alert("Complete todos los campos")
    }
    setLoading("save")
    try {
      const url = currentEmailId ? `/api/admin/emails/${currentEmailId}` : "/api/admin/emails"
      const method = currentEmailId ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId: selectedContactId, destino, asunto, mensaje }),
      })
      const data = (await res.json()) as EmailRecord & { error?: string }
      if (data.error) return alert(data.error)
      setCurrentEmailId(data.id)
      setScore(data.score ?? null)
      alert("Email guardado")
    } catch {
      alert("Error al guardar")
    } finally {
      setLoading(null)
    }
  }

  const handleScore = async () => {
    if (!selectedContactId || !destino || !asunto || !mensaje) {
      return alert("Complete todos los campos antes de calificar")
    }

    setLoading("score")
    try {
      let emailId = currentEmailId
      if (!emailId) {
        emailId = await handleSaveInternal()
        setCurrentEmailId(emailId)
      }

      const res = await fetch("/api/admin/emails/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailId, asunto, mensaje, contactId: selectedContactId }),
      })
      const data = (await res.json()) as {
        score: number
        feedback: string
        details: EmailRecord["scoreDetails"]
        error?: string
      }
      if (data.error) return alert(data.error)
      setScore(data.score)
      setScoreFeedback(data.feedback)
      setScoreDetails(data.details)
    } catch {
      alert("Error al calificar")
    } finally {
      setLoading(null)
    }
  }

  const handleSaveInternal = async (): Promise<string> => {
    const res = await fetch(
      currentEmailId ? `/api/admin/emails/${currentEmailId}` : "/api/admin/emails",
      {
        method: currentEmailId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId: selectedContactId, destino, asunto, mensaje }),
      }
    )
    const data = (await res.json()) as EmailRecord & { error?: string }
    if (data.error || !data.id) throw new Error(data.error ?? "Error al guardar")
    return data.id
  }

  const handleSend = async () => {
    if (!currentEmailId) return alert("Guarde el email primero")
    if (score === null || score < threshold) {
      return alert(`El email necesita calificación ≥ ${threshold}. Califique primero.`)
    }
    if (!confirm("¿Enviar este email al contacto?")) return

    setLoading("send")
    try {
      const res = await fetch("/api/admin/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailId: currentEmailId }),
      })
      const data = (await res.json()) as { error?: string }
      if (data.error) return alert(data.error)
      alert("¡Email enviado correctamente!")
      resetForm()
    } catch {
      alert("Error al enviar")
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
    setScoreFeedback("")
    setScoreDetails(undefined)
  }

  const fieldClass =
    "w-full rounded-xl border-2 border-slate-300 px-4 py-3 text-lg focus:border-[#0096D6] focus:outline-none"

  return (
    <AdminShell
      title="Emails Comerciales"
      subtitle="Redacte con IA, califique y envíe emails optimizados para ventas"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-lg text-slate-600">
          Umbral mínimo para enviar: <strong className="text-[#0096D6]">{threshold}%</strong>
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
              {loading === "draft" ? "Generando con IA..." : "✨ Redactar con Gemini"}
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

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={!!loading}
              className="rounded-xl bg-slate-700 px-6 py-3 text-lg font-bold text-white hover:bg-slate-600 disabled:opacity-50"
            >
              {loading === "save" ? "Guardando..." : "Guardar borrador"}
            </button>
            <button
              type="button"
              onClick={handleScore}
              disabled={!!loading || !asunto || !mensaje}
              className="rounded-xl bg-amber-500 px-6 py-3 text-lg font-bold text-white hover:bg-amber-600 disabled:opacity-50"
            >
              {loading === "score" ? "Calificando..." : "📊 Calificar email"}
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={!!loading || score === null || score < threshold || !currentEmailId}
              className="rounded-xl bg-[#0096D6] px-6 py-3 text-lg font-bold text-white hover:bg-[#007bb5] disabled:opacity-50"
            >
              {loading === "send" ? "Enviando..." : "📤 Enviar email"}
            </button>
          </div>
        </div>

        {score !== null && (
          <ScorePanel
            score={score}
            threshold={threshold}
            feedback={scoreFeedback}
            details={scoreDetails}
          />
        )}
      </div>
    </AdminShell>
  )
}

function ScorePanel({
  score,
  threshold,
  feedback,
  details,
}: {
  score: number
  threshold: number
  feedback: string
  details?: EmailRecord["scoreDetails"]
}) {
  const passed = score >= threshold
  return (
    <div
      className={cn(
        "rounded-2xl border-2 p-6",
        passed ? "border-green-300 bg-green-50" : "border-amber-300 bg-amber-50"
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-900">Calificación del email</h3>
        <div className="text-center">
          <p className={cn("text-5xl font-black", passed ? "text-green-600" : "text-amber-600")}>
            {score}%
          </p>
          <p className="text-sm font-semibold">
            {passed ? "✓ Listo para enviar" : `Necesita ≥ ${threshold}%`}
          </p>
        </div>
      </div>

      <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-200">
        <div
          className={cn("h-full transition-all", passed ? "bg-green-500" : "bg-amber-500")}
          style={{ width: `${score}%` }}
        />
      </div>

      {feedback && <p className="mt-4 text-lg text-slate-700">{feedback}</p>}

      {details && (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {Object.entries(details).map(([key, val]) => (
            <div key={key} className="rounded-lg bg-white/80 p-3">
              <p className="text-sm capitalize text-slate-500">{key.replace(/([A-Z])/g, " $1")}</p>
              <p className="text-xl font-bold text-slate-900">{val}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

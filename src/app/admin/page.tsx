"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"

type DashboardStats = {
  contacts: number
  emails: number
  emailsSent: number
  visitsToday: number
  geminiConfigured: boolean
  gmailConfigured: boolean
  scoreThreshold: number
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/contacts").then((r) => r.json()),
      fetch("/api/admin/emails").then((r) => r.json()),
      fetch("/api/admin/metrics").then((r) => r.json()),
      fetch("/api/admin/auth/me").then((r) => r.json()),
    ]).then(([contacts, emailsData, metrics, config]) => {
      const emails = emailsData.emails ?? []
      setStats({
        contacts: Array.isArray(contacts) ? contacts.length : 0,
        emails: emails.length,
        emailsSent: emails.filter((e: { status: string }) => e.status === "sent").length,
        visitsToday: metrics.summary?.visitsToday ?? 0,
        geminiConfigured: config.geminiConfigured ?? false,
        gmailConfigured: config.gmailConfigured ?? config.smtpConfigured ?? false,
        scoreThreshold: config.scoreThreshold ?? 70,
      })
    })
  }, [])

  const cards = [
    {
      href: "/admin/contactos",
      label: "Contactos",
      value: stats?.contacts ?? "—",
      desc: "Clientes y leads registrados",
      icon: "👥",
      color: "bg-blue-50 border-blue-200",
    },
    {
      href: "/admin/emails",
      label: "Emails",
      value: stats?.emails ?? "—",
      desc: `${stats?.emailsSent ?? 0} enviados`,
      icon: "✉️",
      color: "bg-emerald-50 border-emerald-200",
    },
    {
      href: "/admin/emails/historial",
      label: "Historial",
      value: stats?.emails ?? "—",
      desc: "Emails redactados y enviados",
      icon: "📋",
      color: "bg-violet-50 border-violet-200",
    },
    {
      href: "/admin/metricas",
      label: "Visitas hoy",
      value: stats?.visitsToday ?? "—",
      desc: "Tráfico del sitio web",
      icon: "📊",
      color: "bg-amber-50 border-amber-200",
    },
  ]

  return (
    <AdminShell
      title="Panel de Control"
      subtitle="Bienvenido al sistema de gestión comercial de Air Products"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`rounded-2xl border-2 p-6 transition hover:shadow-lg ${card.color}`}
          >
            <div className="flex items-start justify-between">
              <span className="text-4xl" aria-hidden="true">
                {card.icon}
              </span>
              <span className="text-4xl font-bold text-slate-900">{card.value}</span>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">{card.label}</h2>
            <p className="mt-1 text-lg text-slate-600">{card.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border-2 border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-bold text-slate-900">Estado del sistema</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <StatusItem
            label="Inteligencia Artificial (Gemini)"
            ok={stats?.geminiConfigured ?? false}
          />
          <StatusItem label="Envío de emails (Gmail API)" ok={stats?.gmailConfigured ?? false} />
          {stats && !stats.gmailConfigured && (
            <div className="sm:col-span-3 rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
              <p className="text-lg font-semibold text-slate-800">Conectar Gmail</p>
              <p className="mt-1 text-slate-600">
                Autorizá con la misma cuenta configurada en <code>GMAIL_SENDER</code>.
              </p>
              <a
                href="/api/admin/gmail/oauth/start"
                className="mt-3 inline-block rounded-lg bg-[#0096D6] px-4 py-2 text-lg font-semibold text-white hover:bg-[#007ab8]"
              >
                Autorizar Gmail
              </a>
            </div>
          )}
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-lg font-semibold text-slate-700">Umbral de calidad</p>
            <p className="text-3xl font-bold text-[#0096D6]">{stats?.scoreThreshold ?? 70}%</p>
            <p className="text-sm text-slate-500">Mínimo para enviar emails</p>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border-2 border-[#0096D6]/30 bg-[#0096D6]/5 p-6">
        <h2 className="text-2xl font-bold text-slate-900">Guía rápida</h2>
        <ul className="mt-4 space-y-3 text-lg text-slate-700">
          <li>
            <strong>1. Contactos:</strong> Registre clientes y leads. Use &quot;Nuevo contacto&quot; para
            agregar uno.
          </li>
          <li>
            <strong>2. Emails:</strong> Redacte, califique y envíe. El historial está en su propia sección.
          </li>
          <li>
            <strong>3. Métricas:</strong> Vea quién visita el sitio y dónde hacen clic.
          </li>
          <li>
            <strong>4. Asistente:</strong> Consulte dudas sobre el panel en la sección Asistente.
          </li>
        </ul>
      </div>
    </AdminShell>
  )
}

function StatusItem({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div
      className={`rounded-xl p-4 ${ok ? "bg-green-50 border-2 border-green-200" : "bg-red-50 border-2 border-red-200"}`}
    >
      <p className="text-lg font-semibold text-slate-700">{label}</p>
      <p className={`mt-1 text-xl font-bold ${ok ? "text-green-700" : "text-red-700"}`}>
        {ok ? "✓ Configurado" : "✗ Falta configurar"}
      </p>
    </div>
  )
}

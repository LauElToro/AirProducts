"use client"

import { useEffect, useState } from "react"
import { AdminShell } from "@/components/admin/admin-shell"

type MetricsData = {
  summary: {
    totalVisits: number
    visitsToday: number
    visitsWeek: number
    visitsMonth: number
    uniqueSessions: number
    uniqueSessionsWeek: number
    totalHeatmapEvents: number
  }
  topPages: { path: string; count: number }[]
  topReferrers: { referrer: string; count: number }[]
  devices: Record<string, number>
  languages: Record<string, number>
  hourlyTraffic: { hour: number; count: number }[]
  heatmap: Record<string, { x: number; y: number; count: number }[]>
  scrollDepth: { path: string; avgScroll: number }[]
  recentVisits: {
    path: string
    referrer: string
    timestamp: string
    language: string
  }[]
}

export default function AdminMetricasPage() {
  const [data, setData] = useState<MetricsData | null>(null)
  const [selectedPath, setSelectedPath] = useState<string>("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/metrics")
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        const paths = Object.keys(d.heatmap ?? {})
        if (paths.length > 0) setSelectedPath(paths[0])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <AdminShell title="Métricas" subtitle="Cargando datos...">
        <p className="text-2xl text-slate-500">Cargando métricas...</p>
      </AdminShell>
    )
  }

  if (!data) {
    return (
      <AdminShell title="Métricas" subtitle="Error al cargar">
        <p className="text-2xl text-red-600">No se pudieron cargar las métricas</p>
      </AdminShell>
    )
  }

  const maxHourly = Math.max(...data.hourlyTraffic.map((h) => h.count), 1)
  const heatmapPoints = data.heatmap[selectedPath] ?? []
  const maxHeat = Math.max(...heatmapPoints.map((p) => p.count), 1)

  return (
    <AdminShell
      title="Métricas del Sitio Web"
      subtitle="Visitas, origen del tráfico y mapa de calor de interacciones"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Visitas totales" value={data.summary.totalVisits} icon="🌐" />
        <KpiCard label="Visitas hoy" value={data.summary.visitsToday} icon="📅" />
        <KpiCard label="Esta semana" value={data.summary.visitsWeek} icon="📈" />
        <KpiCard label="Sesiones únicas" value={data.summary.uniqueSessions} icon="👤" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Section title="Páginas más visitadas" icon="📄">
          <BarList
            items={data.topPages.map((p) => ({
              label: p.path,
              value: p.count,
            }))}
          />
        </Section>

        <Section title="De dónde nos visitan" icon="🔗">
          <BarList
            items={data.topReferrers.map((r) => ({
              label: truncateUrl(r.referrer),
              value: r.count,
            }))}
          />
        </Section>

        <Section title="Dispositivos" icon="📱">
          <BarList
            items={Object.entries(data.devices).map(([label, value]) => ({ label, value }))}
          />
        </Section>

        <Section title="Idiomas" icon="🌍">
          <BarList
            items={Object.entries(data.languages).map(([label, value]) => ({ label, value }))}
          />
        </Section>
      </div>

      <div className="mt-8 rounded-2xl border-2 border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-bold text-slate-900">Tráfico por hora del día</h2>
        <div className="mt-6 flex items-end gap-1 h-48">
          {data.hourlyTraffic.map((h) => (
            <div key={h.hour} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-[#0096D6] transition-all"
                style={{ height: `${(h.count / maxHourly) * 100}%`, minHeight: h.count > 0 ? 4 : 0 }}
                title={`${h.count} visitas`}
              />
              <span className="text-xs text-slate-500">{h.hour}h</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border-2 border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-900">Mapa de calor (clics)</h2>
          <select
            value={selectedPath}
            onChange={(e) => setSelectedPath(e.target.value)}
            className="rounded-xl border-2 border-slate-300 px-4 py-2 text-lg"
          >
            {Object.keys(data.heatmap).length === 0 && <option value="">Sin datos aún</option>}
            {Object.keys(data.heatmap).map((path) => (
              <option key={path} value={path}>
                {path}
              </option>
            ))}
          </select>
        </div>

        {heatmapPoints.length > 0 ? (
          <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-xl border-2 border-slate-200 bg-slate-50">
            {heatmapPoints.map((point, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${Math.min(95, (point.x / 1200) * 100)}%`,
                  top: `${Math.min(95, (point.y / 800) * 100)}%`,
                  width: 16 + (point.count / maxHeat) * 32,
                  height: 16 + (point.count / maxHeat) * 32,
                  backgroundColor: `rgba(0, 150, 214, ${0.2 + (point.count / maxHeat) * 0.7})`,
                  transform: "translate(-50%, -50%)",
                }}
                title={`${point.count} clics`}
              />
            ))}
            <p className="absolute bottom-2 left-2 rounded bg-white/90 px-2 py-1 text-sm text-slate-600">
              {selectedPath} — {heatmapPoints.length} zonas activas
            </p>
          </div>
        ) : (
          <p className="mt-4 text-lg text-slate-500">
            Aún no hay datos de clics. Las visitas al sitio web generarán el mapa de calor
            automáticamente.
          </p>
        )}
      </div>

      {data.scrollDepth.length > 0 && (
        <div className="mt-8 rounded-2xl border-2 border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-bold text-slate-900">Profundidad de scroll promedio</h2>
          <div className="mt-4 space-y-3">
            {data.scrollDepth.map((s) => (
              <div key={s.path}>
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">{s.path}</span>
                  <span className="text-[#0096D6]">{s.avgScroll}%</span>
                </div>
                <div className="mt-1 h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full bg-[#0096D6]"
                    style={{ width: `${s.avgScroll}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 rounded-2xl border-2 border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-bold text-slate-900">Visitas recientes</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-lg">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-600">
                <th className="pb-3 pr-4">Fecha</th>
                <th className="pb-3 pr-4">Página</th>
                <th className="pb-3 pr-4">Origen</th>
                <th className="pb-3">Idioma</th>
              </tr>
            </thead>
            <tbody>
              {data.recentVisits.map((v, i) => (
                <tr key={i} className="border-b border-slate-100">
                  <td className="py-3 pr-4 text-sm">
                    {new Date(v.timestamp).toLocaleString("es-AR")}
                  </td>
                  <td className="py-3 pr-4 font-medium">{v.path}</td>
                  <td className="py-3 pr-4 text-sm">{truncateUrl(v.referrer) || "Directo"}</td>
                  <td className="py-3">{v.language}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  )
}

function KpiCard({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: string
}) {
  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-6">
      <span className="text-3xl" aria-hidden="true">
        {icon}
      </span>
      <p className="mt-2 text-4xl font-black text-slate-900">{value.toLocaleString("es-AR")}</p>
      <p className="mt-1 text-lg font-semibold text-slate-600">{label}</p>
    </div>
  )
}

function Section({
  title,
  icon,
  children,
}: {
  title: string
  icon: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-6">
      <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
        <span aria-hidden="true">{icon}</span> {title}
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function BarList({ items }: { items: { label: string; value: number }[] }) {
  const max = Math.max(...items.map((i) => i.value), 1)
  if (items.length === 0) return <p className="text-lg text-slate-500">Sin datos</p>

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex justify-between text-base">
            <span className="truncate font-medium text-slate-800">{item.label}</span>
            <span className="ml-2 shrink-0 font-bold text-[#0096D6]">{item.value}</span>
          </div>
          <div className="mt-1 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#0096D6]"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function truncateUrl(url: string, max = 40): string {
  if (!url || url === "(directo)") return "Directo"
  return url.length > max ? url.slice(0, max) + "…" : url
}

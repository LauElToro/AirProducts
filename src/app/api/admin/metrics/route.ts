import { requireAuth, jsonOk } from "@/lib/admin/api-helpers"
import { getAnalytics } from "@/lib/admin/storage"

export async function GET() {
  const authError = await requireAuth()
  if (authError) return authError

  const data = await getAnalytics()
  const now = Date.now()
  const day = 86400000
  const week = day * 7
  const month = day * 30

  const pageViews = data.pageViews
  const heatmapEvents = data.heatmapEvents

  const visitsToday = pageViews.filter(
    (v) => now - new Date(v.timestamp).getTime() < day
  ).length
  const visitsWeek = pageViews.filter(
    (v) => now - new Date(v.timestamp).getTime() < week
  ).length
  const visitsMonth = pageViews.filter(
    (v) => now - new Date(v.timestamp).getTime() < month
  ).length

  const uniqueSessions = new Set(pageViews.map((v) => v.sessionId)).size
  const uniqueSessionsWeek = new Set(
    pageViews
      .filter((v) => now - new Date(v.timestamp).getTime() < week)
      .map((v) => v.sessionId)
  ).size

  const pageCounts: Record<string, number> = {}
  pageViews.forEach((v) => {
    pageCounts[v.path] = (pageCounts[v.path] ?? 0) + 1
  })
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }))

  const referrerCounts: Record<string, number> = {}
  pageViews.forEach((v) => {
    const ref = v.referrer || "(directo)"
    referrerCounts[ref] = (referrerCounts[ref] ?? 0) + 1
  })
  const topReferrers = Object.entries(referrerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([referrer, count]) => ({ referrer, count }))

  const deviceCounts: Record<string, number> = {}
  pageViews.forEach((v) => {
    const ua = v.userAgent.toLowerCase()
    const device = ua.includes("mobile")
      ? "Móvil"
      : ua.includes("tablet")
        ? "Tablet"
        : "Escritorio"
    deviceCounts[device] = (deviceCounts[device] ?? 0) + 1
  })

  const hourlyCounts = Array.from({ length: 24 }, (_, h) => ({ hour: h, count: 0 }))
  pageViews.forEach((v) => {
    const h = new Date(v.timestamp).getHours()
    hourlyCounts[h].count++
  })

  const clicksByPage: Record<string, { x: number; y: number; count: number }[]> = {}
  heatmapEvents
    .filter((e) => e.type === "click")
    .forEach((e) => {
      if (!clicksByPage[e.path]) clicksByPage[e.path] = []
      const bucketX = Math.round(e.x / 20) * 20
      const bucketY = Math.round(e.y / 20) * 20
      const existing = clicksByPage[e.path].find(
        (p) => p.x === bucketX && p.y === bucketY
      )
      if (existing) existing.count++
      else clicksByPage[e.path].push({ x: bucketX, y: bucketY, count: 1 })
    })

  const scrollByPage: Record<string, number[]> = {}
  heatmapEvents
    .filter((e) => e.type === "scroll" && e.scrollDepth !== undefined)
    .forEach((e) => {
      if (!scrollByPage[e.path]) scrollByPage[e.path] = []
      scrollByPage[e.path].push(e.scrollDepth!)
    })

  const avgScrollByPage = Object.entries(scrollByPage).map(([path, depths]) => ({
    path,
    avgScroll: Math.round(depths.reduce((a, b) => a + b, 0) / depths.length),
  }))

  const languageCounts: Record<string, number> = {}
  pageViews.forEach((v) => {
    const lang = v.language?.split("-")[0] ?? "unknown"
    languageCounts[lang] = (languageCounts[lang] ?? 0) + 1
  })

  return jsonOk({
    summary: {
      totalVisits: pageViews.length,
      visitsToday,
      visitsWeek,
      visitsMonth,
      uniqueSessions,
      uniqueSessionsWeek,
      totalHeatmapEvents: heatmapEvents.length,
    },
    topPages,
    topReferrers,
    devices: deviceCounts,
    languages: languageCounts,
    hourlyTraffic: hourlyCounts,
    heatmap: clicksByPage,
    scrollDepth: avgScrollByPage,
    recentVisits: pageViews.slice(-20).reverse(),
  })
}

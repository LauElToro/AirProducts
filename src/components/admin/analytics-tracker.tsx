"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

const SESSION_KEY = "ap_analytics_session"

function getSessionId(): string {
  if (typeof window === "undefined") return ""
  let id = sessionStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(SESSION_KEY, id)
  }
  return id
}

export const AnalyticsTracker = () => {
  const pathname = usePathname()
  const heatmapBuffer = useRef<
    { path: string; type: string; x: number; y: number; scrollDepth?: number; viewportWidth: number; viewportHeight: number; sessionId: string }[]
  >([])
  const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (pathname.startsWith("/admin")) return

    const sessionId = getSessionId()

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "pageview",
        data: {
          path: pathname,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
          language: navigator.language,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          sessionId,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      }),
    }).catch(() => {})
  }, [pathname])

  useEffect(() => {
    if (pathname.startsWith("/admin")) return

    const sessionId = getSessionId()

    const flushHeatmap = () => {
      if (heatmapBuffer.current.length === 0) return
      const batch = heatmapBuffer.current.splice(0, 50)
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "heatmap", data: batch }),
      }).catch(() => {})
    }

    const scheduleFlush = () => {
      if (flushTimer.current) clearTimeout(flushTimer.current)
      flushTimer.current = setTimeout(flushHeatmap, 3000)
    }

    const handleClick = (e: MouseEvent) => {
      heatmapBuffer.current.push({
        path: pathname,
        type: "click",
        x: e.clientX + window.scrollX,
        y: e.clientY + window.scrollY,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        sessionId,
      })
      if (heatmapBuffer.current.length >= 20) flushHeatmap()
      else scheduleFlush()
    }

    let maxScroll = 0
    const handleScroll = () => {
      const scrollDepth = Math.round(
        ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
      )
      if (scrollDepth > maxScroll + 10) {
        maxScroll = scrollDepth
        heatmapBuffer.current.push({
          path: pathname,
          type: "scroll",
          x: 0,
          y: 0,
          scrollDepth,
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          sessionId,
        })
        scheduleFlush()
      }
    }

    document.addEventListener("click", handleClick, { passive: true })
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      document.removeEventListener("click", handleClick)
      window.removeEventListener("scroll", handleScroll)
      flushHeatmap()
      if (flushTimer.current) clearTimeout(flushTimer.current)
    }
  }, [pathname])

  return null
}

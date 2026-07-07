import { NextRequest } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { jsonOk } from "@/lib/admin/api-helpers"
import { appendHeatmapEvents, appendPageView } from "@/lib/admin/storage"
import type { HeatmapEvent, PageView } from "@/lib/admin/types"

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      type: "pageview" | "heatmap"
      data: Partial<PageView> | HeatmapEvent[]
    }

    if (body.type === "pageview") {
      const d = body.data as Partial<PageView>
      const view: PageView = {
        id: uuidv4(),
        path: d.path ?? "/",
        referrer: d.referrer ?? "",
        userAgent: d.userAgent ?? request.headers.get("user-agent") ?? "",
        language: d.language ?? request.headers.get("accept-language")?.split(",")[0] ?? "",
        screenWidth: d.screenWidth ?? 0,
        screenHeight: d.screenHeight ?? 0,
        timestamp: new Date().toISOString(),
        sessionId: d.sessionId ?? uuidv4(),
        timezone: d.timezone,
      }
      await appendPageView(view)
      return jsonOk({ tracked: true })
    }

    if (body.type === "heatmap") {
      const events = (body.data as HeatmapEvent[]).map((e) => ({
        ...e,
        id: e.id ?? uuidv4(),
        timestamp: e.timestamp ?? new Date().toISOString(),
      }))
      await appendHeatmapEvents(events)
      return jsonOk({ tracked: events.length })
    }

    return jsonOk({ tracked: false })
  } catch {
    return jsonOk({ tracked: false })
  }
}

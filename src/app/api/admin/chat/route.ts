import { NextRequest } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { requireAuth, jsonError, jsonOk, geminiRouteError } from "@/lib/admin/api-helpers"
import { chatWithAssistant } from "@/lib/admin/gemini"
import { getChatSessions, saveChatSessions } from "@/lib/admin/storage"
import type { ChatMessage } from "@/lib/admin/types"

export async function GET() {
  const authError = await requireAuth()
  if (authError) return authError

  const sessions = await getChatSessions()
  const mainSession = sessions.find((s) => s.id === "main") ?? {
    id: "main",
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return jsonOk(mainSession)
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = (await request.json()) as {
      message?: string
      section?: string
    }

    if (!body.message?.trim()) return jsonError("Mensaje requerido")

    const sessions = await getChatSessions()
    let session = sessions.find((s) => s.id === "main")

    if (!session) {
      session = {
        id: "main",
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      sessions.push(session)
    }

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: "user",
      content: body.message.trim(),
      section: body.section,
      timestamp: new Date().toISOString(),
    }

    session.messages.push(userMessage)

    const reply = await chatWithAssistant(
      session.messages.map((m) => ({ role: m.role, content: m.content })),
      body.section
    )

    const assistantMessage: ChatMessage = {
      id: uuidv4(),
      role: "assistant",
      content: reply,
      section: body.section,
      timestamp: new Date().toISOString(),
    }

    session.messages.push(assistantMessage)
    session.updatedAt = new Date().toISOString()

    if (session.messages.length > 200) {
      session.messages = session.messages.slice(-200)
    }

    const index = sessions.findIndex((s) => s.id === "main")
    if (index === -1) sessions.push(session)
    else sessions[index] = session

    await saveChatSessions(sessions)

    return jsonOk({
      message: assistantMessage,
      session,
    })
  } catch (error) {
    return geminiRouteError(error)
  }
}

export async function DELETE() {
  const authError = await requireAuth()
  if (authError) return authError

  const sessions = await getChatSessions()
  const filtered = sessions.filter((s) => s.id !== "main")
  await saveChatSessions(filtered)
  return jsonOk({ cleared: true })
}

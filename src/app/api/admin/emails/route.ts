import { NextRequest } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { requireAuth, jsonError, jsonOk } from "@/lib/admin/api-helpers"
import { getScoreThreshold } from "@/lib/admin/gemini"
import {
  createEditRecord,
  getContactById,
  getEmails,
  saveEmails,
} from "@/lib/admin/storage"
import type { EmailRecord } from "@/lib/admin/types"

export async function GET() {
  const authError = await requireAuth()
  if (authError) return authError

  const emails = await getEmails()
  return jsonOk({
    emails: emails.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    scoreThreshold: getScoreThreshold(),
  })
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = (await request.json()) as {
      contactId?: string
      destino?: string
      asunto?: string
      mensaje?: string
    }

    if (!body.contactId || !body.destino || !body.asunto || !body.mensaje) {
      return jsonError("contactId, destino, asunto y mensaje son obligatorios")
    }

    const contact = await getContactById(body.contactId)
    if (!contact) return jsonError("Contacto no encontrado", 404)

    const now = new Date().toISOString()
    const email: EmailRecord = {
      id: uuidv4(),
      contactId: body.contactId,
      destino: body.destino.trim(),
      asunto: body.asunto.trim(),
      mensaje: body.mensaje.trim(),
      status: "draft",
      createdAt: now,
      updatedAt: now,
      editHistory: [
        createEditRecord("create", { asunto: { to: body.asunto } }, "Email creado"),
      ],
    }

    const emails = await getEmails()
    emails.push(email)
    await saveEmails(emails)
    return jsonOk(email, 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al crear email"
    return jsonError(message, 500)
  }
}

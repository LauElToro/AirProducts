import { NextRequest } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { requireAuth, jsonError, jsonOk, geminiRouteError } from "@/lib/admin/api-helpers"
import { scoreEmail, getScoreThreshold } from "@/lib/admin/gemini"
import {
  createEditRecord,
  getContactById,
  getEmails,
  saveEmails,
  upsertEmailTrainingExample,
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

    const scoring = await scoreEmail(
      body.asunto.trim(),
      body.mensaje.trim(),
      contact
    )

    const now = new Date().toISOString()
    const email: EmailRecord = {
      id: uuidv4(),
      contactId: body.contactId,
      destino: body.destino.trim(),
      asunto: body.asunto.trim(),
      mensaje: body.mensaje.trim(),
      score: scoring.score,
      scoreFeedback: scoring.feedback,
      scoreDetails: scoring.details,
      status: "scored",
      createdAt: now,
      updatedAt: now,
      editHistory: [
        createEditRecord(
          "create",
          { score: { to: scoring.score } },
          `Email creado y calificado: ${scoring.score}/100`
        ),
      ],
    }

    const emails = await getEmails()
    emails.push(email)
    await saveEmails(emails)

    await upsertEmailTrainingExample({
      emailId: email.id,
      asunto: email.asunto,
      mensaje: email.mensaje,
      score: scoring.score,
      feedback: scoring.feedback,
    })

    const threshold = getScoreThreshold()
    return jsonOk({ ...email, threshold, canSend: scoring.score >= threshold }, 201)
  } catch (error) {
    return geminiRouteError(error)
  }
}

import { NextRequest } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { requireAuth, jsonError, jsonOk, geminiRouteError } from "@/lib/admin/api-helpers"
import { generateEmailDraft, scoreEmail, getScoreThreshold } from "@/lib/admin/gemini"
import {
  createEditRecord,
  getContactById,
  getEmails,
  saveEmails,
  upsertEmailTrainingExample,
} from "@/lib/admin/storage"
import type { EmailRecord } from "@/lib/admin/types"

export async function POST(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = (await request.json()) as {
      contactId?: string
      emailId?: string
      purpose?: string
      destino?: string
      productInterest?: string
      tone?: string
      additionalContext?: string
    }

    if (!body.contactId) return jsonError("contactId es obligatorio")

    const contact = await getContactById(body.contactId)
    if (!contact) return jsonError("Contacto no encontrado", 404)

    const draft = await generateEmailDraft({
      contact,
      purpose: body.purpose,
      productInterest: body.productInterest,
      tone: body.tone,
      additionalContext: body.additionalContext,
    })

    const scoring = await scoreEmail(draft.asunto, draft.mensaje, contact)
    const destino = body.destino?.trim() || contact.email
    const now = new Date().toISOString()
    const emails = await getEmails()

    let email: EmailRecord

    if (body.emailId) {
      const index = emails.findIndex((e) => e.id === body.emailId)
      if (index === -1) return jsonError("Email no encontrado", 404)
      if (emails[index].status === "sent") {
        return jsonError("No se puede regenerar un email ya enviado")
      }

      email = {
        ...emails[index],
        destino,
        asunto: draft.asunto,
        mensaje: draft.mensaje,
        score: scoring.score,
        scoreFeedback: scoring.feedback,
        scoreDetails: scoring.details,
        status: "scored",
        updatedAt: now,
        editHistory: [
          ...emails[index].editHistory,
          createEditRecord(
            "update",
            { score: { from: emails[index].score, to: scoring.score } },
            `Borrador regenerado y calificado: ${scoring.score}/100`
          ),
        ],
      }
      emails[index] = email
    } else {
      email = {
        id: uuidv4(),
        contactId: contact.id,
        destino,
        asunto: draft.asunto,
        mensaje: draft.mensaje,
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
            `Borrador generado y calificado: ${scoring.score}/100`
          ),
        ],
      }
      emails.push(email)
    }

    await saveEmails(emails)

    await upsertEmailTrainingExample({
      emailId: email.id,
      asunto: draft.asunto,
      mensaje: draft.mensaje,
      score: scoring.score,
      feedback: scoring.feedback,
      purpose: body.purpose,
    })

    const threshold = getScoreThreshold()

    return jsonOk({
      ...draft,
      emailId: email.id,
      destino: email.destino,
      score: scoring.score,
      threshold,
      canSend: scoring.score >= threshold,
    })
  } catch (error) {
    return geminiRouteError(error)
  }
}

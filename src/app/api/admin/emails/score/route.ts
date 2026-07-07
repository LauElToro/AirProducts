import { NextRequest } from "next/server"
import { requireAuth, jsonError, jsonOk, geminiRouteError } from "@/lib/admin/api-helpers"
import { scoreEmail, getScoreThreshold } from "@/lib/admin/gemini"
import {
  createEditRecord,
  getContactById,
  getEmails,
  saveEmails,
} from "@/lib/admin/storage"

export async function POST(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = (await request.json()) as {
      emailId?: string
      asunto?: string
      mensaje?: string
      contactId?: string
    }

    const emails = await getEmails()
    let asunto = body.asunto
    let mensaje = body.mensaje
    let contactId = body.contactId

    if (body.emailId) {
      const email = emails.find((e) => e.id === body.emailId)
      if (!email) return jsonError("Email no encontrado", 404)
      asunto = email.asunto
      mensaje = email.mensaje
      contactId = email.contactId
    }

    if (!asunto || !mensaje) return jsonError("asunto y mensaje son obligatorios")

    const contact = contactId ? await getContactById(contactId) : undefined
    const result = await scoreEmail(asunto, mensaje, contact)
    const threshold = getScoreThreshold()

    if (body.emailId) {
      const index = emails.findIndex((e) => e.id === body.emailId)
      if (index !== -1) {
        emails[index] = {
          ...emails[index],
          score: result.score,
          scoreFeedback: result.feedback,
          scoreDetails: result.details,
          status: "scored",
          updatedAt: new Date().toISOString(),
          editHistory: [
            ...emails[index].editHistory,
            createEditRecord(
              "update",
              { score: { from: emails[index].score, to: result.score } },
              `Calificación: ${result.score}/100`
            ),
          ],
        }
        await saveEmails(emails)
      }
    }

    return jsonOk({
      ...result,
      threshold,
      canSend: result.score >= threshold,
    })
  } catch (error) {
    return geminiRouteError(error)
  }
}

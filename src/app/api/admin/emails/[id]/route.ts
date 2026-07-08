import { NextRequest } from "next/server"
import { requireAuth, jsonError, jsonOk, geminiRouteError } from "@/lib/admin/api-helpers"
import { scoreEmail, getScoreThreshold, normalizeEmailSubject } from "@/lib/admin/gemini"
import {
  createEditRecord,
  diffChanges,
  getContactById,
  getEmails,
  saveEmails,
  upsertEmailTrainingExample,
} from "@/lib/admin/storage"
import type { EmailRecord } from "@/lib/admin/types"

type RouteContext = { params: Promise<{ id: string }> }

const TRACKED_KEYS = ["destino", "asunto", "mensaje", "contactId"] as const

export async function GET(_request: NextRequest, context: RouteContext) {
  const authError = await requireAuth()
  if (authError) return authError

  const { id } = await context.params
  const emails = await getEmails()
  const email = emails.find((e) => e.id === id)
  if (!email) return jsonError("Email no encontrado", 404)
  return jsonOk(email)
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const { id } = await context.params
    const body = (await request.json()) as Partial<
      Pick<EmailRecord, "destino" | "asunto" | "mensaje" | "contactId">
    >

    const emails = await getEmails()
    const index = emails.findIndex((e) => e.id === id)
    if (index === -1) return jsonError("Email no encontrado", 404)

    const before = emails[index]
    if (before.status === "sent") {
      return jsonError("No se puede editar un email ya enviado")
    }

    const updated: EmailRecord = {
      ...before,
      destino: body.destino?.trim() ?? before.destino,
      asunto: normalizeEmailSubject(body.asunto?.trim() ?? before.asunto),
      mensaje: body.mensaje?.trim() ?? before.mensaje,
      contactId: body.contactId ?? before.contactId,
      updatedAt: new Date().toISOString(),
    }

    const contentChanged =
      before.asunto !== updated.asunto || before.mensaje !== updated.mensaje

    const changes = diffChanges(
      before as unknown as Record<string, unknown>,
      updated as unknown as Record<string, unknown>,
      [...TRACKED_KEYS]
    )

    if (Object.keys(changes).length > 0) {
      updated.editHistory = [
        ...before.editHistory,
        createEditRecord("update", changes, "Email actualizado"),
      ]
    } else {
      updated.editHistory = before.editHistory
    }

    if (contentChanged) {
      const contact = await getContactById(updated.contactId)
      const scoring = await scoreEmail(updated.asunto, updated.mensaje, contact)
      updated.score = scoring.score
      updated.scoreFeedback = scoring.feedback
      updated.scoreDetails = scoring.details
      updated.status = "scored"
      updated.editHistory = [
        ...updated.editHistory,
        createEditRecord(
          "update",
          { score: { from: before.score, to: scoring.score } },
          `Recalificado automáticamente: ${scoring.score}/100`
        ),
      ]

      await upsertEmailTrainingExample({
        emailId: updated.id,
        asunto: updated.asunto,
        mensaje: updated.mensaje,
        score: scoring.score,
        feedback: scoring.feedback,
      })
    }

    emails[index] = updated
    await saveEmails(emails)

    const threshold = getScoreThreshold()
    return jsonOk({
      ...updated,
      threshold,
      canSend: (updated.score ?? 0) >= threshold,
    })
  } catch (error) {
    return geminiRouteError(error)
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const authError = await requireAuth()
  if (authError) return authError

  const { id } = await context.params
  const emails = await getEmails()
  const filtered = emails.filter((e) => e.id !== id)
  if (filtered.length === emails.length) return jsonError("Email no encontrado", 404)

  await saveEmails(filtered)
  return jsonOk({ deleted: true, id })
}

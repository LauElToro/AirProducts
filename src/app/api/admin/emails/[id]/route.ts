import { NextRequest } from "next/server"
import { requireAuth, jsonError, jsonOk } from "@/lib/admin/api-helpers"
import {
  createEditRecord,
  diffChanges,
  getEmails,
  saveEmails,
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
      asunto: body.asunto?.trim() ?? before.asunto,
      mensaje: body.mensaje?.trim() ?? before.mensaje,
      contactId: body.contactId ?? before.contactId,
      updatedAt: new Date().toISOString(),
      score: undefined,
      scoreFeedback: undefined,
      scoreDetails: undefined,
      status: "draft",
    }

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
    }

    emails[index] = updated
    await saveEmails(emails)
    return jsonOk(updated)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al actualizar"
    return jsonError(message, 500)
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

import { NextRequest } from "next/server"
import { requireAuth, jsonError, jsonOk } from "@/lib/admin/api-helpers"
import { sendEmail, isEmailConfigured } from "@/lib/admin/email"
import { getScoreThreshold } from "@/lib/admin/gemini"
import {
  createEditRecord,
  getContactById,
  getContacts,
  getEmails,
  saveContacts,
  saveEmails,
} from "@/lib/admin/storage"

export async function POST(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  if (!isEmailConfigured()) {
    return jsonError("Gmail API no configurada. Revise las variables de entorno.", 503)
  }

  let emailId: string | undefined

  try {
    const body = (await request.json()) as { emailId?: string; force?: boolean }
    emailId = body.emailId
    if (!emailId) return jsonError("emailId es obligatorio")

    const emails = await getEmails()
    const index = emails.findIndex((e) => e.id === emailId)
    if (index === -1) return jsonError("Email no encontrado", 404)

    const email = emails[index]
    if (email.status === "sent") return jsonError("Este email ya fue enviado")

    const threshold = getScoreThreshold()
    if (!body.force && (email.score === undefined || email.score < threshold)) {
      return jsonError(
        `El email necesita score ≥ ${threshold} para enviarse. Score actual: ${email.score ?? "sin calificar"}. Califique primero.`,
        422
      )
    }

    await sendEmail({
      to: email.destino,
      subject: email.asunto,
      text: email.mensaje,
    })

    const now = new Date().toISOString()
    emails[index] = {
      ...email,
      status: "sent",
      sentAt: now,
      updatedAt: now,
      editHistory: [
        ...email.editHistory,
        createEditRecord("update", { status: { from: email.status, to: "sent" } }, "Email enviado"),
      ],
    }
    await saveEmails(emails)

    const contact = await getContactById(email.contactId)
    if (contact) {
      const contacts = await getContacts()
      const cIndex = contacts.findIndex((c) => c.id === contact.id)
      if (cIndex !== -1) {
        contacts[cIndex] = {
          ...contacts[cIndex],
          emailsEnviados: contacts[cIndex].emailsEnviados + 1,
          updatedAt: now,
          editHistory: [
            ...contacts[cIndex].editHistory,
            createEditRecord(
              "update",
              {
                emailsEnviados: {
                  from: contacts[cIndex].emailsEnviados,
                  to: contacts[cIndex].emailsEnviados + 1,
                },
              },
              "Email comercial enviado"
            ),
          ],
        }
        await saveContacts(contacts)
      }
    }

    return jsonOk({ sent: true, email: emails[index] })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al enviar email"

    if (emailId) {
      const emails = await getEmails()
      const idx = emails.findIndex((e) => e.id === emailId)
      if (idx !== -1) {
        emails[idx] = {
          ...emails[idx],
          status: "failed",
          errorMessage: message,
          updatedAt: new Date().toISOString(),
        }
        await saveEmails(emails)
      }
    }

    return jsonError(message, 500)
  }
}

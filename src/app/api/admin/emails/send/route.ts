import { NextRequest } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { requireAuth, jsonError, jsonOk } from "@/lib/admin/api-helpers"
import { sendEmail, isEmailConfigured } from "@/lib/admin/email"
import { getScoreThreshold, normalizeEmailSubject } from "@/lib/admin/gemini"
import {
  createEditRecord,
  getContactById,
  getContacts,
  getEmails,
  saveContacts,
  saveEmails,
} from "@/lib/admin/storage"
import type { EmailRecord } from "@/lib/admin/types"

export async function POST(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  if (!isEmailConfigured()) {
    return jsonError("Gmail API no configurada. Revise las variables de entorno.", 503)
  }

  let emailId: string | undefined

  try {
    const body = (await request.json()) as {
      emailId?: string
      contactId?: string
      destino?: string
      asunto?: string
      mensaje?: string
      force?: boolean
    }

    emailId = body.emailId

    const destino = body.destino?.trim()
    const asunto = body.asunto ? normalizeEmailSubject(body.asunto) : undefined
    const mensaje = body.mensaje?.trim()

    if (!destino || !asunto || !mensaje) {
      return jsonError("destino, asunto y mensaje son obligatorios para enviar")
    }

    const emails = await getEmails()
    const now = new Date().toISOString()
    let email: EmailRecord

    if (emailId) {
      const index = emails.findIndex((e) => e.id === emailId)
      if (index === -1) return jsonError("Email no encontrado", 404)

      const before = emails[index]
      if (before.status === "sent") return jsonError("Este email ya fue enviado")

      const contentChanged =
        before.destino !== destino || before.asunto !== asunto || before.mensaje !== mensaje

      const changes: EmailRecord["editHistory"][0]["changes"] = {}
      if (before.destino !== destino) changes.destino = { from: before.destino, to: destino }
      if (before.asunto !== asunto) changes.asunto = { from: before.asunto, to: asunto }
      if (before.mensaje !== mensaje) changes.mensaje = { from: before.mensaje, to: mensaje }

      email = {
        ...before,
        destino,
        asunto,
        mensaje,
        updatedAt: now,
        editHistory: contentChanged
          ? [
              ...before.editHistory,
              createEditRecord("update", changes, "Ediciones del usuario antes del envío"),
            ]
          : before.editHistory,
      }

      emails[index] = email
      await saveEmails(emails)
    } else {
      if (!body.contactId) return jsonError("emailId o contactId es obligatorio")

      const contact = await getContactById(body.contactId)
      if (!contact) return jsonError("Contacto no encontrado", 404)

      emailId = uuidv4()
      email = {
        id: emailId,
        contactId: body.contactId,
        destino,
        asunto,
        mensaje,
        status: "scored",
        createdAt: now,
        updatedAt: now,
        editHistory: [
          createEditRecord("create", { asunto: { to: asunto } }, "Email creado al enviar"),
        ],
      }
      emails.push(email)
      await saveEmails(emails)
    }

    const threshold = getScoreThreshold()
    if (!body.force && (email.score === undefined || email.score < threshold)) {
      return jsonError(
        `El email no alcanza el umbral recomendado (${threshold}%). Score: ${email.score ?? "sin evaluar"}.`,
        422
      )
    }

    await sendEmail({
      to: destino,
      subject: asunto,
      text: mensaje,
    })

    const index = emails.findIndex((e) => e.id === emailId)
    if (index !== -1) {
      emails[index] = {
        ...emails[index],
        destino,
        asunto,
        mensaje,
        status: "sent",
        sentAt: now,
        updatedAt: now,
        editHistory: [
          ...emails[index].editHistory,
          createEditRecord("update", { status: { from: emails[index].status, to: "sent" } }, "Email enviado"),
        ],
      }
      await saveEmails(emails)
      email = emails[index]
    }

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

    return jsonOk({ sent: true, email })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al enviar email"

    if (emailId) {
      const emails = await getEmails()
      const idx = emails.findIndex((e) => e.id === emailId)
      if (idx !== -1 && emails[idx].status !== "sent") {
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

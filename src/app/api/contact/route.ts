import { NextRequest } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { createEditRecord, getContacts, saveContacts } from "@/lib/admin/storage"
import type { Contact } from "@/lib/admin/types"
import { jsonError, jsonOk } from "@/lib/admin/api-helpers"

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      nombre?: string
      email?: string
      asunto?: string
      mensaje?: string
    }

    if (!body.email?.trim() || !body.nombre?.trim()) {
      return jsonError("Nombre y email requeridos")
    }

    const contacts = await getContacts()
    const existing = contacts.find(
      (c) => c.email.toLowerCase() === body.email!.trim().toLowerCase()
    )

    if (existing) {
      const now = new Date().toISOString()
      const updated: Contact = {
        ...existing,
        emailsRecibidos: existing.emailsRecibidos + 1,
        notas: existing.notas
          ? `${existing.notas}\n\n[${now}] ${body.asunto}: ${body.mensaje}`
          : `[${now}] ${body.asunto}: ${body.mensaje}`,
        updatedAt: now,
        editHistory: [
          ...existing.editHistory,
          createEditRecord(
            "update",
            { emailsRecibidos: { from: existing.emailsRecibidos, to: existing.emailsRecibidos + 1 } },
            "Formulario de contacto web"
          ),
        ],
      }
      const index = contacts.findIndex((c) => c.id === existing.id)
      contacts[index] = updated
      await saveContacts(contacts)
      return jsonOk({ contact: updated, created: false })
    }

    const now = new Date().toISOString()
    const nameParts = body.nombre.trim().split(" ")
    const contact: Contact = {
      id: uuidv4(),
      email: body.email.trim(),
      nombre: nameParts[0],
      apellido: nameParts.slice(1).join(" ") || undefined,
      interesProducto: body.asunto,
      emailsRecibidos: 1,
      emailsEnviados: 0,
      vecesCompro: 0,
      puntosInteres: body.asunto ? [body.asunto] : [],
      frecuencia: "baja",
      notas: body.mensaje,
      createdAt: now,
      updatedAt: now,
      editHistory: [
        createEditRecord("create", { email: { to: body.email } }, "Lead desde formulario web"),
      ],
    }

    contacts.push(contact)
    await saveContacts(contacts)
    return jsonOk({ contact, created: true }, 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al registrar contacto"
    return jsonError(message, 500)
  }
}

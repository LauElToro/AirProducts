import { NextRequest } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { requireAuth, jsonError, jsonOk } from "@/lib/admin/api-helpers"
import {
  createEditRecord,
  getContacts,
  saveContacts,
} from "@/lib/admin/storage"
import type { Contact, ContactInput } from "@/lib/admin/types"

export async function GET() {
  const authError = await requireAuth()
  if (authError) return authError

  const contacts = await getContacts()
  return jsonOk(contacts.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)))
}

export async function POST(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = (await request.json()) as Partial<ContactInput>
    if (!body.email?.trim()) return jsonError("Email es obligatorio")

    const now = new Date().toISOString()
    const contact: Contact = {
      id: uuidv4(),
      email: body.email.trim(),
      nombre: body.nombre?.trim(),
      apellido: body.apellido?.trim(),
      empresa: body.empresa?.trim(),
      interesProducto: body.interesProducto?.trim(),
      lugar: body.lugar?.trim(),
      vecesCompro: body.vecesCompro ?? 0,
      emailsEnviados: body.emailsEnviados ?? 0,
      emailsRecibidos: body.emailsRecibidos ?? 0,
      puntosInteres: body.puntosInteres ?? [],
      frecuencia: body.frecuencia ?? "media",
      notas: body.notas?.trim(),
      createdAt: now,
      updatedAt: now,
      editHistory: [
        createEditRecord("create", { email: { to: body.email.trim() } }, "Contacto creado"),
      ],
    }

    const contacts = await getContacts()
    if (contacts.some((c) => c.email.toLowerCase() === contact.email.toLowerCase())) {
      return jsonError("Ya existe un contacto con ese email")
    }

    contacts.push(contact)
    await saveContacts(contacts)
    return jsonOk(contact, 201)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al crear contacto"
    return jsonError(message, 500)
  }
}

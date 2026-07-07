import { NextRequest } from "next/server"
import { requireAuth, jsonError, jsonOk } from "@/lib/admin/api-helpers"
import {
  createEditRecord,
  diffChanges,
  getContactById,
  getContacts,
  saveContacts,
} from "@/lib/admin/storage"
import type { Contact, ContactInput } from "@/lib/admin/types"

type RouteContext = { params: Promise<{ id: string }> }

const TRACKED_KEYS: (keyof ContactInput)[] = [
  "email",
  "nombre",
  "apellido",
  "empresa",
  "interesProducto",
  "lugar",
  "vecesCompro",
  "emailsEnviados",
  "emailsRecibidos",
  "puntosInteres",
  "frecuencia",
  "notas",
]

export async function GET(_request: NextRequest, context: RouteContext) {
  const authError = await requireAuth()
  if (authError) return authError

  const { id } = await context.params
  const contact = await getContactById(id)
  if (!contact) return jsonError("Contacto no encontrado", 404)
  return jsonOk(contact)
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const { id } = await context.params
    const body = (await request.json()) as Partial<ContactInput>
    const contacts = await getContacts()
    const index = contacts.findIndex((c) => c.id === id)
    if (index === -1) return jsonError("Contacto no encontrado", 404)

    const before = contacts[index]
    const updated: Contact = {
      ...before,
      ...body,
      email: body.email?.trim() ?? before.email,
      updatedAt: new Date().toISOString(),
    }

    const changes = diffChanges(
      before as unknown as Record<string, unknown>,
      updated as unknown as Record<string, unknown>,
      TRACKED_KEYS as string[]
    )

    if (Object.keys(changes).length > 0) {
      updated.editHistory = [
        ...before.editHistory,
        createEditRecord("update", changes, "Contacto actualizado"),
      ]
    }

    contacts[index] = updated
    await saveContacts(contacts)
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
  const contacts = await getContacts()
  const contact = contacts.find((c) => c.id === id)
  if (!contact) return jsonError("Contacto no encontrado", 404)

  const filtered = contacts.filter((c) => c.id !== id)
  await saveContacts(filtered)
  return jsonOk({ deleted: true, id })
}

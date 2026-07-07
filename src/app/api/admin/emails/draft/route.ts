import { NextRequest } from "next/server"
import { requireAuth, jsonError, jsonOk, geminiRouteError } from "@/lib/admin/api-helpers"
import { generateEmailDraft } from "@/lib/admin/gemini"
import { getContactById } from "@/lib/admin/storage"

export async function POST(request: NextRequest) {
  const authError = await requireAuth()
  if (authError) return authError

  try {
    const body = (await request.json()) as {
      contactId?: string
      purpose?: string
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

    return jsonOk(draft)
  } catch (error) {
    return geminiRouteError(error)
  }
}

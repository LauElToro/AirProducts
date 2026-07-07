import { NextRequest } from "next/server"
import {
  clearSessionCookie,
  setSessionCookie,
  validateCredentials,
} from "@/lib/admin/auth"
import { jsonError, jsonOk } from "@/lib/admin/api-helpers"

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { username?: string; password?: string }

    if (!body.username || !body.password) {
      return jsonError("Usuario y contraseña requeridos")
    }

    if (!validateCredentials(body.username, body.password)) {
      return jsonError("Credenciales incorrectas", 401)
    }

    await setSessionCookie()
    return jsonOk({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error de login"
    return jsonError(message, 500)
  }
}

export async function DELETE() {
  await clearSessionCookie()
  return jsonOk({ success: true })
}

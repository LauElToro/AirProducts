import { NextResponse } from "next/server"
import { isAuthenticated } from "./auth"

export async function requireAuth(): Promise<NextResponse | null> {
  try {
    const authed = await isAuthenticated()
    if (!authed) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }
    return null
  } catch {
    return NextResponse.json({ error: "Error de autenticación" }, { status: 500 })
  }
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

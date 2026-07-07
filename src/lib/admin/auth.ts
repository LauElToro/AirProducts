import { timingSafeEqual } from "crypto"
import { cookies } from "next/headers"
import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  verifySessionToken,
} from "./session-token"

export function validateCredentials(username: string, password: string): boolean {
  const adminUser = process.env.ADMIN_USERNAME
  const adminPass = process.env.ADMIN_PASSWORD
  if (!adminUser || !adminPass) return false

  const userMatch =
    username.length === adminUser.length &&
    timingSafeEqual(Buffer.from(username), Buffer.from(adminUser))
  const passMatch =
    password.length === adminPass.length &&
    timingSafeEqual(Buffer.from(password), Buffer.from(adminPass))

  return userMatch && passMatch
}

export async function setSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  })
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return false
  return verifySessionToken(token)
}

export { SESSION_COOKIE, verifySessionToken }

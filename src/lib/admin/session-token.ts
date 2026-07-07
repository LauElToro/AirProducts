const SESSION_MAX_AGE = 60 * 60 * 24 * 7

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? ""
}

function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let binary = ""
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function base64UrlDecode(str: string): string {
  const pad = "=".repeat((4 - (str.length % 4)) % 4)
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/") + pad
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

async function hmacSign(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return result === 0
}

export async function createSessionToken(): Promise<string> {
  const secret = getSessionSecret()
  const payload = JSON.stringify({
    user: process.env.ADMIN_USERNAME,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  })
  const encoded = base64UrlEncode(payload)
  const signature = await hmacSign(encoded, secret)
  return `${encoded}.${signature}`
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const secret = getSessionSecret()
    if (!secret) return false

    const [encoded, signature] = token.split(".")
    if (!encoded || !signature) return false

    const expected = await hmacSign(encoded, secret)
    if (!timingSafeEqualStr(signature, expected)) return false

    const payload = JSON.parse(base64UrlDecode(encoded)) as {
      user: string
      exp: number
    }

    if (payload.exp < Date.now()) return false
    if (payload.user !== process.env.ADMIN_USERNAME) return false

    return true
  } catch {
    return false
  }
}

export const SESSION_COOKIE = "admin_session"
export { SESSION_MAX_AGE }

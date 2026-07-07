import { google } from "googleapis"

export const GMAIL_SEND_SCOPE = "https://www.googleapis.com/auth/gmail.send"

export function getOAuthRedirectUri(origin: string): string {
  if (process.env.GOOGLE_REDIRECT_URI) {
    return process.env.GOOGLE_REDIRECT_URI
  }
  return `${origin.replace(/\/$/, "")}/api/admin/gmail/oauth/callback`
}

export function createOAuth2Client(redirectUri: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("Faltan GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET")
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri)
}

export function getOAuth2AuthUrl(redirectUri: string): string {
  const oauth2 = createOAuth2Client(redirectUri)
  return oauth2.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [GMAIL_SEND_SCOPE],
  })
}

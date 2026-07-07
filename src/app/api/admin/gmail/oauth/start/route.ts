import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/admin/auth"
import { getOAuth2AuthUrl, getOAuthRedirectUri } from "@/lib/admin/gmail-oauth"
import { jsonError } from "@/lib/admin/api-helpers"

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return jsonError("No autorizado", 401)
  }

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return jsonError("Faltan GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET", 503)
  }

  const redirectUri = getOAuthRedirectUri(request.nextUrl.origin)
  const authUrl = getOAuth2AuthUrl(redirectUri)

  return NextResponse.redirect(authUrl)
}

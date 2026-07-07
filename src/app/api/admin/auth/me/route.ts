import { isAuthenticated } from "@/lib/admin/auth"
import { jsonOk } from "@/lib/admin/api-helpers"
import { getScoreThreshold } from "@/lib/admin/gemini"
import { isEmailConfigured } from "@/lib/admin/email"

export async function GET() {
  const authed = await isAuthenticated()
  return jsonOk({
    authenticated: authed,
    gmailConfigured: isEmailConfigured(),
    smtpConfigured: isEmailConfigured(),
    scoreThreshold: getScoreThreshold(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
  })
}

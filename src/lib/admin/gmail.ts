import { google } from "googleapis"

export type SendEmailParams = {
  to: string
  subject: string
  text: string
  html?: string
}

export function isGmailApiConfigured(): boolean {
  const sender = process.env.GMAIL_SENDER
  if (!sender) return false

  const hasServiceAccount = Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  )

  const hasOAuth = Boolean(
    process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET &&
      process.env.GOOGLE_REFRESH_TOKEN
  )

  return hasServiceAccount || hasOAuth
}

async function getGmailClient() {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n"
  )
  const sender = process.env.GMAIL_SENDER

  if (serviceAccountEmail && privateKey && sender) {
    const auth = new google.auth.JWT({
      email: serviceAccountEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/gmail.send"],
      subject: sender,
    })
    return google.gmail({ version: "v1", auth })
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      "Gmail API no configurada. Use cuenta de servicio (Workspace) u OAuth2 (CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN)."
    )
  }

  const oauth2 = new google.auth.OAuth2(clientId, clientSecret)
  oauth2.setCredentials({ refresh_token: refreshToken })
  return google.gmail({ version: "v1", auth: oauth2 })
}

function encodeSubject(subject: string): string {
  return `=?UTF-8?B?${Buffer.from(subject, "utf-8").toString("base64")}?=`
}

function buildRawMessage(
  from: string,
  to: string,
  subject: string,
  text: string,
  html?: string
): string {
  const fromHeader = `Air Products SRL <${from}>`

  if (html) {
    const boundary = `b_${Date.now()}`
    const body = [
      `From: ${fromHeader}`,
      `To: ${to}`,
      `Subject: ${encodeSubject(subject)}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      "",
      `--${boundary}`,
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: base64",
      "",
      Buffer.from(text, "utf-8").toString("base64"),
      `--${boundary}`,
      "Content-Type: text/html; charset=UTF-8",
      "Content-Transfer-Encoding: base64",
      "",
      Buffer.from(html, "utf-8").toString("base64"),
      `--${boundary}--`,
    ].join("\r\n")

    return Buffer.from(body).toString("base64url")
  }

  const body = [
    `From: ${fromHeader}`,
    `To: ${to}`,
    `Subject: ${encodeSubject(subject)}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(text, "utf-8").toString("base64"),
  ].join("\r\n")

  return Buffer.from(body).toString("base64url")
}

export async function sendViaGmailApi(params: SendEmailParams): Promise<void> {
  const from = process.env.GMAIL_SENDER
  if (!from) throw new Error("GMAIL_SENDER no configurado")

  const gmail = await getGmailClient()
  const html = params.html ?? params.text.replace(/\n/g, "<br>")
  const raw = buildRawMessage(from, params.to, params.subject, params.text, html)

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  })
}

import { sendViaGmailApi, isGmailApiConfigured } from "./gmail"

export type SendEmailParams = {
  to: string
  subject: string
  text: string
  html?: string
}

export async function sendEmail(params: SendEmailParams): Promise<void> {
  if (!isGmailApiConfigured()) {
    throw new Error(
      "Gmail API no configurada. Revise GMAIL_SENDER y credenciales OAuth o cuenta de servicio."
    )
  }

  await sendViaGmailApi(params)
}

export function isEmailConfigured(): boolean {
  return isGmailApiConfigured()
}

/** @deprecated Use isEmailConfigured */
export const isSmtpConfigured = isEmailConfigured

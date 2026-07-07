import { NextRequest, NextResponse } from "next/server"
import { createOAuth2Client, getOAuthRedirectUri } from "@/lib/admin/gmail-oauth"

function htmlPage(title: string, body: string) {
  return new NextResponse(
    `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; line-height: 1.5; }
    code, pre { background: #f4f4f5; padding: 0.75rem 1rem; border-radius: 8px; display: block; overflow-x: auto; word-break: break-all; }
    h1 { font-size: 1.5rem; }
    .ok { color: #166534; }
    .err { color: #991b1b; }
  </style>
</head>
<body>${body}</body>
</html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  )
}

export async function GET(request: NextRequest) {
  const error = request.nextUrl.searchParams.get("error")
  const code = request.nextUrl.searchParams.get("code")

  if (error) {
    return htmlPage(
      "Error OAuth",
      `<h1 class="err">Error de autorización</h1><p>${error}</p>
       <p>Si ves <strong>redirect_uri_mismatch</strong>, agregá esta URI en Google Cloud Console:</p>
       <code>${getOAuthRedirectUri(request.nextUrl.origin)}</code>`
    )
  }

  if (!code) {
    return htmlPage("Error OAuth", `<h1 class="err">No se recibió código de autorización</h1>`)
  }

  try {
    const redirectUri = getOAuthRedirectUri(request.nextUrl.origin)
    const oauth2 = createOAuth2Client(redirectUri)
    const { tokens } = await oauth2.getToken(code)

    if (!tokens.refresh_token) {
      return htmlPage(
        "Token incompleto",
        `<h1 class="err">No se obtuvo refresh token</h1>
         <p>Revocá el acceso en <a href="https://myaccount.google.com/permissions">Permisos de Google</a> e intentá de nuevo con <code>prompt=consent</code>.</p>`
      )
    }

    const sender = process.env.GMAIL_SENDER ?? "tu_cuenta@gmail.com"

    return htmlPage(
      "Gmail conectado",
      `<h1 class="ok">¡Autorización exitosa!</h1>
       <p>Agregá esta línea a <strong>.env</strong> y a Vercel:</p>
       <pre>GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}</pre>
       <p>Remitente configurado: <strong>${sender}</strong></p>
       <p>Autorizá siempre con esa misma cuenta (<strong>${sender}</strong>).</p>
       <p><a href="/admin">Volver al panel</a></p>`
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error desconocido"
    return htmlPage(
      "Error OAuth",
      `<h1 class="err">No se pudo obtener el token</h1><p>${message}</p>`
    )
  }
}

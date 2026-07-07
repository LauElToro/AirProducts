/**
 * Abre el flujo OAuth integrado en Next.js (requiere `npm run dev`).
 * Uso: npm run gmail:auth
 */
import { exec } from "child_process"

const port = process.env.PORT ?? "3000"
const url = `http://localhost:${port}/api/admin/gmail/oauth/start`

console.log("\nGmail OAuth — flujo integrado en Next.js\n")
console.log("1. Asegurate de tener el servidor corriendo: npm run dev")
console.log("2. Iniciá sesión en /admin si hace falta")
console.log("3. Abrí esta URL:\n")
console.log(url)
console.log(
  "\n4. En Google Cloud Console, agregá esta URI de redirección autorizada:\n"
)
console.log(`   http://localhost:${port}/api/admin/gmail/oauth/callback`)
console.log(
  "   https://air-products.vercel.app/api/admin/gmail/oauth/callback\n"
)
console.log("5. Autorizá con la cuenta configurada en GMAIL_SENDER\n")

exec(`start "" "${url}"`, (err) => {
  if (err) console.log("(Abrí la URL manualmente en el navegador)\n")
})

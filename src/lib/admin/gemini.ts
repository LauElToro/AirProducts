import { GoogleGenerativeAI } from "@google/generative-ai"
import { formatContactContextForAi } from "./contact-context"
import { getTopEmailTrainingExamples } from "./storage"
import type { Contact } from "./types"

export class GeminiHttpError extends Error {
  status: number
  retryAfterSeconds?: number

  constructor(message: string, status: number, retryAfterSeconds?: number) {
    super(message)
    this.name = "GeminiHttpError"
    this.status = status
    this.retryAfterSeconds = retryAfterSeconds
  }
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new GeminiHttpError("GEMINI_API_KEY no configurado", 503)
  return new GoogleGenerativeAI(apiKey)
}

function getModelCandidates(): string[] {
  const configured = process.env.GEMINI_MODEL ?? "gemini-2.5-flash"
  const fallbacks = (process.env.GEMINI_MODEL_FALLBACKS ?? "gemini-2.5-flash-lite,gemini-1.5-flash")
    .split(",")
    .map((model) => model.trim())
    .filter(Boolean)

  return [...new Set([configured, ...fallbacks])]
}

function isRetryableGeminiError(error: unknown): boolean {
  const raw = error instanceof Error ? error.message : String(error)
  return (
    raw.includes("429") ||
    raw.includes("Quota exceeded") ||
    raw.includes("RESOURCE_EXHAUSTED") ||
    raw.includes("Too Many Requests") ||
    raw.includes("503 Service Unavailable") ||
    raw.includes("model is overloaded") ||
    raw.includes("limit: 0")
  )
}

export function parseGeminiError(error: unknown): GeminiHttpError {
  if (error instanceof GeminiHttpError) return error

  const raw = error instanceof Error ? error.message : String(error)

  if (
    raw.includes("429") ||
    raw.includes("Quota exceeded") ||
    raw.includes("RESOURCE_EXHAUSTED") ||
    raw.includes("Too Many Requests")
  ) {
    const retryMatch = raw.match(/retry in ([\d.]+)s/i)
    const retryAfterSeconds = retryMatch ? Math.ceil(Number(retryMatch[1])) : undefined
    const retryHint = retryAfterSeconds
      ? ` Intentá de nuevo en ${retryAfterSeconds} segundos.`
      : ""

    return new GeminiHttpError(
      `Cuota de Gemini agotada para el modelo configurado.${retryHint} Revisá uso en Google AI Studio o cambiá GEMINI_MODEL.`,
      429,
      retryAfterSeconds
    )
  }

  if (raw.includes("API key not valid") || raw.includes("API_KEY_INVALID")) {
    return new GeminiHttpError("GEMINI_API_KEY inválida. Verificá la clave en Vercel.", 503)
  }

  if (raw.includes("404") && raw.includes("models/")) {
    return new GeminiHttpError(
      "Modelo Gemini no disponible. Probá GEMINI_MODEL=gemini-2.5-flash en las variables de entorno.",
      503
    )
  }

  if (raw.includes("GoogleGenerativeAI Error")) {
    return new GeminiHttpError(
      "No se pudo conectar con Gemini. Verificá la API key y el modelo configurado.",
      502
    )
  }

  return new GeminiHttpError(raw || "Error desconocido de Gemini", 500)
}

async function generateText(prompt: string): Promise<string> {
  const candidates = getModelCandidates()
  let lastError: unknown

  for (const modelName of candidates) {
    try {
      const model = getGeminiClient().getGenerativeModel({ model: modelName })
      const result = await model.generateContent(prompt)
      return result.response.text().trim()
    } catch (error) {
      lastError = error
      if (!isRetryableGeminiError(error)) {
        throw parseGeminiError(error)
      }
    }
  }

  throw parseGeminiError(lastError)
}

export type EmailDraftRequest = {
  contact: Contact
  purpose?: string
  productInterest?: string
  tone?: string
  additionalContext?: string
}

export type EmailDraftResult = {
  asunto: string
  mensaje: string
}

const SUBJECT_GREETING_PATTERN =
  /^(?:(?:hola|buenas|buen\s+d[ií]a|buenos\s+d[ií]as|buenas\s+tardes|buenas\s+noches|saludos|estimad[oa]s?|querid[oa]s?|apreciad[oa]s?)(?:\s+[A-Za-zÀ-ÿ][\wÀ-ÿ.-]*)?)\s*[,:\-–—]?\s*/i

export function normalizeEmailSubject(asunto: string): string {
  let subject = asunto.trim().replace(/^["']|["']$/g, "")
  subject = subject.replace(SUBJECT_GREETING_PATTERN, "").trim()
  subject = subject.replace(/^[-–—:\s]+/, "").trim()
  return subject || asunto.trim()
}

export async function generateEmailDraft(
  request: EmailDraftRequest
): Promise<EmailDraftResult> {
  const contactContext = formatContactContextForAi(request.contact)
  const interesProducto =
    request.productInterest || request.contact.interesProducto || "Serie OX - compresores booster"

  const topExamples = await getTopEmailTrainingExamples(3)
  const examplesBlock =
    topExamples.length > 0
      ? `\nEJEMPLOS DE REFERENCIA (emails con mayor puntaje histórico — usalos como guía de estilo y estructura, no copies literalmente):\n${topExamples
          .map(
            (ex, i) =>
              `${i + 1}. [${ex.score}/100] Asunto: ${ex.asunto}\nMensaje:\n${ex.mensaje}`
          )
          .join("\n\n")}\n`
      : ""

  const prompt = `Sos un experto en ventas B2B de compresores industriales libres de aceite para oxígeno (Air Products SRL, Argentina).
Redactá un email comercial en español profesional pero cercano, orientado a maximizar la probabilidad de respuesta.
${examplesBlock}
FICHA COMPLETA DEL CONTACTO (usá TODA esta información para personalizar el email):
${contactContext}

ENFOQUE PARA ESTE EMAIL (objetivo principal — todo el mail debe girar en torno a esto):
- ${request.purpose || "Seguimiento comercial para generar venta o cotización"}
- Producto / línea a destacar: ${interesProducto}
- Tono: ${request.tone || "Profesional, confiable, orientado a soluciones"}
- Contexto adicional: ${request.additionalContext || "Ninguno"}

PASO PREVIO (mental, no lo escribas en la respuesta):
1. Definí el objetivo concreto de ESTE email para ESTE contacto según su ficha (¿reactivar? ¿cotizar? ¿seguimiento post-compra? ¿primer contacto?)
2. Elegí qué datos del contacto vas a usar para que se sienta hecho a medida (empresa, producto de interés, historial, notas, ubicación)

REGLAS DEL ASUNTO (campo "asunto"):
- SOLO el asunto: una línea clara, directa y profesional
- PROHIBIDO saludos o fórmulas sociales: no uses "Hola", "Buenas", "Buenos días", "Estimado", "Saludos", etc.
- Debe reflejar el objetivo específico para este cliente (mencionar empresa, producto o situación cuando aplique)
- Ejemplos válidos: "Cotización compresor OX300 para Liberty Club", "Seguimiento post-entrega — repuestos Serie OX"
- Ejemplos inválidos: "Hola, cotización OX300", "Buenas — seguimiento comercial"

REGLAS DEL MENSAJE (campo "mensaje"):
- Personalizá al máximo usando la ficha del contacto; el lector debe sentir que el mail es para él/ella, no genérico
- Si ya compró o hubo emails previos, adaptá el enfoque (seguimiento vs. primer acercamiento)
- Los saludos van SOLO en el cuerpo del mensaje, nunca en el asunto
- Máximo 200 palabras en el cuerpo
- Llamada a acción clara y concreta acorde al objetivo definido
- No inventar datos que no fueron provistos
- Firmar como "Equipo Comercial - Air Products SRL"

Respondé ÚNICAMENTE con JSON válido (sin markdown):
{"asunto": "...", "mensaje": "..."}`

  const text = await generateText(prompt)
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new GeminiHttpError("Gemini no devolvió JSON válido", 502)

  const parsed = JSON.parse(jsonMatch[0]) as EmailDraftResult
  if (!parsed.asunto || !parsed.mensaje) {
    throw new GeminiHttpError("Respuesta incompleta de Gemini", 502)
  }
  parsed.asunto = normalizeEmailSubject(parsed.asunto)
  return parsed
}

export type EmailScoreResult = {
  score: number
  feedback: string
  details: {
    claridad: number
    personalizacion: number
    llamadaAccion: number
    tonoProfesional: number
    probabilidadRespuesta: number
  }
}

export async function scoreEmail(
  asunto: string,
  mensaje: string,
  contact?: Contact
): Promise<EmailScoreResult> {
  const contactBlock = contact
    ? `\nFICHA COMPLETA DEL CONTACTO (evaluá si el email aprovecha esta información):\n${formatContactContextForAi(contact)}\n`
    : ""

  const prompt = `Sos un experto en email marketing B2B industrial. Evaluá este email comercial de Air Products SRL (compresores de oxígeno).
${contactBlock}
ASUNTO: ${asunto}
MENSAJE:
${mensaje}

Evaluá de 0 a 100 cada criterio y calculá un score general (promedio ponderado donde probabilidadRespuesta pesa 30%, personalizacion 25%, llamadaAccion 20%, claridad 15%, tonoProfesional 10%).
En personalización, penalizá emails genéricos que ignoren datos clave del contacto (empresa, historial, intereses, notas).
Penalizá asuntos con saludos ("Hola", "Buenas", etc.) — el asunto debe ser solo tema/objetivo del mail.
Evaluá si el email tiene un objetivo claro y adaptado a la situación de este contacto en particular.

Respondé ÚNICAMENTE con JSON válido (sin markdown):
{
  "score": 85,
  "feedback": "Explicación breve en español de fortalezas y mejoras",
  "details": {
    "claridad": 90,
    "personalizacion": 80,
    "llamadaAccion": 85,
    "tonoProfesional": 90,
    "probabilidadRespuesta": 80
  }
}`

  const text = await generateText(prompt)
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new GeminiHttpError("Gemini no devolvió JSON válido para scoring", 502)

  const parsed = JSON.parse(jsonMatch[0]) as EmailScoreResult
  parsed.score = Math.min(100, Math.max(0, Math.round(parsed.score)))
  return parsed
}

const ADMIN_SECTIONS_CONTEXT = `
Sos el asistente del panel de administración de Air Products SRL. Ayudás a un operador mayor de 50 años a usar el sistema.
Respondé SIEMPRE en español, con frases cortas, letra grande conceptualmente (texto claro y simple), sin tecnicismos innecesarios.

SECCIONES DEL PANEL:

1. INICIO (/admin): Resumen general con accesos rápidos a contactos, emails y métricas.

2. CONTACTOS (/admin/contactos): Lista de clientes y leads. Podés agregar, editar o eliminar contactos.
   Campos: email, nombre, apellido, empresa, interés en producto, ubicación, veces que compró, emails enviados/recibidos, puntos de interés, frecuencia de contacto.
   Cada contacto tiene historial de cambios con fecha.

3. EMAILS (/admin/emails): Redactar y enviar emails comerciales.
   - Seleccionar un contacto destino
   - La IA (Gemini) redacta el email y lo califica automáticamente
   - Solo se puede enviar si el score supera el umbral configurado (por defecto 70)
   - Campos: destino, asunto, mensaje

4. MÉTRICAS (/admin/metricas): Estadísticas del sitio web.
   - Visitas totales y por página
   - De dónde vienen los visitantes (referrer)
   - Mapa de calor de clics y scroll
   - Dispositivos y horarios

REGLAS:
- Sé paciente y didáctico
- Si preguntan cómo hacer algo, explicá paso a paso
- No inventes datos de contactos o métricas; si no tenés acceso a datos en tiempo real, explicá dónde encontrarlos en el panel
`

export async function chatWithAssistant(
  messages: { role: "user" | "assistant"; content: string }[],
  currentSection?: string
): Promise<string> {
  const sectionNote = currentSection
    ? `\nEl usuario está actualmente en la sección: ${currentSection}`
    : ""

  const history = messages
    .slice(-20)
    .map((m) => `${m.role === "user" ? "Usuario" : "Asistente"}: ${m.content}`)
    .join("\n")

  const prompt = `${ADMIN_SECTIONS_CONTEXT}${sectionNote}

CONVERSACIÓN PREVIA:
${history}

Respondé al último mensaje del usuario de forma clara y útil. Máximo 150 palabras.`

  return generateText(prompt)
}

export function getScoreThreshold(): number {
  const threshold = Number(process.env.EMAIL_SCORE_THRESHOLD ?? "70")
  return Number.isFinite(threshold) ? Math.min(100, Math.max(0, threshold)) : 70
}

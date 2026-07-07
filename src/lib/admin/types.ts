export type EditRecord = {
  id: string
  timestamp: string
  action: "create" | "update" | "delete"
  changes: Record<string, { from?: unknown; to?: unknown }>
  note?: string
}

export type ContactFrequency = "baja" | "media" | "alta" | "muy_alta"

export type Contact = {
  id: string
  email: string
  nombre?: string
  apellido?: string
  empresa?: string
  interesProducto?: string
  lugar?: string
  vecesCompro: number
  emailsEnviados: number
  emailsRecibidos: number
  puntosInteres: string[]
  frecuencia: ContactFrequency
  notas?: string
  createdAt: string
  updatedAt: string
  editHistory: EditRecord[]
}

export type EmailStatus = "draft" | "scored" | "sent" | "failed"

export type EmailRecord = {
  id: string
  contactId: string
  destino: string
  asunto: string
  mensaje: string
  score?: number
  scoreFeedback?: string
  scoreDetails?: {
    claridad: number
    personalizacion: number
    llamadaAccion: number
    tonoProfesional: number
    probabilidadRespuesta: number
  }
  status: EmailStatus
  sentAt?: string
  errorMessage?: string
  createdAt: string
  updatedAt: string
  editHistory: EditRecord[]
}

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
  section?: string
  timestamp: string
}

export type ChatSession = {
  id: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

export type PageView = {
  id: string
  path: string
  referrer: string
  userAgent: string
  language: string
  screenWidth: number
  screenHeight: number
  timestamp: string
  sessionId: string
  country?: string
  city?: string
  timezone?: string
}

export type HeatmapEvent = {
  id: string
  path: string
  type: "click" | "scroll" | "mousemove"
  x: number
  y: number
  scrollDepth?: number
  viewportWidth: number
  viewportHeight: number
  timestamp: string
  sessionId: string
}

export type AnalyticsData = {
  pageViews: PageView[]
  heatmapEvents: HeatmapEvent[]
}

export type ContactInput = Omit<
  Contact,
  "id" | "createdAt" | "updatedAt" | "editHistory"
>

export type EmailInput = Pick<
  EmailRecord,
  "contactId" | "destino" | "asunto" | "mensaje"
>

export type EmailTrainingExample = {
  id: string
  emailId?: string
  asunto: string
  mensaje: string
  score: number
  feedback: string
  purpose?: string
  createdAt: string
}

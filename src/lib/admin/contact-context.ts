import type { Contact, ContactFrequency } from "./types"

const FREQ_LABELS: Record<ContactFrequency, string> = {
  baja: "Baja",
  media: "Media",
  alta: "Alta",
  muy_alta: "Muy alta",
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function formatEditHistory(contact: Contact): string {
  if (!contact.editHistory.length) return "Sin movimientos registrados"

  return contact.editHistory
    .slice(-8)
    .map((entry) => {
      const date = formatDate(entry.timestamp)
      const note = entry.note ?? entry.action
      return `- ${date} (${entry.action}): ${note}`
    })
    .join("\n")
}

export function formatContactContextForAi(contact: Contact): string {
  const nombreCompleto =
    [contact.nombre, contact.apellido].filter(Boolean).join(" ") || "No especificado"

  return `IDENTIFICACIÓN:
- Nombre completo: ${nombreCompleto}
- Email: ${contact.email}
- Empresa: ${contact.empresa || "No especificada"}
- Ubicación: ${contact.lugar || "No especificada"}

INTERÉS Y CONTEXTO COMERCIAL:
- Interés en producto: ${contact.interesProducto || "No especificado (considerar Serie OX — compresores booster)"}
- Puntos de interés: ${contact.puntosInteres.length ? contact.puntosInteres.join(", ") : "No especificados"}
- Notas internas del equipo: ${contact.notas || "Ninguna"}

RELACIÓN Y ACTIVIDAD:
- Veces que compró: ${contact.vecesCompro}
- Emails comerciales enviados a este contacto: ${contact.emailsEnviados}
- Emails recibidos de este contacto: ${contact.emailsRecibidos}
- Frecuencia de contacto recomendada: ${FREQ_LABELS[contact.frecuencia]}

HISTORIAL RECIENTE EN CRM:
${formatEditHistory(contact)}

REGISTRO:
- Contacto creado: ${formatDate(contact.createdAt)}
- Última actualización: ${formatDate(contact.updatedAt)}`
}

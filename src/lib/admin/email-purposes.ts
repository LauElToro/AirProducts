import type { Contact } from "./types"

export type EmailPurposeOption = {
  id: string
  label: string
  hint: string
  prompt: string
}

export const CUSTOM_EMAIL_PURPOSE_ID = "otro"

export const EMAIL_PURPOSES: EmailPurposeOption[] = [
  {
    id: "primer_contacto",
    label: "Primer contacto comercial",
    hint: "Lead nuevo, sin historial de emails ni compras previas.",
    prompt:
      "Primer acercamiento comercial: presentar Air Products SRL y la Serie OX, generar interés y abrir conversación sin presionar.",
  },
  {
    id: "seguimiento_cotizacion",
    label: "Seguimiento de cotización",
    hint: "Ya enviaste propuesta o cotización y esperás respuesta.",
    prompt:
      "Seguimiento amable de una cotización o propuesta comercial pendiente: recordar valor, resolver dudas y proponer próximo paso concreto.",
  },
  {
    id: "reactivacion",
    label: "Reactivar lead inactivo",
    hint: "Hubo contacto previo pero hace tiempo que no responde.",
    prompt:
      "Reactivar un lead que dejó de responder: retomar el vínculo con novedad relevante, sin reproches, invitando a retomar la conversación.",
  },
  {
    id: "respuesta_consulta",
    label: "Responder consulta recibida",
    hint: "El cliente escribió o consultó por web; hay que responder puntualmente.",
    prompt:
      "Responder una consulta específica del cliente con claridad técnica-comercial, demostrando expertise y proponiendo una llamada o reunión si aplica.",
  },
  {
    id: "postventa",
    label: "Post-venta y fidelización",
    hint: "Cliente que ya compró; reforzar relación y detectar nuevas necesidades.",
    prompt:
      "Email post-venta: agradecer la confianza, consultar satisfacción con el equipo adquirido y ofrecer soporte o ampliación si corresponde.",
  },
  {
    id: "repuestos",
    label: "Repuestos y mantenimiento",
    hint: "Cliente con equipos instalados; foco en service planificado.",
    prompt:
      "Promover repuestos, mantenimiento preventivo o service de compresores Serie OX ya instalados, destacando continuidad operativa y certificaciones.",
  },
  {
    id: "upselling",
    label: "Upgrade / mayor capacidad",
    hint: "Cliente activo al que le conviene un modelo de mayor caudal o presión.",
    prompt:
      "Proponer upgrade a un compresor de mayor capacidad de la Serie OX según crecimiento del cliente, con beneficio operativo claro.",
  },
  {
    id: "demo_visita",
    label: "Invitar a demo o visita técnica",
    hint: "Lead calificado que necesita ver el equipo o recibir asesoramiento presencial.",
    prompt:
      "Invitar a una demostración, visita técnica o reunión con ingeniería para evaluar necesidades de oxígeno y dimensionar la solución OX adecuada.",
  },
  {
    id: "certificaciones",
    label: "Documentación y certificaciones",
    hint: "Cliente que pide fichas técnicas, CE, manual o documentación de exportación.",
    prompt:
      "Ofrecer o hacer seguimiento de documentación técnica, certificaciones (CE, libre de aceite) y material de soporte para evaluación o homologación.",
  },
  {
    id: "licitacion",
    label: "Apoyo para licitación o exportación",
    hint: "Proyecto formal, compra pública o exportación internacional.",
    prompt:
      "Apoyar un proceso de licitación, compra institucional o exportación: ofrecer datos técnicos, plazos, cumplimiento normativo y acompañamiento comercial.",
  },
  {
    id: "promocion",
    label: "Condiciones comerciales especiales",
    hint: "Ventana promocional, stock disponible o condiciones de pago preferenciales.",
    prompt:
      "Comunicar condiciones comerciales especiales o plazos limitados de forma profesional, sin sonar agresivo, con CTA claro para cerrar o reservar.",
  },
  {
    id: "referidos",
    label: "Pedir referido o introducción",
    hint: "Cliente satisfecho que puede recomendar a otro decisor o empresa del rubro.",
    prompt:
      "Solicitar amablemente una introducción o referido a otra área, planta o empresa del sector, aprovechando la buena relación existente.",
  },
  {
    id: "feria_evento",
    label: "Invitación a feria o evento",
    hint: "Invitar a stand, webinar o evento del sector industrial/gases.",
    prompt:
      "Invitar a un evento, feria industrial o reunión técnica donde Air Products presentará soluciones de compresión de oxígeno Serie OX.",
  },
  {
    id: CUSTOM_EMAIL_PURPOSE_ID,
    label: "Otro (personalizado)",
    hint: "Definí el objetivo en el campo de texto debajo.",
    prompt: "",
  },
]

export function getEmailPurposeById(id: string): EmailPurposeOption | undefined {
  return EMAIL_PURPOSES.find((p) => p.id === id)
}

export function resolveEmailPurposePrompt(purposeId: string, customPurpose?: string): string {
  if (purposeId === CUSTOM_EMAIL_PURPOSE_ID) {
    return customPurpose?.trim() || "Seguimiento comercial personalizado según contexto del contacto"
  }
  return getEmailPurposeById(purposeId)?.prompt ?? EMAIL_PURPOSES[0].prompt
}

export function suggestEmailPurposeId(contact: Contact): string {
  if (contact.emailsRecibidos > 0 && contact.emailsEnviados <= 1) {
    return "respuesta_consulta"
  }
  if (contact.vecesCompro > 0 && contact.emailsEnviados >= 2) {
    return "postventa"
  }
  if (contact.vecesCompro > 0) {
    return "repuestos"
  }
  if (contact.emailsEnviados >= 2 && contact.vecesCompro === 0) {
    return "reactivacion"
  }
  if (contact.emailsEnviados === 1) {
    return "seguimiento_cotizacion"
  }
  if (contact.interesProducto?.toLowerCase().includes("ox")) {
    return "demo_visita"
  }
  return "primer_contacto"
}

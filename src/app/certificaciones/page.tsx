import type { Metadata } from "next"
import { CertificationsView } from "@/views/certifications-view"
import { getDictionary } from "@/i18n/dictionaries"

export const metadata: Metadata = {
  title: getDictionary("es").certifications.pageTitle,
  description: getDictionary("es").certifications.pageSubtitle,
}

export default function CertificacionesPage() {
  return <CertificationsView locale="es" />
}

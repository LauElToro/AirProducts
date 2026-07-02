import type { Metadata } from "next"
import { EngineeringView } from "@/views/engineering-view"
import { getDictionary } from "@/i18n/dictionaries"

export const metadata: Metadata = {
  title: getDictionary("es").engineering.pageTitle,
  description: getDictionary("es").engineering.pageSubtitle,
}

export default function IngenieriaPage() {
  return <EngineeringView locale="es" />
}

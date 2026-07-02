import type { Metadata } from "next"
import { VisionView } from "@/views/vision-view"
import { getDictionary } from "@/i18n/dictionaries"

export const metadata: Metadata = {
  title: getDictionary("es").vision.title,
  description: getDictionary("es").vision.subtitle,
}

export default function VisionPage() {
  return <VisionView locale="es" />
}

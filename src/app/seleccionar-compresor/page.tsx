import type { Metadata } from "next"
import { SelectorView } from "@/views/selector-view"
import { getDictionary } from "@/i18n/dictionaries"

export const metadata: Metadata = {
  title: getDictionary("es").selector.title,
  description: getDictionary("es").selector.subtitle,
}

export default function SeleccionarCompresorPage() {
  return <SelectorView locale="es" />
}

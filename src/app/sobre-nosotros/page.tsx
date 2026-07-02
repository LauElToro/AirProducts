import type { Metadata } from "next"
import { getSiteMetadata } from "@/components/layout/page-layout"
import { AboutView } from "@/views/about-view"
import { getDictionary } from "@/i18n/dictionaries"

export const metadata: Metadata = {
  ...getSiteMetadata("es"),
  title: getDictionary("es").about.title,
  description: getDictionary("es").aboutParagraphs[0],
}

export default function SobreNosotrosPage() {
  return <AboutView locale="es" />
}

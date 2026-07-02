import type { Metadata } from "next"
import { AboutView } from "@/views/about-view"
import { getDictionary } from "@/i18n/dictionaries"

export const metadata: Metadata = {
  title: getDictionary("en").about.title,
  description: getDictionary("en").aboutParagraphs[0],
  alternates: { languages: { "es-AR": "/sobre-nosotros", en: "/en/about" } },
}

export default function EnAboutPage() {
  return <AboutView locale="en" />
}

import type { Metadata } from "next"
import { ContactView } from "@/views/contact-view"
import { getDictionary } from "@/i18n/dictionaries"

export const metadata: Metadata = {
  title: getDictionary("es").contact.title,
  description: getDictionary("es").contact.label,
}

export default function ContactoPage() {
  return <ContactView locale="es" />
}

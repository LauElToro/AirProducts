import type { Metadata } from "next"
import { ContactView } from "@/views/contact-view"
import { getDictionary } from "@/i18n/dictionaries"

export const metadata: Metadata = {
  title: getDictionary("en").contact.title,
  description: getDictionary("en").contact.label,
}

export default function EnContactPage() {
  return <ContactView locale="en" />
}

import type { Metadata } from "next"
import { CertificationsView } from "@/views/certifications-view"
import { getDictionary } from "@/i18n/dictionaries"

export const metadata: Metadata = {
  title: getDictionary("en").certifications.pageTitle,
  description: getDictionary("en").certifications.pageSubtitle,
}

export default function EnCertificationsPage() {
  return <CertificationsView locale="en" />
}

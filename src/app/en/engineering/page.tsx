import type { Metadata } from "next"
import { EngineeringView } from "@/views/engineering-view"
import { getDictionary } from "@/i18n/dictionaries"

export const metadata: Metadata = {
  title: getDictionary("en").engineering.pageTitle,
  description: getDictionary("en").engineering.pageSubtitle,
}

export default function EnEngineeringPage() {
  return <EngineeringView locale="en" />
}

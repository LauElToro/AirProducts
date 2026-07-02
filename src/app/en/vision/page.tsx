import type { Metadata } from "next"
import { VisionView } from "@/views/vision-view"
import { getDictionary } from "@/i18n/dictionaries"

export const metadata: Metadata = {
  title: getDictionary("en").vision.title,
  description: getDictionary("en").vision.subtitle,
}

export default function EnVisionPage() {
  return <VisionView locale="en" />
}

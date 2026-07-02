import type { Metadata } from "next"
import { SelectorView } from "@/views/selector-view"
import { getDictionary } from "@/i18n/dictionaries"

export const metadata: Metadata = {
  title: getDictionary("en").selector.title,
  description: getDictionary("en").selector.subtitle,
}

export default function EnSelectorPage() {
  return <SelectorView locale="en" />
}

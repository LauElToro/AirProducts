import type { Metadata } from "next"
import { ProductsView } from "@/views/products-view"
import { getDictionary } from "@/i18n/dictionaries"

export const metadata: Metadata = {
  title: getDictionary("en").products.pageTitle,
  description: getDictionary("en").products.pageDescription,
}

export default function EnProductsPage() {
  return <ProductsView locale="en" />
}

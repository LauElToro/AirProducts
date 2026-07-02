import type { Metadata } from "next"
import { ProductsView } from "@/views/products-view"
import { getDictionary } from "@/i18n/dictionaries"

export const metadata: Metadata = {
  title: getDictionary("es").products.pageTitle,
  description: getDictionary("es").products.pageDescription,
}

export default function ProductosPage() {
  return <ProductsView locale="es" />
}

import type { Metadata } from "next"
import { ProductDetailView } from "@/views/product-detail-view"
import { getProductBySlug, productSlugs } from "@/data/products"
import { getDictionary } from "@/i18n/dictionaries"

type PageProps = {
  params: Promise<{ slug: string }>
}

export const generateStaticParams = () => productSlugs.map((slug) => ({ slug }))

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { slug } = await params
  const product = getProductBySlug(slug)
  const dict = getDictionary("es")
  if (!product) return { title: "Producto no encontrado" }

  return {
    title: `Compresor ${product.name}`,
    description: `${dict.products.category}. ${product.flowMin}–${product.flowMax} m³/h, ${product.pressureBar} bar.`,
    openGraph: { images: [{ url: product.image, alt: `Compresor ${product.name}` }] },
  }
}

export default async function ProductoDetailPage({ params }: PageProps) {
  const { slug } = await params
  return <ProductDetailView locale="es" slug={slug} />
}

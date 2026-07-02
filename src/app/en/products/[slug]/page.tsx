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
  const dict = getDictionary("en")
  if (!product) return { title: "Product not found" }

  return {
    title: `Compressor ${product.name}`,
    description: `${dict.products.category}. ${product.flowMin}–${product.flowMax} m³/h, ${product.pressureBar} bar.`,
    openGraph: { images: [{ url: product.image, alt: `Compressor ${product.name}` }] },
  }
}

export default async function EnProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  return <ProductDetailView locale="en" slug={slug} />
}

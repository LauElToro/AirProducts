import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PageLayout } from "@/components/layout/page-layout"
import { getProductBySlug } from "@/data/products"
import type { Locale } from "@/i18n/config"
import { getProductPath, routeMap } from "@/i18n/config"
import { getDictionary } from "@/i18n/dictionaries"

type ProductDetailViewProps = {
  locale: Locale
  slug: string
}

export const ProductDetailView = ({ locale, slug }: ProductDetailViewProps) => {
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const dict = getDictionary(locale)
  const routes = routeMap[locale]
  const features = dict.productFeatures[slug] ?? []

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Booster ${product.name}`,
    description: features.join(". "),
    brand: { "@type": "Brand", name: "Air Products SRL" },
    manufacturer: { "@type": "Organization", name: "Air Products SRL" },
    image: `https://www.airproducts.com.ar${product.image}`,
  }

  return (
    <PageLayout locale={locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <section className="bg-gradient-to-b from-slate-50 to-white py-10 sm:py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <Link
            href={routes.products}
            className="text-sm text-[#0096D6] hover:underline"
            tabIndex={0}
          >
            {dict.products.backToProducts}
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl md:text-5xl">
            Booster {product.name}
          </h1>
          <p className="mt-2 text-base text-slate-600 sm:text-lg">
            {dict.products.category} · {product.pressureBar} bar · {product.stages}{" "}
            {dict.products.stages}
          </p>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-2 md:gap-12 md:px-6">
          <div className="relative min-h-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 sm:min-h-[360px] md:aspect-square md:min-h-0">
            <Image
              src={product.image}
              alt={`Booster ${product.name}`}
              fill
              className="object-contain p-4 sm:p-6 md:p-8"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              {dict.products.specifications}
            </h2>
            <dl className="mt-4 space-y-3">
              <div className="flex justify-between gap-4 border-b border-slate-100 py-2 text-sm sm:text-base">
                <dt className="text-slate-600">{dict.products.capacity}</dt>
                <dd className="text-right font-semibold text-slate-900">
                  {product.flowMin}–{product.flowMax} m³/h
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-100 py-2 text-sm sm:text-base">
                <dt className="text-slate-600">{dict.products.cylindersDay}</dt>
                <dd className="text-right font-semibold text-slate-900">
                  {product.cylindersMin}–{product.cylindersMax}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-100 py-2 text-sm sm:text-base">
                <dt className="text-slate-600">{dict.products.finalPressure}</dt>
                <dd className="text-right font-semibold text-slate-900">{product.pressureBar} bar</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-100 py-2 text-sm sm:text-base">
                <dt className="text-slate-600">{dict.products.stages}</dt>
                <dd className="text-right font-semibold text-slate-900">{product.stages}</dd>
              </div>
            </dl>

            <h2 className="mt-6 text-lg font-bold text-slate-900 sm:mt-8 sm:text-xl">
              {dict.products.features}
            </h2>
            <ul className="mt-4 space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-slate-600 sm:text-base">
                  <span className="mt-0.5 shrink-0 text-[#0096D6]" aria-hidden="true">
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
              {product.pdfUrl && (
                <a
                  href={product.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#0096D6] hover:text-[#0096D6] sm:px-6"
                >
                  {dict.products.downloadPdf}
                </a>
              )}
              <Link
                href={routes.contact}
                className="rounded-xl bg-[#0096D6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#007bb5] sm:px-6"
                tabIndex={0}
              >
                {dict.products.requestQuote}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

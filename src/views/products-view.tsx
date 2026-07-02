import Image from "next/image"
import Link from "next/link"
import { PageLayout } from "@/components/layout/page-layout"
import { oxProducts } from "@/data/products"
import type { Locale } from "@/i18n/config"
import { getProductPath } from "@/i18n/config"
import { getDictionary } from "@/i18n/dictionaries"

export const ProductsView = ({ locale }: { locale: Locale }) => {
  const dict = getDictionary(locale)

  return (
    <PageLayout locale={locale}>
      <section className="bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <p className="text-xs font-semibold tracking-widest text-[#0096D6] uppercase sm:text-sm">
            {dict.products.pageSubtitle}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl md:text-5xl">
            {dict.products.pageTitle}
          </h1>
          <p className="mt-4 max-w-3xl text-base text-slate-600 sm:text-lg">
            {dict.products.pageDescription}
          </p>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {oxProducts.map((product) => (
              <Link
                key={product.slug}
                href={getProductPath(locale, product.slug)}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
                tabIndex={0}
              >
                <div className="relative aspect-[5/4] bg-slate-50 sm:aspect-[4/3]">
                  <Image
                    src={product.image}
                    alt={`${product.name} booster`}
                    fill
                    className="object-contain p-3 transition group-hover:scale-105 sm:p-4"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{product.name}</h2>
                  <ul className="mt-3 space-y-1 text-xs text-slate-600 sm:text-sm">
                    <li>
                      {product.flowMin}–{product.flowMax} m³/h
                    </li>
                    <li>
                      {product.pressureBar} bar · {product.stages} {dict.products.stages}
                    </li>
                    <li>
                      {product.cylindersMin}–{product.cylindersMax}{" "}
                      {locale === "es" ? "cilindros/día" : "cylinders/day"}
                    </li>
                  </ul>
                  <span className="mt-4 inline-block text-sm font-semibold text-[#0096D6] group-hover:underline">
                    {dict.products.viewSpecs}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

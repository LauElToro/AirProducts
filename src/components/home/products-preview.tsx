"use client"

import Image from "next/image"
import Link from "next/link"
import { oxProducts } from "@/data/products"
import { getProductPath, routeMap } from "@/i18n/config"
import { useLocale } from "@/i18n/locale-context"

export const ProductsPreview = () => {
  const { locale, dict } = useLocale()
  const routes = routeMap[locale]
  const featured = oxProducts.slice(0, 6)

  return (
    <section className="bg-slate-50 py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:mb-10 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold tracking-widest text-[#0096D6] uppercase sm:text-sm">
              {dict.products.series}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
              {dict.products.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              {dict.products.description}
            </p>
          </div>
          <Link
            href={routes.products}
            className="text-sm font-semibold text-[#0096D6] hover:underline"
            tabIndex={0}
            aria-label={dict.products.viewAll}
          >
            {dict.products.viewAll}
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {featured.map((product) => (
            <Link
              key={product.slug}
              href={getProductPath(locale, product.slug)}
              className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
              tabIndex={0}
              aria-label={`${dict.products.viewProduct} ${product.name}`}
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
              <div className="p-3 sm:p-4">
                <h3 className="text-base font-bold text-slate-900 sm:text-lg">{product.name}</h3>
                <p className="mt-1 text-xs text-slate-600 sm:text-sm">
                  {product.flowMin}–{product.flowMax} m³/h · {product.pressureBar} bar ·{" "}
                  {product.stages} {dict.products.stages}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

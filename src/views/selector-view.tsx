import { PageLayout } from "@/components/layout/page-layout"
import { CompressorSelector } from "@/components/products/compressor-selector"
import type { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/dictionaries"

export const SelectorView = ({ locale }: { locale: Locale }) => {
  const dict = getDictionary(locale)

  return (
    <PageLayout locale={locale}>
      <section className="bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <p className="text-xs font-semibold tracking-widest text-[#0096D6] uppercase sm:text-sm">
            {dict.selector.label}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl md:text-5xl">
            {dict.selector.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">{dict.selector.subtitle}</p>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <CompressorSelector />
        </div>
      </section>
    </PageLayout>
  )
}

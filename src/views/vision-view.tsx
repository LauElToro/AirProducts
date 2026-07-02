import { PageLayout } from "@/components/layout/page-layout"
import type { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/dictionaries"

export const VisionView = ({ locale }: { locale: Locale }) => {
  const dict = getDictionary(locale)
  const values = Object.values(dict.values)

  return (
    <PageLayout locale={locale}>
      <section className="bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <p className="text-xs font-semibold tracking-widest text-[#0096D6] uppercase sm:text-sm">
            {dict.vision.label}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl md:text-5xl">
            {dict.vision.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base text-slate-600 sm:text-lg">{dict.vision.subtitle}</p>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:grid-cols-2 sm:gap-6 md:px-6">
          {values.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
            >
              <h2 className="text-base font-bold text-slate-900 sm:text-lg">{item.title}</h2>
              <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </PageLayout>
  )
}

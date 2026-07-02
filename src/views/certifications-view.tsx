import { PageLayout } from "@/components/layout/page-layout"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"
import {
  certificationBadges,
  electricalStandards,
  mainCertifications,
  normalizationStandards,
  safetyStandards,
} from "@/data/certifications"
import type { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/dictionaries"

const StandardList = ({ title, items }: { title: string; items: string[] }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
    <h2 className="mb-4 text-base font-bold text-slate-900 sm:text-lg">{title}</h2>
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-xs text-slate-600 sm:text-sm">
          <span className="mt-0.5 text-[#0096D6]" aria-hidden="true">
            •
          </span>
          {item}
        </li>
      ))}
    </ul>
  </div>
)

export const CertificationsView = ({ locale }: { locale: Locale }) => {
  const dict = getDictionary(locale)

  return (
    <PageLayout locale={locale}>
      <section className="bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <p className="text-xs font-semibold tracking-widest text-[#0096D6] uppercase sm:text-sm">
            {locale === "es" ? "Calidad" : "Quality"}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl md:text-5xl">
            {dict.certifications.pageTitle}
          </h1>
          <p className="mt-4 max-w-3xl text-base text-slate-600 sm:text-lg">
            {dict.certifications.pageSubtitle}
          </p>
        </div>
      </section>

      <section className="pb-8">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <InfiniteMovingCards items={certificationBadges} />
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl space-y-4 px-4 sm:space-y-6 md:px-6">
          <StandardList title={dict.certifications.main} items={mainCertifications} />
          <StandardList title={dict.certifications.safety} items={safetyStandards} />
          <StandardList title={dict.certifications.electrical} items={electricalStandards} />
          <StandardList title={dict.certifications.normalization} items={normalizationStandards} />
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
            <h2 className="mb-3 text-base font-bold text-slate-900 sm:text-lg">
              {dict.certifications.sectorNote}
            </h2>
            <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
              {dict.certifications.sectorDescription}
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

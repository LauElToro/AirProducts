"use client"

import Link from "next/link"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards"
import { certificationBadges } from "@/data/certifications"
import { routeMap } from "@/i18n/config"
import { useLocale } from "@/i18n/locale-context"

export const CertificationsPreview = () => {
  const { locale, dict } = useLocale()
  const routes = routeMap[locale]

  return (
    <section className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-6 text-center sm:mb-8">
          <p className="text-xs font-semibold tracking-widest text-[#0096D6] uppercase sm:text-sm">
            {dict.certifications.label}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
            {dict.certifications.title}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
            {dict.certifications.subtitle}
          </p>
        </div>

        <InfiniteMovingCards items={certificationBadges} />

        <div className="mt-8 text-center">
          <Link
            href={routes.certifications}
            className="text-sm font-semibold text-[#0096D6] hover:underline"
            tabIndex={0}
          >
            {dict.certifications.viewAll}
          </Link>
        </div>
      </div>
    </section>
  )
}

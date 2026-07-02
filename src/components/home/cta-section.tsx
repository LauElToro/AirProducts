"use client"

import Link from "next/link"
import { ResponsiveImage } from "@/components/ui/responsive-image"
import { routeMap } from "@/i18n/config"
import { useLocale } from "@/i18n/locale-context"

export const CtaSection = () => {
  const { locale, dict } = useLocale()
  const routes = routeMap[locale]

  return (
    <section className="bg-white py-12 sm:py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 md:grid-cols-2 md:gap-10 md:px-6">
        <ResponsiveImage
          src="/img/maquina.png"
          alt={dict.cta.imageAlt}
          aspectRatio="wide"
          fit="contain"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div>
          <p className="text-xs font-semibold tracking-widest text-[#0096D6] uppercase sm:text-sm">
            {dict.cta.label}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
            {dict.cta.title}
          </h2>
          <p className="mt-4 text-sm text-slate-600 sm:text-base">{dict.cta.description}</p>
          <div className="mt-6 flex flex-wrap gap-3 sm:gap-4">
            <Link
              href={routes.selector}
              className="rounded-xl bg-[#0096D6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#007bb5] sm:px-6"
              tabIndex={0}
            >
              {dict.cta.selectCompressor}
            </Link>
            <Link
              href={routes.about}
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#0096D6] hover:text-[#0096D6] sm:px-6"
              tabIndex={0}
            >
              {dict.cta.ourHistory}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

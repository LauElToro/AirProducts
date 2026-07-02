"use client"

import Link from "next/link"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { MovingBorder } from "@/components/ui/moving-border"
import { TextGenerateEffect } from "@/components/ui/text-generate-effect"
import { ResponsiveImage } from "@/components/ui/responsive-image"
import { routeMap } from "@/i18n/config"
import { useLocale } from "@/i18n/locale-context"

export const Hero = () => {
  const { locale, dict } = useLocale()
  const routes = routeMap[locale]

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      <BackgroundBeams />
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:py-16 md:grid-cols-2 md:gap-10 md:px-6 md:py-20 lg:py-24">
        <div className="order-2 md:order-1">
          <p className="mb-4 text-xs font-semibold tracking-widest text-[#0096D6] uppercase sm:text-sm">
            {dict.hero.badge}
          </p>
          <TextGenerateEffect
            words={dict.hero.title}
            className="text-2xl leading-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl"
          />
          <p className="mt-4 max-w-lg text-sm text-slate-600 sm:mt-6 sm:text-base md:text-lg">
            {dict.hero.subtitle}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
            <MovingBorder
              as="a"
              href={routes.products}
              containerClassName="w-full sm:w-auto"
              className="w-full bg-[#0096D6] px-5 py-3 text-white border-[#0096D6] sm:px-6"
              ariaLabel={dict.hero.ctaProducts}
            >
              {dict.hero.ctaProducts}
            </MovingBorder>
            <Link
              href={routes.contact}
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#0096D6] hover:text-[#0096D6] sm:w-auto sm:px-6"
              tabIndex={0}
              aria-label={dict.hero.ctaExport}
            >
              {dict.hero.ctaExport}
            </Link>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <ResponsiveImage
            src="/img/solution.jpg"
            alt={dict.hero.imageAlt}
            aspectRatio="auto"
            fit="contain"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            containerClassName="shadow-xl"
          />
        </div>
      </div>
    </section>
  )
}

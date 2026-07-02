"use client"

import Link from "next/link"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { EngineeringCardImage } from "@/components/ui/engineering-card-image"
import { engineeringComponents } from "@/data/engineering"
import { routeMap } from "@/i18n/config"
import { useLocale } from "@/i18n/locale-context"

export const EngineeringPreview = () => {
  const { locale, dict } = useLocale()
  const routes = routeMap[locale]

  return (
    <section className="bg-white py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-8 sm:mb-10">
          <p className="text-xs font-semibold tracking-widest text-[#0096D6] uppercase sm:text-sm">
            {dict.engineering.label}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
            {dict.engineering.title}
          </h2>
        </div>

        <BentoGrid>
          {dict.engineeringItems.slice(0, 4).map((item, index) => (
            <BentoGridItem
              key={engineeringComponents[index].id}
              title={item.title}
              description={`${item.description.slice(0, 120)}...`}
              className={index === 0 || index === 3 ? "md:col-span-2" : ""}
              header={
                <EngineeringCardImage
                  src={engineeringComponents[index].image}
                  alt={item.title}
                  featured={index === 0}
                />
              }
            />
          ))}
        </BentoGrid>

        <div className="mt-8 text-center">
          <Link
            href={routes.engineering}
            className="text-sm font-semibold text-[#0096D6] hover:underline"
            tabIndex={0}
          >
            {dict.engineering.viewAll}
          </Link>
        </div>
      </div>
    </section>
  )
}

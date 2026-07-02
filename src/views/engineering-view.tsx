import Image from "next/image"
import Link from "next/link"
import { PageLayout } from "@/components/layout/page-layout"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { engineeringComponents } from "@/data/engineering"
import type { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/dictionaries"

export const EngineeringView = ({ locale }: { locale: Locale }) => {
  const dict = getDictionary(locale)

  return (
    <PageLayout locale={locale}>
      <section className="bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <p className="text-xs font-semibold tracking-widest text-[#0096D6] uppercase sm:text-sm">
            {dict.engineering.subtitle}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl md:text-5xl">
            {dict.engineering.pageTitle}
          </h1>
          <p className="mt-4 max-w-3xl text-base text-slate-600 sm:text-lg">
            {dict.engineering.pageSubtitle}
          </p>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <BentoGrid>
            {dict.engineeringItems.map((item, index) => (
              <BentoGridItem
                key={engineeringComponents[index].id}
                title={item.title}
                description={item.description}
                className={index === 0 ? "md:col-span-2 md:row-span-2" : ""}
                header={
                  <div
                    className={`relative mb-4 w-full overflow-hidden rounded-lg ${
                      index === 0 ? "h-48 sm:h-64" : "h-36 sm:h-40"
                    }`}
                  >
                    <Image
                      src={engineeringComponents[index].image}
                      alt={item.title}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                }
              />
            ))}
          </BentoGrid>
        </div>
      </section>
    </PageLayout>
  )
}

import { PageLayout } from "@/components/layout/page-layout"
import { Timeline } from "@/components/ui/timeline"
import { ResponsiveImage } from "@/components/ui/responsive-image"
import { companyInfo } from "@/data/company"
import type { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/dictionaries"

export const AboutView = ({ locale }: { locale: Locale }) => {
  const dict = getDictionary(locale)

  const timelineEvents = [
    { year: "1992", ...dict.timeline.y1992 },
    { year: "2000s", ...dict.timeline.y2000s },
    { year: "2010s", ...dict.timeline.y2010s },
    { year: locale === "es" ? "Hoy" : "Today", ...dict.timeline.today },
  ]

  return (
    <PageLayout locale={locale}>
      <section className="bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <p className="text-xs font-semibold tracking-widest text-[#0096D6] uppercase sm:text-sm">
            {dict.about.label}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl md:text-5xl">
            {dict.about.title}
          </h1>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            {dict.about.facility} {companyInfo.facilitySize} · {companyInfo.location}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl items-start gap-8 px-4 md:grid-cols-2 md:gap-12 md:px-6">
          <div className="space-y-4">
            {dict.aboutParagraphs.map((paragraph, index) => (
              <p key={index} className="text-sm leading-relaxed text-slate-600 sm:text-base">
                {paragraph}
              </p>
            ))}
          </div>
          <ResponsiveImage
            src="/img/about.jpg"
            alt={dict.about.imageAlt}
            aspectRatio="wide"
            fit="cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            containerClassName="shadow-lg"
          />
        </div>
      </section>

      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="mb-6 text-2xl font-bold text-slate-900 sm:mb-8 sm:text-3xl">
            {dict.about.trajectory}
          </h2>
          <Timeline data={timelineEvents} />
        </div>
      </section>
    </PageLayout>
  )
}

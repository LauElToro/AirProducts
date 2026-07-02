import { PageLayout } from "@/components/layout/page-layout"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactMap } from "@/components/contact/contact-map"
import { companyInfo } from "@/data/company"
import type { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/dictionaries"

export const ContactView = ({ locale }: { locale: Locale }) => {
  const dict = getDictionary(locale)

  return (
    <PageLayout locale={locale}>
      <section className="bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <p className="text-xs font-semibold tracking-widest text-[#0096D6] uppercase sm:text-sm">
            {dict.contact.label}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl md:text-5xl">
            {dict.contact.title}
          </h1>
        </div>
      </section>

      <section className="pb-16 sm:pb-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-2 md:gap-12 md:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{dict.contact.office}</h2>
            <address className="mt-4 not-italic text-sm text-slate-600 sm:text-base">
              <p>{companyInfo.location}</p>
              <p className="mt-1">Buenos Aires, Argentina</p>
            </address>

            <div className="mt-6">
              <h3 className="text-sm font-semibold tracking-wide text-slate-900 uppercase">
                {dict.contact.email}
              </h3>
              <a
                href={`mailto:${companyInfo.email}`}
                className="mt-1 block text-sm text-[#0096D6] hover:underline sm:text-base"
              >
                {companyInfo.email}
              </a>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold tracking-wide text-slate-900 uppercase">
                {dict.contact.phones}
              </h3>
              {companyInfo.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="mt-1 block text-sm text-slate-600 hover:text-[#0096D6] sm:text-base"
                >
                  {phone}
                </a>
              ))}
            </div>

            <ContactMap
              openInMapsLabel={
                locale === "es" ? "Abrir en Google Maps" : "Open in Google Maps"
              }
            />
          </div>

          <div>
            <h2 className="mb-4 text-lg font-bold text-slate-900 sm:mb-6 sm:text-xl">
              {dict.contact.formTitle}
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </PageLayout>
  )
}

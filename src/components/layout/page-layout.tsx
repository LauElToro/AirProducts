import type { Metadata } from "next"
import { companyInfo } from "@/data/company"
import type { Locale } from "@/i18n/config"
import { getDictionary } from "@/i18n/dictionaries"
import { LocaleProvider } from "@/i18n/locale-context"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

export const getSiteMetadata = (locale: Locale): Metadata => {
  const dict = getDictionary(locale)
  const baseUrl = "https://www.airproducts.com.ar"

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: dict.meta.title,
      template: `%s | Air Products SRL`,
    },
    description: dict.meta.description,
    keywords: locale === "es"
      ? ["compresor oxígeno", "booster alta presión", "libre de aceite", "Air Products SRL", "serie OX", "exportación"]
      : ["oxygen compressor", "oil-free booster", "high pressure compressor", "Air Products SRL", "OX series", "Argentina export"],
    alternates: {
      canonical: locale === "es" ? baseUrl : `${baseUrl}/en`,
      languages: {
        "es-AR": baseUrl,
        en: `${baseUrl}/en`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "es" ? "es_AR" : "en_US",
      url: locale === "es" ? baseUrl : `${baseUrl}/en`,
      siteName: "Air Products SRL",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [{ url: "/img/solution.jpg", width: 1200, height: 800, alt: "Air Products SRL" }],
    },
    robots: { index: true, follow: true },
    authors: [{ name: companyInfo.name }],
  }
}

export const siteMetadata = getSiteMetadata("es")

const JsonLd = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: companyInfo.name,
    url: "https://www.airproducts.com.ar",
    logo: "https://www.airproducts.com.ar/img/logo.png",
    foundingDate: "1992",
    email: companyInfo.email,
    telephone: companyInfo.phones[0],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Laprida 631",
      addressLocality: "Avellaneda",
      addressRegion: "Buenos Aires",
      addressCountry: "AR",
    },
    description: "Manufacturer of oil-free booster compressors for oxygen and industrial gases.",
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

type PageLayoutProps = {
  locale: Locale
  children: React.ReactNode
}

export const PageLayout = ({ locale, children }: PageLayoutProps) => {
  const dict = getDictionary(locale)

  return (
    <>
      <JsonLd />
      <LocaleProvider locale={locale} dict={dict}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </LocaleProvider>
    </>
  )
}

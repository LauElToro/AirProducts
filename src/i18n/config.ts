export const locales = ["es", "en"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "es"

export const localeNames: Record<Locale, string> = {
  es: "ES",
  en: "EN",
}

export const routeMap = {
  es: {
    home: "/",
    about: "/sobre-nosotros",
    vision: "/vision",
    products: "/productos",
    engineering: "/ingenieria",
    certifications: "/certificaciones",
    selector: "/seleccionar-compresor",
    contact: "/contacto",
  },
  en: {
    home: "/en",
    about: "/en/about",
    vision: "/en/vision",
    products: "/en/products",
    engineering: "/en/engineering",
    certifications: "/en/certifications",
    selector: "/en/select-compressor",
    contact: "/en/contact",
  },
} as const

export const getProductPath = (locale: Locale, slug: string) =>
  locale === "es" ? `/productos/${slug}` : `/en/products/${slug}`

export const switchLocalePath = (pathname: string, target: Locale): string => {
  const enToEs: Record<string, string> = {
    "/en": "/",
    "/en/about": "/sobre-nosotros",
    "/en/vision": "/vision",
    "/en/products": "/productos",
    "/en/engineering": "/ingenieria",
    "/en/certifications": "/certificaciones",
    "/en/select-compressor": "/seleccionar-compresor",
    "/en/contact": "/contacto",
  }

  const esToEn: Record<string, string> = Object.fromEntries(
    Object.entries(enToEs).map(([en, es]) => [es, en])
  )

  if (pathname.startsWith("/en/products/")) {
    const slug = pathname.replace("/en/products/", "")
    return target === "es" ? `/productos/${slug}` : pathname
  }

  if (pathname.startsWith("/productos/")) {
    const slug = pathname.replace("/productos/", "")
    return target === "en" ? `/en/products/${slug}` : pathname
  }

  if (target === "en") {
    return esToEn[pathname] ?? "/en"
  }

  return enToEs[pathname] ?? "/"
}

export const getLocaleFromPath = (pathname: string): Locale =>
  pathname.startsWith("/en") ? "en" : "es"

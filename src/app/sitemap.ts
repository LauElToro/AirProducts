import type { MetadataRoute } from "next"
import { productSlugs } from "@/data/products"

const baseUrl = "https://www.airproducts.com.ar"

const staticRoutes = [
  { es: "", en: "/en" },
  { es: "/sobre-nosotros", en: "/en/about" },
  { es: "/vision", en: "/en/vision" },
  { es: "/productos", en: "/en/products" },
  { es: "/ingenieria", en: "/en/engineering" },
  { es: "/certificaciones", en: "/en/certifications" },
  { es: "/seleccionar-compresor", en: "/en/select-compressor" },
  { es: "/contacto", en: "/en/contact" },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  staticRoutes.forEach((route) => {
    entries.push({
      url: `${baseUrl}${route.es}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: route.es === "" ? 1 : 0.8,
      alternates: {
        languages: {
          "es-AR": `${baseUrl}${route.es}`,
          en: `${baseUrl}${route.en}`,
        },
      },
    })
    entries.push({
      url: `${baseUrl}${route.en}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: route.en === "/en" ? 0.9 : 0.8,
      alternates: {
        languages: {
          "es-AR": `${baseUrl}${route.es}`,
          en: `${baseUrl}${route.en}`,
        },
      },
    })
  })

  productSlugs.forEach((slug) => {
    entries.push({
      url: `${baseUrl}/productos/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          "es-AR": `${baseUrl}/productos/${slug}`,
          en: `${baseUrl}/en/products/${slug}`,
        },
      },
    })
    entries.push({
      url: `${baseUrl}/en/products/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          "es-AR": `${baseUrl}/productos/${slug}`,
          en: `${baseUrl}/en/products/${slug}`,
        },
      },
    })
  })

  return entries
}

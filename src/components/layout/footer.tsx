"use client"

import Link from "next/link"
import { companyInfo } from "@/data/company"
import { routeMap } from "@/i18n/config"
import { useLocale } from "@/i18n/locale-context"

export const Footer = () => {
  const { locale, dict } = useLocale()
  const routes = routeMap[locale]

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-3 md:px-6">
        <div>
          <h2 className="mb-3 text-lg font-bold text-slate-900">{dict.footer.stayInTouch}</h2>
          <p className="text-sm text-slate-600">{companyInfo.location}</p>
          <p className="mt-1 text-sm text-slate-600">Buenos Aires - Argentina</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-slate-900 uppercase">
            {dict.footer.contact}
          </h3>
          <a
            href={`mailto:${companyInfo.email}`}
            className="block text-sm text-[#0096D6] hover:underline"
            aria-label={`Email ${companyInfo.email}`}
          >
            {companyInfo.email}
          </a>
          {companyInfo.phones.map((phone) => (
            <a
              key={phone}
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="mt-1 block text-sm text-slate-600 hover:text-[#0096D6]"
              aria-label={`Phone ${phone}`}
            >
              {phone}
            </a>
          ))}
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold tracking-wide text-slate-900 uppercase">
            {dict.footer.links}
          </h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href={routes.products} className="text-slate-600 hover:text-[#0096D6]">
                {dict.nav.products}
              </Link>
            </li>
            <li>
              <Link href={routes.certifications} className="text-slate-600 hover:text-[#0096D6]">
                {dict.nav.certifications}
              </Link>
            </li>
            <li>
              <Link href={routes.contact} className="text-slate-600 hover:text-[#0096D6]">
                {dict.nav.contact}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 py-4 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} {companyInfo.name} {dict.footer.rights}
      </div>
    </footer>
  )
}

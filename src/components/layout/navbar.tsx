"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { routeMap, switchLocalePath, localeNames, type Locale } from "@/i18n/config"
import { useLocale } from "@/i18n/locale-context"

export const Navbar = () => {
  const pathname = usePathname()
  const { locale, dict } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const routes = routeMap[locale]

  const navLinks = [
    { href: routes.home, label: dict.nav.home },
    { href: routes.about, label: dict.nav.about },
    { href: routes.vision, label: dict.nav.vision },
    { href: routes.products, label: dict.nav.products },
    { href: routes.engineering, label: dict.nav.engineering },
    { href: routes.certifications, label: dict.nav.certifications },
    { href: routes.selector, label: dict.nav.selector },
    { href: routes.contact, label: dict.nav.contact },
  ]

  const handleToggle = () => setIsOpen((prev) => !prev)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleToggle()
    }
  }

  const isActive = (href: string) => {
    if (href === routes.home) return pathname === href
    return pathname.startsWith(href)
  }

  const otherLocale: Locale = locale === "es" ? "en" : "es"

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 md:px-6"
        aria-label={locale === "es" ? "Navegación principal" : "Main navigation"}
      >
        <Link
          href={routes.home}
          className="flex shrink-0 items-center gap-3"
          aria-label="Air Products SRL - Home"
        >
          <Image
            src="/img/logo.png"
            alt="Air Products SRL"
            width={140}
            height={48}
            className="h-9 w-auto sm:h-10"
            priority
          />
        </Link>

        <ul className="hidden items-center gap-0.5 lg:flex xl:gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "rounded-lg px-2 py-2 text-xs font-medium transition-colors xl:px-3 xl:text-sm",
                  isActive(link.href)
                    ? "bg-[#0096D6]/10 text-[#0096D6]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 p-0.5 text-xs font-semibold">
            {(["es", "en"] as const).map((loc) => (
              <Link
                key={loc}
                href={switchLocalePath(pathname, loc)}
                className={cn(
                  "rounded-md px-2.5 py-1 transition",
                  locale === loc
                    ? "bg-[#0096D6] text-white"
                    : "text-slate-500 hover:text-slate-900"
                )}
                aria-label={loc === "es" ? "Español" : "English"}
              >
                {localeNames[loc]}
              </Link>
            ))}
          </div>

          <Link
            href={routes.contact}
            className="hidden rounded-lg bg-[#0096D6] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#007bb5] sm:inline-block xl:px-4 xl:text-sm"
          >
            {dict.nav.quote}
          </Link>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            onClick={handleToggle}
            onKeyDown={handleKeyDown}
            aria-expanded={isOpen}
            aria-label={isOpen ? dict.nav.closeMenu : dict.nav.openMenu}
            tabIndex={0}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm font-medium",
                    isActive(link.href)
                      ? "bg-[#0096D6]/10 text-[#0096D6]"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={routes.contact}
                onClick={() => setIsOpen(false)}
                className="mt-2 block rounded-lg bg-[#0096D6] px-3 py-2 text-center text-sm font-semibold text-white"
              >
                {dict.nav.quote}
              </Link>
            </li>
            <li className="mt-2 border-t border-slate-100 pt-2">
              <Link
                href={switchLocalePath(pathname, otherLocale)}
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                {otherLocale === "en" ? "English" : "Español"}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}

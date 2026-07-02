"use client"

import { createContext, useContext } from "react"
import type { Dictionary } from "@/i18n/dictionaries"
import type { Locale } from "@/i18n/config"

type LocaleContextType = {
  locale: Locale
  dict: Dictionary
}

const LocaleContext = createContext<LocaleContextType | null>(null)

export const LocaleProvider = ({
  locale,
  dict,
  children,
}: LocaleContextType & { children: React.ReactNode }) => (
  <LocaleContext.Provider value={{ locale, dict }}>{children}</LocaleContext.Provider>
)

export const useLocale = () => {
  const context = useContext(LocaleContext)
  if (!context) throw new Error("useLocale must be used within LocaleProvider")
  return context
}

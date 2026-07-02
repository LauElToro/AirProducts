"use client"

import { useState } from "react"
import { companyInfo } from "@/data/company"
import { useLocale } from "@/i18n/locale-context"

export const ContactForm = () => {
  const { dict } = useLocale()
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const nombre = data.get("nombre") as string
    const email = data.get("email") as string
    const asunto = data.get("asunto") as string
    const mensaje = data.get("mensaje") as string

    const body = encodeURIComponent(`Name: ${nombre}\nEmail: ${email}\n\n${mensaje}`)
    const subject = encodeURIComponent(asunto)
    window.location.href = `mailto:${companyInfo.email}?subject=${subject}&body=${body}`
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="font-semibold text-green-800">{dict.contact.thanks}</p>
        <p className="mt-2 text-sm text-green-700">
          {dict.contact.thanksNote}{" "}
          <a href={`mailto:${companyInfo.email}`} className="underline">
            {companyInfo.email}
          </a>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-slate-700">
          {dict.contact.name}
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-[#0096D6] focus:outline-none focus:ring-1 focus:ring-[#0096D6]"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          {dict.contact.emailField}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-[#0096D6] focus:outline-none focus:ring-1 focus:ring-[#0096D6]"
        />
      </div>
      <div>
        <label htmlFor="asunto" className="block text-sm font-medium text-slate-700">
          {dict.contact.subject}
        </label>
        <input
          id="asunto"
          name="asunto"
          type="text"
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-[#0096D6] focus:outline-none focus:ring-1 focus:ring-[#0096D6]"
        />
      </div>
      <div>
        <label htmlFor="mensaje" className="block text-sm font-medium text-slate-700">
          {dict.contact.message}
        </label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={5}
          required
          className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-[#0096D6] focus:outline-none focus:ring-1 focus:ring-[#0096D6]"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-xl bg-[#0096D6] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#007bb5]"
      >
        {dict.contact.send}
      </button>
    </form>
  )
}

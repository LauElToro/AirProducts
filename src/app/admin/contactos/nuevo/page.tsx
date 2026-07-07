"use client"

import { AdminShell } from "@/components/admin/admin-shell"
import { ContactForm } from "@/components/admin/contact-form"

export default function NuevoContactoPage() {
  return (
    <AdminShell title="Nuevo contacto" subtitle="Complete los datos del cliente o lead">
      <ContactForm title="Agregar contacto" />
    </AdminShell>
  )
}

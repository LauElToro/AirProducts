import { Suspense } from "react"
import ContactosContent from "./contactos-content"

export default function AdminContactosPage() {
  return (
    <Suspense fallback={<p className="p-8 text-xl text-slate-500">Cargando contactos...</p>}>
      <ContactosContent />
    </Suspense>
  )
}

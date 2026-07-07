import { Suspense } from "react"
import AdminEmailsContent from "./emails-content"

export default function AdminEmailsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-xl text-slate-500">Cargando...</div>}>
      <AdminEmailsContent />
    </Suspense>
  )
}

import { Suspense } from "react"
import AdminLoginForm from "./login-form"

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-xl">Cargando...</div>}>
      <AdminLoginForm />
    </Suspense>
  )
}

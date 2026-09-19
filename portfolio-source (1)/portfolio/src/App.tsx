import { useEffect } from "react"
import { Toaster } from "@/components/ui/sonner"
import { PublicSite } from "@/components/site/public-site"
import { AdminLogin } from "@/components/admin/login"
import { AdminDashboard } from "@/components/admin/dashboard"
import { profile } from "@/data/profile"
import { useAuth } from "@/lib/auth"
import { useRoute } from "@/lib/route"

export default function App() {
  const route = useRoute()
  const authed = useAuth()
  const isAdmin = route.startsWith("/admin")

  useEffect(() => {
    document.title = isAdmin ? `Admin · ${profile.name}` : `${profile.name} — Designer & front-end engineer`
    if (isAdmin) window.scrollTo(0, 0)
  }, [isAdmin])

  return (
    <>
      {isAdmin ? authed ? <AdminDashboard /> : <AdminLogin /> : <PublicSite />}
      <Toaster position="bottom-right" />
    </>
  )
}

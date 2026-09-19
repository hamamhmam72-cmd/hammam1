import { Lock } from "lucide-react"
import { profile } from "@/data/profile"

export function Footer() {
  return (
    <footer className="border-t border-foreground/10">
      <div className="wrap flex flex-col gap-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}. Designed and built by hand.
        </p>
        <div className="flex items-center gap-6">
          <a href="#top" className="hover:text-foreground">Back to top</a>
          <a href="#/admin" className="inline-flex items-center gap-1.5 hover:text-foreground">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" /> Admin
          </a>
        </div>
      </div>
    </footer>
  )
}

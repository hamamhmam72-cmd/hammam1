import { useState } from "react"
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Monogram } from "@/components/site/nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { DEFAULT_PASSCODE, isDefaultPasscode, login } from "@/lib/auth"

export function AdminLogin() {
  const [pass, setPass] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pass) {
      setError("Enter your passcode.")
      return
    }
    setBusy(true)
    const res = await login(pass)
    setBusy(false)
    if (!res.ok) {
      setError(res.lockedFor ? `Too many attempts. Try again in ${res.lockedFor} seconds.` : "That passcode isn't right. Check it and try again.")
      setPass("")
    }
  }

  return (
    <div className="relative grid min-h-[100dvh] place-items-center overflow-hidden px-4 py-12">
      <div aria-hidden="true" className="canvas-grid pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob left-[8%] top-[12%] h-80 w-80 bg-signal opacity-[0.25] dark:opacity-[0.2]" />
        <div className="blob bottom-[8%] right-[10%] h-64 w-64 bg-marker opacity-[0.35] dark:opacity-[0.14]" />
      </div>
      <div className="absolute right-4 top-4"><ThemeToggle /></div>

      <main className="glass relative w-full max-w-sm rounded-xl p-7 sm:p-8">
        <div className="flex items-center gap-3">
          <Monogram className="h-10 w-10" />
          <div>
            <h1 className="display text-2xl [--wdth:100]">Admin</h1>
            <p className="text-sm text-muted-foreground">Sign in to manage your projects.</p>
          </div>
        </div>

        <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="passcode" className="text-[13px] font-medium">Passcode</Label>
            <div className="relative">
              <Input
                id="passcode"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                autoFocus
                value={pass}
                onChange={(e) => { setPass(e.target.value); setError("") }}
                aria-invalid={!!error}
                aria-describedby={error ? "passcode-err" : undefined}
                className="h-11 bg-background/60 pr-11"
              />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide passcode" : "Show passcode"} className="absolute right-1 top-1 grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:text-foreground">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {error && <p id="passcode-err" role="alert" className="text-[13px] font-medium text-destructive">{error}</p>}
          </div>
          <Button type="submit" disabled={busy} className="h-11 w-full gap-2">
            <Lock className="h-4 w-4" /> {busy ? "Checking" : "Sign in"}
          </Button>
        </form>

        {isDefaultPasscode() && (
          <p className="mt-5 rounded-md border border-foreground/10 bg-background/50 p-3 text-[13px] leading-relaxed text-muted-foreground">
            First time? The starter passcode is <code className="rounded bg-foreground/10 px-1.5 py-0.5 font-mono text-foreground">{DEFAULT_PASSCODE}</code>. Change it under Settings after you sign in.
          </p>
        )}

        <a href="#/" className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to site
        </a>
      </main>
    </div>
  )
}

import { useRef, useState } from "react"
import { Copy, Download, KeyRound, RotateCcw, Upload } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { changePasscode, isDefaultPasscode } from "@/lib/auth"
import { exportProjects, importProjects, resetProjects, storageUsageKB, useProjects } from "@/lib/projects-store"

type Confirm = { kind: "reset" } | { kind: "import"; json: string; count: number } | null

export function AdminSettings() {
  const projects = useProjects()
  const fileRef = useRef<HTMLInputElement>(null)
  const [confirm, setConfirm] = useState<Confirm>(null)
  const [cur, setCur] = useState("")
  const [next, setNext] = useState("")
  const [again, setAgain] = useState("")
  const [pwError, setPwError] = useState("")
  const [, force] = useState(0)

  const savePasscode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (next.length < 6) return setPwError("Use at least 6 characters.")
    if (next !== again) return setPwError("The new passcodes don't match.")
    const ok = await changePasscode(cur, next)
    if (!ok) return setPwError("Your current passcode isn't right.")
    setCur(""); setNext(""); setAgain(""); setPwError("")
    force((n) => n + 1)
    toast.success("Passcode updated")
  }

  const download = () => {
    try {
      const blob = new Blob([exportProjects()], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `portfolio-projects-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      toast.success("Backup downloaded")
    } catch {
      toast.error("Download was blocked. Use “Copy JSON” instead.")
    }
  }

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(exportProjects())
      toast.success("Project data copied")
    } catch {
      toast.error("Couldn't copy automatically. Use “Download backup” instead.")
    }
  }

  const onImportFile = async (file?: File) => {
    if (!file) return
    try {
      const json = await file.text()
      const parsed = JSON.parse(json)
      if (!Array.isArray(parsed)) throw new Error()
      setConfirm({ kind: "import", json, count: parsed.length })
    } catch {
      toast.error("Couldn't read that file. Choose a JSON backup exported from this dashboard.")
    } finally {
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  const runConfirm = () => {
    if (!confirm) return
    if (confirm.kind === "reset") {
      resetProjects()
      toast.success("Restored the sample projects")
    } else {
      const res = importProjects(confirm.json)
      if (res.ok) toast.success(`Imported ${res.count} ${res.count === 1 ? "project" : "projects"}`)
      else toast.error("Import failed", { description: res.error })
    }
    setConfirm(null)
  }

  const kb = storageUsageKB()

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="glass rounded-xl p-6">
        <h2 className="flex items-center gap-2 font-semibold"><KeyRound className="h-4 w-4 text-signal-ink" /> Passcode</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {isDefaultPasscode() ? "You're still using the starter passcode. Set your own now." : "Change the passcode you use to sign in on this browser."}
        </p>
        <form onSubmit={savePasscode} className="mt-5 space-y-4" noValidate>
          {[
            ["pw-cur", "Current passcode", cur, setCur, "current-password"],
            ["pw-new", "New passcode", next, setNext, "new-password"],
            ["pw-again", "Repeat new passcode", again, setAgain, "new-password"],
          ].map(([id, label, val, setter, ac]) => (
            <div key={id as string} className="space-y-2">
              <Label htmlFor={id as string} className="text-[13px] font-medium">{label as string}</Label>
              <Input id={id as string} type="password" autoComplete={ac as string} value={val as string} onChange={(e) => { (setter as (v: string) => void)(e.target.value); setPwError("") }} className="h-11 bg-background/60" />
            </div>
          ))}
          {pwError && <p role="alert" className="text-[13px] font-medium text-destructive">{pwError}</p>}
          <Button type="submit" className="h-11" disabled={!cur || !next || !again}>Update passcode</Button>
        </form>
        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
          This keeps casual visitors out of the editor. It runs in the browser, so it isn't a substitute for server-side security.
        </p>
      </section>

      <div className="space-y-6">
        <section className="glass rounded-xl p-6">
          <h2 className="font-semibold">Backup & transfer</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Projects are saved in this browser only. Export a backup to move them to another device, or to bake them into the site's source so every visitor sees them.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="outline" className="h-10 gap-2 bg-transparent" onClick={download}><Download className="h-4 w-4" /> Download backup</Button>
            <Button variant="outline" className="h-10 gap-2 bg-transparent" onClick={copyJson}><Copy className="h-4 w-4" /> Copy JSON</Button>
            <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={(e) => onImportFile(e.target.files?.[0])} />
            <Button variant="outline" className="h-10 gap-2 bg-transparent" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> Import backup</Button>
          </div>
          <p className="mt-4 font-mono text-xs text-muted-foreground">{projects.length} projects · about {kb} KB of roughly 5,000 KB browser storage</p>
        </section>

        <section className="glass rounded-xl p-6">
          <h2 className="font-semibold">Start over</h2>
          <p className="mt-1 text-sm text-muted-foreground">Replace everything with the sample projects that came with the site.</p>
          <Button variant="outline" className="mt-5 h-10 gap-2 bg-transparent text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setConfirm({ kind: "reset" })}>
            <RotateCcw className="h-4 w-4" /> Restore sample projects
          </Button>
        </section>
      </div>

      <Dialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="display text-2xl [--wdth:100]">{confirm?.kind === "import" ? "Replace your projects?" : "Restore sample projects?"}</DialogTitle>
            <DialogDescription>
              {confirm?.kind === "import"
                ? `This replaces your ${projects.length} current ${projects.length === 1 ? "project" : "projects"} with the ${confirm.count} in this file. Download a backup first if you might want them back.`
                : "This removes every project you've added or edited and brings back the six samples. It can't be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="ghost" onClick={() => setConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={runConfirm}>{confirm?.kind === "import" ? "Replace projects" : "Restore samples"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

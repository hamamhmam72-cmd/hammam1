import { profile } from "@/data/profile"
import { useMemo, useState } from "react"
import { ArrowUpRight, ExternalLink, FolderPlus, LogOut, Pencil, Plus, Search, Star, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GithubIcon } from "@/components/brand-icons"
import { Monogram } from "@/components/site/nav"
import { ProjectCover } from "@/components/project-cover"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProjectForm } from "@/components/admin/project-form"
import { AdminSettings } from "@/components/admin/settings"
import { logout } from "@/lib/auth"
import { deleteProject, restoreProject, useProjects } from "@/lib/projects-store"
import type { Project } from "@/lib/types"

const fmt = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" })

export function AdminDashboard() {
  const projects = useProjects()
  const [query, setQuery] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null)

  const categories = useMemo(() => Array.from(new Set(projects.map((p) => p.category.trim()).filter(Boolean))), [projects])
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return projects
    return projects.filter((p) => [p.title, p.category, p.description, ...p.tags].some((s) => s.toLowerCase().includes(q)))
  }, [projects, query])

  const openNew = () => { setEditing(null); setFormOpen(true) }
  const openEdit = (p: Project) => { setEditing(p); setFormOpen(true) }

  const confirmDelete = () => {
    const p = pendingDelete
    if (!p) return
    const index = projects.findIndex((x) => x.id === p.id)
    const res = deleteProject(p.id)
    setPendingDelete(null)
    if (!res.ok) {
      toast.error("Couldn't delete this project", { description: res.error })
      return
    }
    toast(`Deleted “${p.title}”`, {
      duration: 8000,
      action: { label: "Undo", onClick: () => { restoreProject(p, index); toast.success(`Restored “${p.title}”`) } },
    })
  }

  return (
    <div className="relative min-h-[100dvh]">
      <div aria-hidden="true" className="canvas-grid pointer-events-none fixed inset-0 -z-10" />
      <header className="sticky top-0 z-30 px-3 pt-3">
        <div className="glass mx-auto flex max-w-[1240px] items-center justify-between rounded-full py-1.5 pl-2.5 pr-1.5">
          <div className="flex items-center gap-2.5">
            <Monogram />
            <span className="display hidden text-base [--wdth:100] sm:inline">{profile.name}</span>
            <span className="rounded-[4px] bg-marker px-1.5 py-1 font-mono text-[11px] font-medium leading-none text-[hsl(210_42%_10%)]">Admin</span>
          </div>
          <div className="flex items-center gap-1">
            <Button asChild variant="ghost" size="sm" className="h-9 gap-1.5 rounded-full">
              <a href="#/"><span className="hidden sm:inline">View site</span><ExternalLink className="h-4 w-4 sm:hidden" aria-label="View site" /><ArrowUpRight className="hidden h-4 w-4 sm:inline" /></a>
            </Button>
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="h-9 gap-1.5 rounded-full" onClick={() => { logout(); toast("Signed out") }}>
              <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Sign out</span><span className="sr-only sm:hidden">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="wrap py-10 md:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1 className="display mt-3 text-[clamp(2.2rem,5vw,3.5rem)] [--wdth:96]">Projects</h1>
            <p className="mt-2 text-muted-foreground">{projects.length} {projects.length === 1 ? "project" : "projects"} · {projects.filter((p) => p.featured).length} featured</p>
          </div>
          <Button onClick={openNew} className="h-11 gap-2 px-5"><Plus className="h-4 w-4" /> New project</Button>
        </div>

        <Tabs defaultValue="projects" className="mt-8">
          <TabsList className="h-10 bg-foreground/[0.07]">
            <TabsTrigger value="projects" className="px-4">Projects</TabsTrigger>
            <TabsTrigger value="settings" className="px-4">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="mt-6">
            {projects.length > 0 && (
              <div className="relative max-w-sm">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects" aria-label="Search projects" className="h-11 bg-card/70 pl-9" />
              </div>
            )}

            {projects.length === 0 ? (
              <div className="glass mt-6 grid place-items-center rounded-xl px-6 py-20 text-center">
                <FolderPlus className="h-9 w-9 text-muted-foreground" aria-hidden="true" />
                <h2 className="display mt-4 text-2xl [--wdth:100]">Add your first project</h2>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">Add a title, a short description and an image. It shows up on your public site the moment you save.</p>
                <Button onClick={openNew} className="mt-6 h-11 gap-2"><Plus className="h-4 w-4" /> New project</Button>
              </div>
            ) : filtered.length === 0 ? (
              <p className="mt-10 text-center text-muted-foreground">No projects match “{query}”.</p>
            ) : (
              <>
                {/* Desktop table */}
                <div className="glass mt-6 hidden overflow-hidden rounded-xl md:block">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-foreground/10 text-left">
                        {["Project", "Category", "Links", "Updated", ""].map((h, i) => (
                          <th key={i} scope="col" className="px-4 py-3 text-left text-[13px] font-medium text-muted-foreground">
                            {h || <span className="sr-only">Actions</span>}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((p) => (
                        <tr key={p.id} className="border-b border-foreground/10 last:border-b-0 hover:bg-foreground/[0.03]">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-4">
                              <div className="h-14 w-[5.5rem] shrink-0 overflow-hidden rounded-[5px] border border-border">
                                <ProjectCover image={p.image} seed={p.id} />
                              </div>
                              <div className="min-w-0">
                                <p className="flex items-center gap-2 font-semibold">
                                  <span className="truncate">{p.title}</span>
                                  {p.featured && <Star className="h-3.5 w-3.5 shrink-0 fill-marker text-marker" aria-label="Featured" />}
                                </p>
                                <p className="mt-0.5 line-clamp-1 max-w-md text-muted-foreground">{p.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{p.category || "—"}</td>
                          <td className="px-4 py-3"><Links p={p} /></td>
                          <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{fmt.format(p.updatedAt)}</td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => openEdit(p)} aria-label={`Edit ${p.title}`}><Pencil className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setPendingDelete(p)} aria-label={`Delete ${p.title}`}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <ul className="mt-6 space-y-4 md:hidden">
                  {filtered.map((p) => (
                    <li key={p.id} className="glass overflow-hidden rounded-xl">
                      <div className="aspect-[16/8] overflow-hidden"><ProjectCover image={p.image} seed={p.id} /></div>
                      <div className="p-4">
                        <p className="flex items-center gap-2 font-semibold">{p.title}{p.featured && <Star className="h-3.5 w-3.5 fill-marker text-marker" aria-label="Featured" />}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <span className="font-mono text-xs text-muted-foreground">{[p.category, fmt.format(p.updatedAt)].filter(Boolean).join(" · ")}</span>
                          <Links p={p} />
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <Button variant="outline" className="h-10 gap-2 bg-transparent" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /> Edit</Button>
                          <Button variant="outline" className="h-10 gap-2 bg-transparent text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setPendingDelete(p)}><Trash2 className="h-4 w-4" /> Delete</Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </TabsContent>

          <TabsContent value="settings" className="mt-6"><AdminSettings /></TabsContent>
        </Tabs>
      </main>

      <ProjectForm open={formOpen} project={editing} categories={categories} onOpenChange={setFormOpen} />

      <Dialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="display text-2xl [--wdth:100]">Delete “{pendingDelete?.title}”?</DialogTitle>
            <DialogDescription>It will disappear from your public site straight away. You'll have a few seconds to undo it afterwards.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="ghost" onClick={() => setPendingDelete(null)}>Keep project</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Links({ p }: { p: Project }) {
  if (!p.liveUrl && !p.githubUrl) return <span className="text-muted-foreground">—</span>
  return (
    <span className="inline-flex items-center gap-3">
      {p.liveUrl && (
        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="text-signal-ink hover:underline" aria-label={`Live demo of ${p.title} (opens in a new tab)`}>
          <ArrowUpRight className="h-4 w-4" />
        </a>
      )}
      {p.githubUrl && (
        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-foreground/75 hover:text-foreground" aria-label={`GitHub repository for ${p.title} (opens in a new tab)`}>
          <GithubIcon className="h-4 w-4" />
        </a>
      )}
    </span>
  )
}

import { useEffect, useMemo, useState } from "react"
import { FolderPlus } from "lucide-react"
import { ProjectCard } from "@/components/project-card"
import { ProjectModal } from "@/components/project-modal"
import { Reveal } from "@/components/reveal"
import { FrameLabel } from "@/components/site/frame-label"
import { useProjects } from "@/lib/projects-store"
import type { Project } from "@/lib/types"
import { cn } from "@/lib/utils"

export function Work() {
  const projects = useProjects()
  const [filter, setFilter] = useState("All")
  const [openId, setOpenId] = useState<string | null>(null)

  const categories = useMemo(() => ["All", ...Array.from(new Set(projects.map((p) => p.category.trim()).filter(Boolean)))], [projects])
  useEffect(() => {
    if (!categories.includes(filter)) setFilter("All")
  }, [categories, filter])

  const visible = useMemo(() => {
    const list = filter === "All" ? projects : projects.filter((p) => p.category === filter)
    // Featured first, otherwise keep the order set in the admin panel.
    return [...list].sort((a, b) => Number(b.featured) - Number(a.featured))
  }, [projects, filter])

  const active: Project | null = projects.find((p) => p.id === openId) ?? null

  return (
    <section id="work" className="relative py-20 md:py-28">
      <div className="wrap">
        <Reveal>
          <FrameLabel>Work · {projects.length} {projects.length === 1 ? "project" : "projects"}</FrameLabel>
          <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="display max-w-2xl text-[clamp(2.2rem,5.2vw,4rem)] [--wdth:96] leading-[1.04] tracking-[-0.015em]">Selected work</h2>
            {categories.length > 2 && (
              <div role="group" aria-label="Filter projects by category" className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:px-0">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={filter === c}
                    onClick={() => setFilter(c)}
                    className={cn(
                      "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
                      filter === c ? "border-foreground bg-foreground text-background" : "border-foreground/15 bg-card/50 text-foreground/75 hover:border-foreground/40 hover:text-foreground",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {visible.length === 0 ? (
          <Reveal className="mt-14">
            <div className="glass grid place-items-center rounded-xl px-6 py-20 text-center">
              <FolderPlus className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
              <h3 className="display mt-4 text-2xl [--wdth:100]">No projects here yet</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                {projects.length === 0 ? "Add your first project from the admin dashboard and it will appear here right away." : "Nothing in this category. Try another filter."}
              </p>
              {projects.length === 0 && (
                <a href="#/admin" className="mt-5 text-sm font-medium text-signal-ink underline underline-offset-4">
                  Open the admin dashboard
                </a>
              )}
            </div>
          </Reveal>
        ) : (
          <div className="mt-12 grid gap-x-8 gap-y-14 md:mt-16 md:grid-cols-2 md:gap-x-10 md:pb-16">
            {visible.map((p, i) => (
              // The offset lives on a wrapper so it can't fight the reveal transform.
              <div key={p.id} className={i % 2 === 1 ? "md:translate-y-16" : undefined}>
                <Reveal delay={(i % 2) * 90}>
                  <ProjectCard project={p} onOpen={(pr) => setOpenId(pr.id)} />
                </Reveal>
              </div>
            ))}
          </div>
        )}
      </div>
      <ProjectModal project={active} onClose={() => setOpenId(null)} />
    </section>
  )
}

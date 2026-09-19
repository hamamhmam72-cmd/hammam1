import { useRef } from "react"
import { ArrowUpRight } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { GithubIcon } from "@/components/brand-icons"
import { ProjectCover } from "@/components/project-cover"
import type { Project } from "@/lib/types"

export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  // Keep the last project mounted so content doesn't vanish during the close animation.
  const last = useRef<Project | null>(null)
  if (project) last.current = project
  const p = project ?? last.current
  if (!p) return null

  const paragraphs = (p.details || p.description).split(/\n{2,}/).filter(Boolean)
  const hasLinks = p.liveUrl || p.githubUrl

  return (
    <Dialog open={!!project} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92dvh] w-[calc(100%-1.5rem)] max-w-4xl gap-0 overflow-y-auto border-border bg-card p-0 sm:rounded-lg">
        <div className="aspect-[16/9] w-full overflow-hidden border-b border-border bg-muted">
          <ProjectCover image={p.image} seed={p.id} alt={`${p.title} preview`} eager />
        </div>

        <div className="grid gap-8 p-6 md:grid-cols-[minmax(0,1fr)_260px] md:gap-12 md:p-10">
          <div>
            <p className="eyebrow">{[p.category, p.year].filter(Boolean).join(" · ")}</p>
            <DialogTitle className="display mt-3 text-4xl [--wdth:96] md:text-5xl">{p.title}</DialogTitle>
            <DialogDescription className="mt-4 text-lg leading-relaxed text-foreground/85">{p.description}</DialogDescription>
            {p.details && p.details !== p.description && (
              <div className="mt-6 space-y-4 text-[15px] leading-[1.75] text-muted-foreground">
                {paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-6 md:border-l md:border-border md:pl-8">
            {p.tags.length > 0 && (
              <div>
                <h4 className="eyebrow">Built with</h4>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <li key={t} className="rounded-[4px] border border-border bg-background/60 px-2 py-1 font-mono text-xs leading-none">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col gap-2.5">
              {p.liveUrl && (
                <Button asChild className="h-11 justify-between">
                  <a href={p.liveUrl} target="_blank" rel="noopener noreferrer">
                    Open live demo <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {p.githubUrl && (
                <Button asChild variant="outline" className="h-11 justify-between border-input bg-transparent">
                  <a href={p.githubUrl} target="_blank" rel="noopener noreferrer">
                    View on GitHub <GithubIcon className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {!hasLinks && <p className="text-sm text-muted-foreground">No public links for this project. Ask me for a walkthrough.</p>}
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  )
}

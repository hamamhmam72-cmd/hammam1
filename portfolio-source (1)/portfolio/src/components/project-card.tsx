import { ArrowUpRight, Star } from "lucide-react"
import { GithubIcon } from "@/components/brand-icons"
import { ProjectCover } from "@/components/project-cover"
import type { Project } from "@/lib/types"

export function ProjectCard({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
  const shown = project.tags.slice(0, 4)
  const extra = project.tags.length - shown.length
  return (
    <article className="group relative flex flex-col">
      <div className="relative">
        <div className="overflow-hidden rounded-md border border-border bg-card shadow-[0_24px_48px_-28px_hsl(var(--glass-shadow))] transition-shadow duration-500 group-hover:shadow-[0_30px_60px_-26px_hsl(var(--glass-shadow))]">
          <div className="aspect-[16/10] overflow-hidden">
            <ProjectCover image={project.image} seed={project.id} className="transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
          </div>
        </div>
        {/* Selection frame: appears on hover and keyboard focus */}
        <span aria-hidden="true" className="pointer-events-none absolute -inset-1.5 border border-signal opacity-0 transition-opacity duration-200 group-focus-within:opacity-100 group-hover:opacity-100">
          <span className="handle -left-[5px] -top-[5px]" />
          <span className="handle -right-[5px] -top-[5px]" />
          <span className="handle -bottom-[5px] -left-[5px]" />
          <span className="handle -bottom-[5px] -right-[5px]" />
        </span>
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          {project.category ? (
            <span className="rounded-[4px] bg-black/45 px-2 py-1 font-mono text-[11px] font-medium leading-none text-white backdrop-blur-md">{project.category}</span>
          ) : (
            <span />
          )}
          {project.featured && (
            <span className="inline-flex items-center gap-1 rounded-[4px] bg-marker px-2 py-1 font-mono text-[11px] font-medium leading-none text-[hsl(210_42%_10%)]">
              <Star className="h-3 w-3 fill-current" /> Featured
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <h3 className="display text-[1.6rem] [--wdth:100] md:text-[1.75rem]">
            <button
              type="button"
              onClick={() => onOpen(project)}
              aria-haspopup="dialog"
              className="text-left outline-none after:absolute after:inset-0 after:z-[1] after:content-['']"
            >
              {project.title}
            </button>
          </h3>
          <ArrowUpRight className="mt-1.5 h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal-ink" aria-hidden="true" />
        </div>
        <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-muted-foreground">{project.description}</p>

        {project.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
            {shown.map((t) => (
              <li key={t} className="rounded-[4px] border border-border bg-card/60 px-2 py-1 font-mono text-[11px] leading-none text-muted-foreground">
                {t}
              </li>
            ))}
            {extra > 0 && <li className="px-1 py-1 font-mono text-[11px] leading-none text-muted-foreground">+{extra}</li>}
          </ul>
        )}

        {(project.liveUrl || project.githubUrl) && (
          <div className="relative z-[2] mt-auto flex items-center gap-5 pt-5 text-sm font-medium">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-signal-ink underline-offset-4 hover:underline">
                Live demo <ArrowUpRight className="h-3.5 w-3.5" />
                <span className="sr-only"> for {project.title} (opens in a new tab)</span>
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-foreground/80 underline-offset-4 hover:text-foreground hover:underline">
                <GithubIcon className="h-4 w-4" /> GitHub
                <span className="sr-only"> repository for {project.title} (opens in a new tab)</span>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

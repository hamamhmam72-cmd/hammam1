import { ChevronDown, FolderOpen } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Reveal } from "@/components/reveal"
import { FrameLabel } from "@/components/site/frame-label"
import { profile, type Use } from "@/data/profile"
import { cn } from "@/lib/utils"

const USE_STYLE: Record<Use, string> = {
  daily: "bg-signal/15 text-signal-ink",
  weekly: "bg-foreground/[0.07] text-muted-foreground",
  learning: "bg-marker/30 text-foreground",
}

export function Toolkit() {
  const total = profile.skills.reduce((n, g) => n + g.items.length, 0)
  return (
    <section id="toolkit" className="relative py-20 md:py-28">
      <div className="wrap">
        <Reveal>
          <FrameLabel>Toolkit · {total} tools</FrameLabel>
          <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="display text-[clamp(2.2rem,5vw,3.75rem)] [--wdth:96] leading-[1.04] tracking-[-0.015em]">What I work in</h2>
            <p className="max-w-sm text-[15px] leading-relaxed text-muted-foreground">Tagged by how often I actually use each one, not by how impressive it sounds.</p>
          </div>
        </Reveal>

        {/* Laid out like a layers panel */}
        <Reveal delay={80} className="mt-12">
          <div className="glass overflow-hidden rounded-xl">
            <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-3">
              <span className="eyebrow">Layers</span>
              <span className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-signal" /> daily</span>
                <span className="hidden items-center gap-1.5 sm:flex"><span className="h-2 w-2 rounded-full bg-foreground/30" /> weekly</span>
                <span className="hidden items-center gap-1.5 sm:flex"><span className="h-2 w-2 rounded-full bg-marker" /> learning</span>
              </span>
            </div>
            <div className="grid divide-y divide-foreground/10 md:grid-cols-3 md:divide-x md:divide-y-0">
              {profile.skills.map((g) => (
                <Collapsible key={g.group} defaultOpen className="p-3 md:p-4">
                  <CollapsibleTrigger className="group flex w-full items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-foreground/[0.05]">
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=closed]:-rotate-90" aria-hidden="true" />
                    <FolderOpen className="h-4 w-4 text-signal-ink" aria-hidden="true" />
                    <span className="font-semibold">{g.group}</span>
                    <span className="ml-auto font-mono text-xs text-muted-foreground">{g.items.length}</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                    <ul className="ml-[1.15rem] mt-1 border-l border-foreground/10 pl-2">
                      {g.items.map((s) => (
                        <li key={s.name} className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-foreground/[0.05]">
                          <span aria-hidden="true" className={cn("h-2.5 w-2.5 shrink-0 rounded-[3px]", s.use === "daily" ? "bg-signal" : s.use === "weekly" ? "bg-foreground/30" : "bg-marker")} />
                          <span className="text-[15px]">{s.name}</span>
                          <span className={cn("ml-auto rounded-[4px] px-1.5 py-1 font-mono text-[11px] leading-none", USE_STYLE[s.use])}>{s.use}</span>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

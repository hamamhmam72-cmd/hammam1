import { Reveal } from "@/components/reveal"
import { FrameLabel } from "@/components/site/frame-label"
import { profile } from "@/data/profile"

export function About() {
  return (
    <section id="about" className="relative py-20 md:py-28">
      <div className="wrap grid gap-12 md:grid-cols-12 md:gap-8">
        <Reveal className="md:col-span-5">
          <FrameLabel>About</FrameLabel>
          <h2 className="display mt-5 text-[clamp(2.2rem,5vw,3.75rem)] [--wdth:96] leading-[1.04] tracking-[-0.015em]">
            Designer who <br className="hidden md:block" />
            ships it.
          </h2>

          {/* Profile card: a glass panel over a dotted artboard */}
          <div className="relative mt-10 max-w-sm overflow-hidden rounded-xl border border-foreground/10 bg-card/40 p-6">
            <div aria-hidden="true" className="canvas-grid absolute inset-0 opacity-80" style={{ maskImage: "none", WebkitMaskImage: "none" }} />
            <div aria-hidden="true" className="blob -right-8 -top-10 h-40 w-40 bg-marker opacity-40 dark:opacity-20" />
            <div className="glass relative flex items-center gap-4 rounded-lg p-4">
              <span className="display grid h-16 w-16 shrink-0 place-items-center rounded-[10px] bg-signal text-3xl leading-none text-white [--wdth:70] dark:text-[hsl(214_34%_7%)]">{profile.initials}</span>
              <div className="min-w-0">
                <p className="display text-xl [--wdth:100]">{profile.name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{profile.role}</p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="md:col-span-7 md:pl-6">
          <Reveal delay={80}>
            <div className="space-y-5 text-lg leading-relaxed text-foreground/85 md:text-xl md:leading-relaxed">
              {profile.about.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120} className="mt-12">
            <h3 className="eyebrow">How a project runs</h3>
            {/* A real sequence, so numbering earns its place here */}
            <ol className="mt-4 divide-y divide-foreground/10 border-y border-foreground/10">
              {profile.process.map((s, i) => (
                <li key={s.title} className="grid grid-cols-[2rem_1fr] gap-x-3 gap-y-1 py-4 sm:grid-cols-[2rem_7rem_1fr]">
                  <span className="font-mono text-sm text-signal-ink">{i + 1}</span>
                  <span className="font-semibold">{s.title}</span>
                  <span className="col-start-2 text-[15px] leading-relaxed text-muted-foreground sm:col-start-3">{s.text}</span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

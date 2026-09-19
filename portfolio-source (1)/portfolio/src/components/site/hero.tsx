import { useEffect, useRef, type CSSProperties } from "react"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NamedCursor, Selection } from "@/components/selection"
import { profile } from "@/data/profile"

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[84px_1fr] items-baseline gap-3 border-b border-foreground/10 px-4 py-3 text-sm last:border-b-0">
      <dt className="text-[13px] font-medium text-muted-foreground">{k}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  )
}

export function Hero() {
  const h1 = useRef<HTMLHeadingElement>(null)

  // Pointer position across the headline drives the font's width axis. Desktop + motion-OK only.
  useEffect(() => {
    const el = h1.current
    if (!el) return
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!fine || reduce) return
    const BASE = 90, MIN = 66, MAX = 112
    let cur = BASE, target = BASE, raf = 0
    const tick = () => {
      cur += (target - cur) * 0.14
      if (Math.abs(target - cur) < 0.2) cur = target
      el.style.setProperty("--wdth", cur.toFixed(2))
      raf = cur === target ? 0 : requestAnimationFrame(tick)
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick) }
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const t = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
      target = MIN + (MAX - MIN) * t
      kick()
    }
    const leave = () => { target = BASE; kick() }
    el.addEventListener("pointermove", move)
    el.addEventListener("pointerleave", leave)
    return () => {
      el.removeEventListener("pointermove", move)
      el.removeEventListener("pointerleave", leave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="top" className="relative pb-24 pt-32 md:pb-32 md:pt-44">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob blob-drift right-[4%] top-[28%] h-[26rem] w-[26rem] bg-signal opacity-[0.3] dark:opacity-[0.22]" />
        <div className="blob blob-drift bottom-[6%] right-[26%] h-72 w-72 bg-marker opacity-[0.38] dark:opacity-[0.16]" style={{ animationDelay: "-6s" }} />
      </div>

      <div className="wrap relative">
        <p className="rise inline-flex items-center gap-2.5 rounded-full border border-foreground/10 bg-card/60 py-1.5 pl-2.5 pr-3.5 text-[13px] font-medium backdrop-blur" style={{ animationDelay: "60ms" }}>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-marker opacity-70 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-marker" />
          </span>
          {profile.availability}
        </p>

        <h1
          ref={h1}
          className="display rise mb-16 mt-7 text-[clamp(2.7rem,8.2vw,6.6rem)] leading-[0.96] tracking-[-0.02em] md:mb-20"
          style={{ "--wdth": 90, fontWeight: 800, animationDelay: "160ms" } as CSSProperties}
        >
          <span className="block">Design and code,</span>
          <span className="mt-1 block">
            <Selection cursor={<NamedCursor name={profile.name} />}>same hands.</Selection>
          </span>
        </h1>

        <div className="grid items-start gap-10 md:grid-cols-12 md:gap-8">
          <div className="rise md:col-span-6 lg:col-span-6" style={{ animationDelay: "320ms" }}>
            <p className="max-w-[34rem] text-lg leading-relaxed text-foreground/80 md:text-xl md:leading-relaxed">
              <span className="font-semibold text-foreground">{profile.name}</span> is a {profile.role.toLowerCase()}. {profile.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 gap-2 rounded-md px-6 text-[15px]">
                <a href="#work">
                  See selected work <ArrowDown className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 gap-2 rounded-md border-foreground/20 bg-card/50 px-6 text-[15px] backdrop-blur hover:bg-card">
                <a href="#contact">
                  Start a conversation <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <aside aria-label="At a glance" className="glass rise rounded-xl md:col-span-5 md:col-start-8" style={{ animationDelay: "440ms" }}>
            <div className="flex items-center justify-between border-b border-foreground/10 px-4 py-2.5">
              <span className="eyebrow">At a glance</span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-marker" /> Open to work
              </span>
            </div>
            <dl>
              <Row k="Role">Product designer + front-end engineer</Row>
              <Row k="Stack">
                <span className="font-mono text-[13px]">React · TypeScript · Tailwind</span>
              </Row>
              <Row k="Reply">{profile.responseTime}</Row>
              <Row k="Type">
                <span className="flex items-baseline gap-3">
                  <span className="display text-xl [--wdth:100]">Aa</span>
                  <span className="text-xl font-medium">Aa</span>
                  <span className="font-mono text-[11px] text-muted-foreground">Anybody / Hanken</span>
                </span>
              </Row>
              <Row k="Fill">
                <span className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
                  {[
                    ["bg-background", "Canvas"],
                    ["bg-signal", "Signal"],
                    ["bg-marker", "Marker"],
                  ].map(([c, n]) => (
                    <span key={n} className="inline-flex items-center gap-1.5 font-mono text-[12px]">
                      <span className={`h-3.5 w-3.5 rounded-[3px] ring-1 ring-foreground/25 ${c}`} /> {n}
                    </span>
                  ))}
                </span>
              </Row>
            </dl>
          </aside>
        </div>
      </div>
    </section>
  )
}

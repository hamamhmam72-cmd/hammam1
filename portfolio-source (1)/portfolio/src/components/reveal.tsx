import { useEffect, useRef, type CSSProperties, type ReactNode } from "react"
import { cn } from "@/lib/utils"

let io: IntersectionObserver | null = null
function observer() {
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in")
            io?.unobserve(e.target)
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
    )
  }
  return io
}

/** Fades content up once as it scrolls into view. Disabled by prefers-reduced-motion in CSS. */
export function Reveal({ children, delay = 0, className, style }: { children: ReactNode; delay?: number; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-in")
      return
    }
    const o = observer()
    o.observe(el)
    return () => o.unobserve(el)
  }, [])
  return (
    <div ref={ref} className={cn("reveal", className)} style={{ transitionDelay: delay ? `${delay}ms` : undefined, ...style }}>
      {children}
    </div>
  )
}

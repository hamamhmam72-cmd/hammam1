import type { ReactNode } from "react"

/** Section eyebrow: a short rule plus a label that carries real information (counts, timings). */
export function FrameLabel({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow flex items-center gap-3">
      <span aria-hidden="true" className="h-px w-8 bg-foreground/30" />
      {children}
    </p>
  )
}

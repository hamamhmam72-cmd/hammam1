import { useLayoutEffect, useRef, useState, type ReactNode } from "react"

/**
 * A design-tool selection box: outline, corner handles, and a live W × H tag.
 * The dimensions are measured, so they change as the text inside reflows.
 */
export function Selection({ children, cursor }: { children: ReactNode; cursor?: ReactNode }) {
  const inner = useRef<HTMLSpanElement>(null)
  const [size, setSize] = useState<[number, number] | null>(null)

  useLayoutEffect(() => {
    const el = inner.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      setSize([Math.round(r.width), Math.round(r.height)])
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <span className="relative inline-block">
      <span ref={inner} className="relative z-[1] inline-block">
        {children}
      </span>
      <span aria-hidden="true" className="pointer-events-none absolute -inset-x-3 -inset-y-1 z-[2] border border-signal bg-signal/[0.06]">
        <span className="handle -left-[5px] -top-[5px]" />
        <span className="handle -right-[5px] -top-[5px]" />
        <span className="handle -bottom-[5px] -left-[5px]" />
        <span className="handle -bottom-[5px] -right-[5px]" />
        {size && (
          <span className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-[3px] bg-signal px-1.5 py-[3px] font-mono text-[11px] font-medium leading-none tabular-nums text-white dark:text-[hsl(214_34%_7%)]">
            {size[0]} × {size[1]}
          </span>
        )}
      </span>
      {cursor}
    </span>
  )
}

/** A named multiplayer-style cursor. It arrives, clicks once, then idles. */
export function NamedCursor({ name }: { name: string }) {
  return (
    <span aria-hidden="true" className="kai-cursor pointer-events-none absolute -bottom-11 -right-9 z-[3] hidden sm:block">
      <span className="kai-click absolute -left-2 -top-2 h-6 w-6 rounded-full border-2 border-marker opacity-0" />
      <svg width="22" height="26" viewBox="0 0 22 26" className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.25)]">
        <path d="M2 2v19l5-4.6 3.4 7.6 3.2-1.4-3.3-7.4 6.7-.4z" fill="hsl(var(--marker))" stroke="hsl(210 42% 10%)" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
      <span className="absolute left-5 top-5 whitespace-nowrap rounded-[5px] rounded-tl-none bg-marker px-2 py-1 font-mono text-[11px] font-medium leading-none text-[hsl(210_42%_10%)]">{name}</span>
    </span>
  )
}

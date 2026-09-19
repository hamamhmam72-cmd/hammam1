import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { profile } from "@/data/profile"
import { cn } from "@/lib/utils"

const LINKS = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "toolkit", label: "Toolkit" },
  { id: "contact", label: "Contact" },
]

function useActiveSection() {
  const [active, setActive] = useState("")
  useEffect(() => {
    const els = LINKS.map((l) => document.getElementById(l.id)).filter((e): e is HTMLElement => !!e)
    if (!els.length || typeof IntersectionObserver === "undefined") return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: "-45% 0px -50% 0px" },
    )
    els.forEach((el) => io.observe(el))
    const onScroll = () => {
      if (window.scrollY < 200) setActive("")
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener("scroll", onScroll)
    }
  }, [])
  return active
}

export function Monogram({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("relative grid h-8 w-8 place-items-center rounded-[7px] bg-signal text-white dark:text-[hsl(214_34%_7%)]", className)}>
      <svg viewBox="0 0 32 32" className="h-full w-full" fill="none">
        <path d="M9.5 8v16M22.5 8v16M9.5 15.5h13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="16" cy="22" r="2.2" fill="hsl(var(--marker))" />
      </svg>
    </span>
  )
}

export function Nav() {
  const active = useActiveSection()
  const [open, setOpen] = useState(false)
  return (
    <header className="fixed inset-x-0 top-3 z-40 px-3 md:top-4">
      <nav aria-label="Primary" className="glass mx-auto flex max-w-[1240px] items-center justify-between rounded-full py-1.5 pl-2.5 pr-1.5 md:pl-3">
        <a href="#top" className="flex items-center gap-2.5 rounded-full pr-2">
          <Monogram />
          <span className="display text-[1.05rem] [--wdth:100]">{profile.name}</span>
        </a>

        <ul className="hidden items-center gap-0.5 md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                aria-current={active === l.id ? "true" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                  active === l.id && "bg-foreground/[0.08] text-foreground",
                )}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button asChild size="sm" className="ml-1 hidden h-9 rounded-full px-4 sm:inline-flex">
            <a href="#contact">Let’s talk</a>
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="border-border bg-background/95 backdrop-blur-xl">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">Jump to a section of the page</SheetDescription>
              <ul className="mt-6 space-y-1">
                {LINKS.map((l) => (
                  <li key={l.id}>
                    <a href={`#${l.id}`} onClick={() => setOpen(false)} className="display block rounded-md px-2 py-3 text-3xl [--wdth:100] hover:bg-accent">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}

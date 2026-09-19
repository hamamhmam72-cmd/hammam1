import { About } from "@/components/site/about"
import { Contact } from "@/components/site/contact"
import { Footer } from "@/components/site/footer"
import { Hero } from "@/components/site/hero"
import { Nav } from "@/components/site/nav"
import { Toolkit } from "@/components/site/toolkit"
import { Work } from "@/components/site/work"

export function PublicSite() {
  return (
    <div className="relative overflow-x-clip">
      <a href="#work" className="sr-only z-50 rounded-md bg-foreground px-4 py-2 text-background focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to work
      </a>
      <div aria-hidden="true" className="canvas-grid pointer-events-none fixed inset-0 -z-10" />
      <Nav />
      <main>
        <Hero />
        <Work />
        <About />
        <Toolkit />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

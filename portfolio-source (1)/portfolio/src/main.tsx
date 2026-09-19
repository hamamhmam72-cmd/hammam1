import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ThemeProvider } from "next-themes"
import "./index.css"
import App from "./App.tsx"

// One <link> per family, so a single failed request can't take the others down.
const FONT_URLS = [
  "https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@50..150,100..900&display=swap",
  "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400..700&display=swap",
  "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400..600&display=swap",
]
const pre = document.createElement("link")
pre.rel = "preconnect"
pre.href = "https://fonts.gstatic.com"
pre.crossOrigin = ""
document.head.appendChild(pre)
for (const href of FONT_URLS) {
  const l = document.createElement("link")
  l.rel = "stylesheet"
  l.href = href
  document.head.appendChild(l)
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <App />
    </ThemeProvider>
  </StrictMode>,
)

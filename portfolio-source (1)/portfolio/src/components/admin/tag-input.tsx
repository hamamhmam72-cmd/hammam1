import { useState } from "react"
import { X } from "lucide-react"

const MAX = 12

export function TagInput({ id, value, onChange, placeholder }: { id: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [text, setText] = useState("")

  const add = (raw: string) => {
    const parts = raw.split(",").map((t) => t.trim()).filter(Boolean)
    if (!parts.length) return
    const next = [...value]
    for (const p of parts) if (next.length < MAX && !next.some((t) => t.toLowerCase() === p.toLowerCase())) next.push(p)
    onChange(next)
    setText("")
  }

  return (
    <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-md border border-input bg-background/60 px-2 py-1.5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background">
      {value.map((t) => (
        <span key={t} className="inline-flex items-center gap-1 rounded-[4px] bg-foreground/[0.08] py-1 pl-2 pr-1 font-mono text-xs leading-none">
          {t}
          <button type="button" onClick={() => onChange(value.filter((x) => x !== t))} aria-label={`Remove ${t}`} className="grid h-4 w-4 place-items-center rounded-[3px] text-muted-foreground hover:bg-foreground/10 hover:text-foreground">
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={text}
        onChange={(e) => (e.target.value.endsWith(",") ? add(e.target.value) : setText(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            add(text)
          } else if (e.key === "Backspace" && !text && value.length) onChange(value.slice(0, -1))
        }}
        onBlur={() => add(text)}
        placeholder={value.length ? "" : placeholder}
        disabled={value.length >= MAX}
        className="min-w-[8rem] flex-1 bg-transparent px-1.5 py-1 text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  )
}

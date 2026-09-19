import { useState } from "react"
import { Check, Copy, Loader2, Mail, Send } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons"
import { Reveal } from "@/components/reveal"
import { FrameLabel } from "@/components/site/frame-label"
import { profile } from "@/data/profile"

type Errors = Partial<Record<"name" | "email" | "message", string>>
type Stage = { kind: "form" } | { kind: "sent"; via: "endpoint" | "mailto"; name: string; body: string }

export function Contact() {
  const [values, setValues] = useState({ name: "", email: "", message: "" })
  const [errors, setErrors] = useState<Errors>({})
  const [busy, setBusy] = useState(false)
  const [stage, setStage] = useState<Stage>({ kind: "form" })

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: e.target.value }))
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const validate = (): Errors => {
    const e: Errors = {}
    if (!values.name.trim()) e.name = "Tell me your name."
    if (!values.email.trim()) e.email = "Add an email so I can reply."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) e.email = "That email doesn't look right. Check for typos."
    if (values.message.trim().length < 10) e.message = "Add a sentence or two about what you're building."
    return e
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0]
      document.getElementById(`contact-${first}`)?.focus()
      return
    }
    const name = values.name.trim()
    const body = `Hi ${profile.name.split(" ")[0]},\n\n${values.message.trim()}\n\n${name}\n${values.email.trim()}`

    if (profile.contactEndpoint) {
      setBusy(true)
      try {
        const res = await fetch(profile.contactEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ name, email: values.email.trim(), message: values.message.trim() }),
        })
        if (!res.ok) throw new Error(String(res.status))
        setStage({ kind: "sent", via: "endpoint", name, body })
        setValues({ name: "", email: "", message: "" })
      } catch {
        toast.error("Couldn't send that. Try again, or email me directly.", { description: profile.email })
      } finally {
        setBusy(false)
      }
      return
    }

    const href = `mailto:${profile.email}?subject=${encodeURIComponent(`Project enquiry from ${name}`)}&body=${encodeURIComponent(body)}`
    try {
      window.location.href = href
    } catch {
      /* the confirmation below still offers copy + direct address */
    }
    setStage({ kind: "sent", via: "mailto", name, body })
  }

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied`)
    } catch {
      toast.error("Couldn't copy automatically. Select the text and copy it.")
    }
  }

  return (
    <section id="contact" className="relative py-20 md:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob left-[-6rem] top-1/3 h-80 w-80 bg-signal opacity-[0.2] dark:opacity-[0.16]" />
      </div>
      <div className="wrap relative grid gap-12 md:grid-cols-12 md:gap-10">
        <Reveal className="md:col-span-5">
          <FrameLabel>Contact · Reply {profile.responseTime.toLowerCase()}</FrameLabel>
          <h2 className="display mt-5 text-[clamp(2.2rem,5vw,3.75rem)] [--wdth:96] leading-[1.04] tracking-[-0.015em]">
            Have something <br className="hidden md:block" />
            to build?
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-foreground/80">Tell me what you're working on, roughly when you need it, and what good looks like. I'll reply with questions or a plan.</p>

          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={() => copy(profile.email, "Email")}
              className="group flex w-full max-w-sm items-center justify-between gap-3 rounded-md border border-foreground/15 bg-card/50 px-4 py-3 text-left backdrop-blur transition hover:border-foreground/40"
            >
              <span className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-signal-ink" aria-hidden="true" />
                <span className="font-mono text-sm">{profile.email}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-foreground">
                <Copy className="h-3.5 w-3.5" /> Copy
              </span>
            </button>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="h-10 gap-2 border-foreground/15 bg-card/50 backdrop-blur">
                <a href={profile.social.github} target="_blank" rel="noopener noreferrer">
                  <GithubIcon className="h-4 w-4" /> GitHub<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="h-10 gap-2 border-foreground/15 bg-card/50 backdrop-blur">
                <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer">
                  <LinkedinIcon className="h-4 w-4" /> LinkedIn<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </Button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100} className="md:col-span-7">
          <div className="glass rounded-xl p-5 sm:p-8">
            {stage.kind === "sent" ? (
              <div role="status" className="py-4">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-signal text-white dark:text-[hsl(214_34%_7%)]">
                  <Check className="h-5 w-5" />
                </span>
                {stage.via === "endpoint" ? (
                  <>
                    <h3 className="display mt-5 text-3xl [--wdth:100]">Thanks, {stage.name.split(" ")[0]}.</h3>
                    <p className="mt-2 max-w-md text-muted-foreground">Your message is in. I'll reply {profile.responseTime.toLowerCase()}.</p>
                  </>
                ) : (
                  <>
                    <h3 className="display mt-5 text-3xl [--wdth:100]">Your email app should be open.</h3>
                    <p className="mt-2 max-w-md text-muted-foreground">The message is filled in and addressed to {profile.email}. If nothing opened, copy it and send it from any email app.</p>
                    <pre className="mt-5 max-h-40 overflow-auto whitespace-pre-wrap rounded-md border border-foreground/10 bg-background/60 p-4 font-mono text-[12.5px] leading-relaxed">{stage.body}</pre>
                  </>
                )}
                <div className="mt-6 flex flex-wrap gap-3">
                  {stage.via === "mailto" && (
                    <Button onClick={() => copy(stage.body, "Message")} className="gap-2">
                      <Copy className="h-4 w-4" /> Copy message
                    </Button>
                  )}
                  <Button variant="outline" className="border-foreground/20 bg-transparent" onClick={() => setStage({ kind: "form" })}>
                    Write another
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="contact-name" label="Your name" error={errors.name}>
                    <Input id="contact-name" autoComplete="name" value={values.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "contact-name-err" : undefined} className="h-11 bg-background/60" />
                  </Field>
                  <Field id="contact-email" label="Email" error={errors.email}>
                    <Input id="contact-email" type="email" autoComplete="email" value={values.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby={errors.email ? "contact-email-err" : undefined} className="h-11 bg-background/60" />
                  </Field>
                </div>
                <Field id="contact-message" label="What are you building?" error={errors.message}>
                  <Textarea id="contact-message" rows={6} value={values.message} onChange={set("message")} aria-invalid={!!errors.message} aria-describedby={errors.message ? "contact-message-err" : undefined} className="resize-y bg-background/60" placeholder="A short description, a rough timeline, and a link if you have one." />
                </Field>
                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <p className="max-w-[16rem] text-xs leading-relaxed text-muted-foreground">
                    {profile.contactEndpoint ? "Goes straight to my inbox." : "Opens your email app with the message ready to send."}
                  </p>
                  <Button type="submit" size="lg" disabled={busy} className="h-12 gap-2 rounded-md px-6">
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {busy ? "Sending" : "Send message"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[13px] font-medium">
        {label}
      </Label>
      {children}
      {error && (
        <p id={`${id}-err`} className="text-[13px] font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

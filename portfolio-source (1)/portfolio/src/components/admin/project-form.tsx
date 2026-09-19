import { useEffect, useRef, useState } from "react"
import { ImageOff, Loader2, Shuffle, Upload } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ProjectCover } from "@/components/project-cover"
import { TagInput } from "@/components/admin/tag-input"
import { fileToDataUrl, isHttpUrl } from "@/lib/image-utils"
import { createProject, updateProject } from "@/lib/projects-store"
import type { Project, ProjectInput } from "@/lib/types"

const EMPTY: ProjectInput = { title: "", description: "", details: "", image: "", category: "", tags: [], liveUrl: "", githubUrl: "", year: String(new Date().getFullYear()), featured: false }

type Errors = Partial<Record<"title" | "category" | "description" | "liveUrl" | "githubUrl", string>>

function toInput(p: Project): ProjectInput {
  const { id: _i, createdAt: _c, updatedAt: _u, ...rest } = p
  return rest
}

export function ProjectForm({ open, project, categories, onOpenChange }: { open: boolean; project: Project | null; categories: string[]; onOpenChange: (o: boolean) => void }) {
  const [draft, setDraft] = useState<ProjectInput>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [uploading, setUploading] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const previewSeed = useRef("preview")

  useEffect(() => {
    if (!open) return
    setDraft(project ? toInput(project) : EMPTY)
    setErrors({})
    setImgFailed(false)
    previewSeed.current = project?.id ?? `new-${Date.now()}`
  }, [open, project])

  const set = <K extends keyof ProjectInput>(k: K, v: ProjectInput[K]) => {
    setDraft((d) => ({ ...d, [k]: v }))
    if (k in errors) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const isDataUrl = draft.image.startsWith("data:")
  const isGenerated = draft.image.trim() === "" || draft.image.startsWith("cover:")

  const validate = (): Errors => {
    const e: Errors = {}
    if (!draft.title.trim()) e.title = "Give the project a title."
    if (!draft.category.trim()) e.category = "Add a category so visitors can filter."
    if (!draft.description.trim()) e.description = "Add a one or two sentence summary for the card."
    if (draft.liveUrl.trim() && !isHttpUrl(draft.liveUrl.trim())) e.liveUrl = "Use a full link starting with https://"
    if (draft.githubUrl.trim() && !isHttpUrl(draft.githubUrl.trim())) e.githubUrl = "Use a full link starting with https://"
    return e
  }

  const save = () => {
    const found = validate()
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      document.getElementById(`pf-${first}`)?.focus()
      return
    }
    const clean: ProjectInput = {
      ...draft,
      title: draft.title.trim(),
      category: draft.category.trim(),
      description: draft.description.trim(),
      details: draft.details.trim(),
      image: draft.image.trim(),
      year: draft.year.trim(),
      liveUrl: draft.liveUrl.trim(),
      githubUrl: draft.githubUrl.trim(),
    }
    const res = project ? updateProject(project.id, clean) : createProject(clean)
    if (!res.ok) {
      toast.error("Couldn't save this project", { description: res.error })
      return
    }
    toast.success(project ? `Saved changes to “${clean.title}”` : `Added “${clean.title}”`, res.persisted ? undefined : { description: "Browser storage is unavailable, so this lasts only until you close the tab." })
    onOpenChange(false)
  }

  const onFile = async (file?: File) => {
    if (!file) return
    setUploading(true)
    try {
      set("image", await fileToDataUrl(file))
      setImgFailed(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't use that image.")
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ""
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 border-border bg-background p-0 sm:max-w-xl">
        <SheetHeader className="border-b border-border px-6 py-5 text-left">
          <SheetTitle className="display text-2xl [--wdth:100]">{project ? "Edit project" : "New project"}</SheetTitle>
          <SheetDescription>{project ? "Changes appear on your public site as soon as you save." : "It will appear at the top of your public site as soon as you save."}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          <Field id="pf-title" label="Title" error={errors.title} required>
            <Input id="pf-title" value={draft.title} onChange={(e) => set("title", e.target.value)} aria-invalid={!!errors.title} maxLength={80} className="h-11" placeholder="Ledgerline" />
          </Field>

          <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
            <Field id="pf-category" label="Category" error={errors.category} required>
              <Input id="pf-category" list="pf-categories" value={draft.category} onChange={(e) => set("category", e.target.value)} aria-invalid={!!errors.category} maxLength={40} className="h-11" placeholder="Web app" />
              <datalist id="pf-categories">{categories.map((c) => <option key={c} value={c} />)}</datalist>
            </Field>
            <Field id="pf-year" label="Year">
              <Input id="pf-year" inputMode="numeric" value={draft.year} onChange={(e) => set("year", e.target.value)} maxLength={4} className="h-11" />
            </Field>
          </div>

          <Field id="pf-description" label="Short description" error={errors.description} required hint={`${draft.description.length}/180`}>
            <Textarea id="pf-description" rows={2} value={draft.description} onChange={(e) => set("description", e.target.value)} aria-invalid={!!errors.description} maxLength={180} placeholder="One or two sentences. Shown on the project card." />
          </Field>

          <Field id="pf-details" label="Details" hint="Optional. Shown in the detail view. Leave a blank line between paragraphs.">
            <Textarea id="pf-details" rows={6} value={draft.details} onChange={(e) => set("details", e.target.value)} placeholder="What was the problem, what did you do, and what changed?" />
          </Field>

          <div className="space-y-3">
            <Label htmlFor="pf-image" className="text-[13px] font-medium">Cover image</Label>
            <div className="overflow-hidden rounded-md border border-border bg-muted">
              <div className="aspect-[16/10]">
                <ProjectCover key={draft.image} image={draft.image} seed={previewSeed.current} alt="Cover preview" onStatus={(s) => setImgFailed(s === "failed")} />
              </div>
            </div>
            {imgFailed && (
              <p role="status" className="flex items-start gap-2 text-[13px] text-muted-foreground">
                <ImageOff className="mt-0.5 h-4 w-4 shrink-0" /> That link didn't load, so a generated cover is shown. Check the URL, or upload the file instead.
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} tabIndex={-1} aria-hidden="true" />
              <Button type="button" variant="outline" size="sm" className="gap-2" disabled={uploading} onClick={() => fileRef.current?.click()}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload image
              </Button>
              <Button type="button" variant="outline" size="sm" className="gap-2" disabled={isGenerated} onClick={() => { set("image", ""); setImgFailed(false) }}>
                <Shuffle className="h-4 w-4" /> Use generated mockup
              </Button>
            </div>
            <Input
              id="pf-image"
              value={isDataUrl ? "" : draft.image.startsWith("cover:") ? "" : draft.image}
              onChange={(e) => set("image", e.target.value)}
              placeholder={isDataUrl ? "Uploaded image in use. Paste a URL to replace it." : "Or paste an image URL: https://…"}
              className="h-11 font-mono text-[13px]"
              inputMode="url"
            />
            <p className="text-xs leading-relaxed text-muted-foreground">Uploads are resized and saved in this browser. Image URLs work when the host allows other sites to load them. Leave blank for a generated mockup.</p>
          </div>

          <Field id="pf-tags" label="Technologies" hint="Press Enter or comma to add each one.">
            <TagInput id="pf-tags" value={draft.tags} onChange={(t) => set("tags", t)} placeholder="React, TypeScript, Supabase" />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="pf-liveUrl" label="Live demo link" error={errors.liveUrl}>
              <Input id="pf-liveUrl" inputMode="url" value={draft.liveUrl} onChange={(e) => set("liveUrl", e.target.value)} aria-invalid={!!errors.liveUrl} className="h-11 font-mono text-[13px]" placeholder="https://" />
            </Field>
            <Field id="pf-githubUrl" label="GitHub link" error={errors.githubUrl}>
              <Input id="pf-githubUrl" inputMode="url" value={draft.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} aria-invalid={!!errors.githubUrl} className="h-11 font-mono text-[13px]" placeholder="https://github.com/" />
            </Field>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-md border border-border p-4">
            <div>
              <Label htmlFor="pf-featured" className="text-sm font-medium">Feature this project</Label>
              <p className="mt-0.5 text-xs text-muted-foreground">Featured projects are listed first and get a badge.</p>
            </div>
            <Switch id="pf-featured" checked={draft.featured} onCheckedChange={(v) => set("featured", v)} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border bg-background px-6 py-4">
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="button" onClick={save} className="min-w-32" disabled={uploading}>{project ? "Save changes" : "Add project"}</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function Field({ id, label, error, hint, required, children }: { id: string; label: string; error?: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id} className="text-[13px] font-medium">
          {label} {required && <span className="text-muted-foreground" aria-hidden="true">*</span>}
        </Label>
        {hint && <span className="text-right text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p role="alert" className="text-[13px] font-medium text-destructive">{error}</p>}
    </div>
  )
}

export interface Project {
  id: string
  title: string
  /** One or two sentences, shown on the card. */
  description: string
  /** Longer write-up, shown in the detail modal. Falls back to description. */
  details: string
  /** https URL, data: URI, or "cover:<kind>[:<palette>]" for a generated mockup. Blank = generated. */
  image: string
  category: string
  /** Technologies used. */
  tags: string[]
  liveUrl: string
  githubUrl: string
  year: string
  featured: boolean
  createdAt: number
  updatedAt: number
}

export type ProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt">

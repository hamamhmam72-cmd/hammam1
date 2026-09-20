/**
 * Everything personal on the public site lives here. Edit this file, rebuild, done.
 */
export const profile = {
  name: "Hammam",
  initials: "H",
  role: "Product designer & front-end engineer",
  email: "Hamamhmam72@gmail.com",
  availability: "Booking projects for Q4 2026",
  responseTime: "Within a day",
  intro:
    "I take products from first sketch to production React. Small teams hire me when they need the interface to feel finished, and the code behind it to stay that way.",
  social: {
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
  },
  /** Optional. If set, the contact form POSTs JSON here (Formspree, Basin, your own API). Otherwise it opens the visitor's email app. */
  contactEndpoint: "",
  about: [
    "I'm Hammam, a designer who started writing production code because handoffs kept losing the details that mattered. Now I work on both sides: the interface in Figma, then the React and TypeScript that ships it.",
    "I do my best work with small teams that need a product to feel finished: dashboards, design systems, and marketing sites that have to convert. I ask a lot of questions early, prototype fast, and keep you posted every week.",
  ],
  process: [
    { title: "Scope", text: "One call and a written brief, so we agree on the problem before anyone opens a design tool." },
    { title: "Design", text: "A clickable prototype within about a week, tested with real users where possible." },
    { title: "Build", text: "Weekly deploys to a preview link. You see progress in the browser, not in a status report." },
    { title: "Hand over", text: "Documentation, tests, and a walkthrough, so your team can own it without me." },
  ],
  skills: [
    {
      group: "Design",
      items: [
        { name: "Figma", use: "daily" },
        { name: "Interface design", use: "daily" },
        { name: "Design systems", use: "daily" },
        { name: "Prototyping", use: "weekly" },
        { name: "User research", use: "weekly" },
      ],
    },
    {
      group: "Front-end",
      items: [
        { name: "React", use: "daily" },
        { name: "TypeScript", use: "daily" },
        { name: "Tailwind CSS", use: "daily" },
        { name: "Next.js", use: "weekly" },
        { name: "Accessibility", use: "weekly" },
        { name: "Motion & animation", use: "weekly" },
      ],
    },
    {
      group: "Back-end & tooling",
      items: [
        { name: "Node.js", use: "weekly" },
        { name: "PostgreSQL", use: "weekly" },
        { name: "Supabase", use: "weekly" },
        { name: "Vitest & Playwright", use: "weekly" },
        { name: "React Native", use: "learning" },
      ],
    },
  ],
} as const

export type Use = "daily" | "weekly" | "learning"

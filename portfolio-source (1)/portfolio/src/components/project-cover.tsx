import { useEffect, useMemo, useState } from "react"
import { fallbackCover, resolveImage } from "@/lib/covers"
import { cn } from "@/lib/utils"

/** Renders a project's image, falling back to a generated mockup if it's blank or fails to load. */
export function ProjectCover({
  image,
  seed,
  alt = "",
  className,
  eager,
  onStatus,
}: {
  image: string
  seed: string
  alt?: string
  className?: string
  eager?: boolean
  onStatus?: (s: "ok" | "failed") => void
}) {
  const resolved = useMemo(() => resolveImage(image, seed), [image, seed])
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [image])
  return (
    <img
      src={failed ? fallbackCover(seed) : resolved.src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable={false}
      onLoad={() => onStatus?.("ok")}
      onError={() => {
        setFailed(true)
        onStatus?.("failed")
      }}
      className={cn("h-full w-full object-cover", className)}
    />
  )
}

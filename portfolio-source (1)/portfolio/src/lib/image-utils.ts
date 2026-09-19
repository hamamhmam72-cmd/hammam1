/** Reads an image file, downsizes it, and returns a data URL small enough for localStorage. */
export async function fileToDataUrl(file: File, maxWidth = 1400): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file (PNG, JPG, WebP or SVG).")
  if (file.size > 12 * 1024 * 1024) throw new Error("That image is over 12 MB. Try a smaller one.")

  if (file.type === "image/svg+xml") {
    if (file.size > 400 * 1024) throw new Error("That SVG is over 400 KB. Try a smaller one.")
    return readAsDataUrl(file)
  }

  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image()
      i.onload = () => resolve(i)
      i.onerror = () => reject(new Error("Couldn't read that image."))
      i.src = url
    })
    const scale = Math.min(1, maxWidth / img.naturalWidth)
    const w = Math.round(img.naturalWidth * scale)
    const h = Math.round(img.naturalHeight * scale)
    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("Couldn't process that image.")
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, w, h)
    ctx.drawImage(img, 0, 0, w, h)
    return canvas.toDataURL("image/jpeg", 0.82)
  } finally {
    URL.revokeObjectURL(url)
  }
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(new Error("Couldn't read that file."))
    r.readAsDataURL(file)
  })
}

export function isHttpUrl(v: string) {
  try {
    const u = new URL(v)
    return u.protocol === "https:" || u.protocol === "http:"
  } catch {
    return false
  }
}

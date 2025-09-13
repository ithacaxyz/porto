export function toAbsolute(url: string | undefined) {
  if (!url) return undefined
  if (url.startsWith('/')) return `${window.location.origin}${url}`
  return url
}

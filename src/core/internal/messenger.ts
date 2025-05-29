/**
 * Normalizes a payload to a structured-clone compatible format.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#message
 */
export function normalizeMessage(payload: unknown): unknown {
  if (Array.isArray(payload)) return payload.map(normalizeMessage)
  if (typeof payload === 'function') return undefined
  if (typeof payload !== 'object' || payload === null) return payload
  if (Object.getPrototypeOf(payload) !== Object.prototype) return payload

  let normalized: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(payload))
    normalized[key] = normalizeMessage(value)
  return normalized
}

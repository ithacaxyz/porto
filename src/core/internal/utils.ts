/**
 * Normalizes a value into a structured-clone compatible format.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone
 */
export function normalizeValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeValue)
  if (typeof value === 'function') return undefined
  if (typeof value !== 'object' || value === null) return value
  if (Object.getPrototypeOf(value) !== Object.prototype) return value

  let normalized: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(value)) normalized[k] = normalizeValue(v)
  return normalized
}

/**
 * Returns a new array containing only one copy of each element in the original
 * list transformed by a function.
 *
 * @param data - Array.
 * @param fn - Extracts a value to be used to compare elements.
 */
export function uniqBy<data>(data: data[], fn: (item: data) => unknown) {
  const result: data[] = []
  const seen = new Set()
  for (const item of data) {
    const key = fn(item)
    if (!seen.has(key)) {
      seen.add(key)
      result.push(item)
    }
  }
  return result
}

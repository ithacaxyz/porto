/**
 * Normalizes a value into a structured-clone compatible format.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone
 */
export function normalizeValue<type>(value: type): type {
  if (Array.isArray(value)) return value.map(normalizeValue) as never
  if (typeof value === 'function') return undefined as never
  if (typeof value !== 'object' || value === null) return value
  if (Object.getPrototypeOf(value) !== Object.prototype)
    try {
      return structuredClone(value)
    } catch {
      return undefined as never
    }

  const normalized: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(value)) normalized[k] = normalizeValue(v)
  return normalized as never
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

export function uuidv4() {
  if (typeof globalThis !== 'undefined' && 'crypto' in globalThis)
    return globalThis.crypto.randomUUID()
  return crypto.randomUUID()
}

/** Deduplicates in-flight promises. */
export function withDedupe<data>(
  fn: () => Promise<data>,
  { enabled = true, id }: withDedupe.Options,
): Promise<data> {
  if (!enabled || !id) return fn()
  if (withDedupe.cache.get(id)) return withDedupe.cache.get(id)!
  const promise = fn().finally(() => withDedupe.cache.delete(id))
  withDedupe.cache.set(id, promise)
  return promise
}

export namespace withDedupe {
  export type Options = {
    enabled?: boolean | undefined
    id?: string | undefined
  }

  export const cache = new Map<string, Promise<any>>()
}

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

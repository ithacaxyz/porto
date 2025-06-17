import * as Chains from '../../core/Chains.js'

/** Gets all chain names. */
export function getChainNames() {
  return Object.entries(Chains)
    .filter(([_, chain]) => typeof chain === 'object' && 'id' in chain)
    .map(([key]) => camelToKebab(key))
}

/** Converts kebab-case string to camelCase. */
export function kebabToCamel(str: string): string {
  return str
    .split('-')
    .map((word, index) =>
      index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
    )
    .join('')
}

/** Converts camelCase string to kebab-case. */
export function camelToKebab(str: string): string {
  return str
    .split(/(?=[A-Z])/)
    .map((word) => word.toLowerCase())
    .join('-')
}

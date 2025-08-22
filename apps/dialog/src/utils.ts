import { Value } from 'ox'

export namespace PriceFormatter {
  /**
   * Formats a number or bigint to a currency-formatted string.
   *
   * @param value - The number or bigint to format.
   * @returns The formatted string.
   */
  export function format(value: number | bigint) {
    if (abs(value) < 0.01)
      return `${value < 0 ? '-' : ''}<${numberIntl.format(value == 0 ? '0' : '0.01')}`
    return numberIntl.format(value)
  }

  /** @internal */
  const numberIntl = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  })

  function abs(value: bigint | number): bigint | number {
    if (typeof value === 'number') return Math.abs(value)
    return value < 0n ? -value : value
  }
}

export namespace StringFormatter {
  export function truncate(
    str: string,
    { start = 8, end = 6 }: { start?: number; end?: number } = {},
  ) {
    if (str.length <= start + end) return str
    return `${str.slice(0, start)}\u2026${str.slice(-end)}`
  }
}

export namespace ValueFormatter {
  const numberIntl = new Intl.NumberFormat('en-US', {
    maximumSignificantDigits: 4,
  })

  export function format(num: bigint | number | undefined, units = 18) {
    if (!num) return '0'
    return numberIntl.format(
      typeof num === 'bigint' ? Number(Value.format(num, units)) : num,
    )
  }
}

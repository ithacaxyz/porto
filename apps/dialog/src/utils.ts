import { type Address, Value } from 'ox'

export namespace PriceFormatter {
  /**
   * Formats a number or bigint to a currency-formatted string.
   *
   * @param value - The number or bigint to format.
   * @returns The formatted string.
   */
  export function format(value: number | bigint) {
    if (typeof value === 'number' && value > 0 && value < 0.01) return '<$0.01'
    return numberIntl.format(value)
  }

  /** @internal */
  const numberIntl = new Intl.NumberFormat('en-US', {
    currency: 'USD',
    style: 'currency',
  })
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

export namespace AddressFormatter {
  export function shorten(address: Address.Address, chars = 4) {
    return address.length < chars * 2 + 2
      ? address
      : address.slice(0, chars + 2) + '…' + address.slice(-chars)
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

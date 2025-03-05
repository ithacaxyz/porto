import { type ClassValue, clsx } from 'clsx'
import { Value } from 'ox'
import { twMerge } from 'tailwind-merge'

export const shuffleArray = <T>(array: T[]): T[] =>
  array.sort(() => Math.random() - 0.5)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sum = (array: number[]) =>
  array.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

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
    maximumSignificantDigits: 6,
  })

  export function format(num: bigint | number | undefined, units = 18) {
    if (!num) return '0'
    return numberIntl.format(
      typeof num === 'bigint' ? Number(Value.format(num, units)) : num,
    )
  }
}

export namespace PercentFormatter {
  const numberIntl = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })

  export function format(num: number | undefined) {
    if (!num) return '0%'
    return numberIntl.format(Number(num / 100))
  }
}

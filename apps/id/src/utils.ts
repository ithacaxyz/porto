import { Value } from 'ox'

export namespace ArrayUtils {
  export function sum(array: number[]) {
    return array.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0,
    )
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
    maximumSignificantDigits: 6,
  })

  export function format(num: bigint | number | undefined, units = 18) {
    if (!num) return '0'
    return numberIntl.format(
      typeof num === 'bigint' ? Number(Value.format(num, units)) : num,
    )
  }

  const priceIntl = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })

  export function formatToPrice(
    num: string | bigint | number | undefined,
    units = 18,
  ) {
    if (!num) return '0'
    return priceIntl.format(
      typeof num === 'bigint' ? Number(Value.format(num, units)) : Number(num),
    )
  }
}

export namespace PercentFormatter {
  const numberIntl = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: 'percent',
  })

  export function format(num: number | undefined) {
    if (!num) return '0%'
    return numberIntl.format(Number(num / 100))
  }
}

export namespace DateFormatter {
  const dateIntl = new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    month: '2-digit',
    second: '2-digit',
    year: 'numeric',
  })

  export function format(date: string) {
    return dateIntl.format(new Date(date))
  }

  // given a timestamp, return a string that says how long ago it was
  export function ago(timestamp: Date) {
    const now = Date.now()
    const diff = now - timestamp.getTime()
    const seconds = Math.floor(diff / 1_000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    if (years > 0) return `${years}y`
    if (months > 0) return `${months}M`
    if (weeks > 0) return `${weeks}w`
    if (days > 0) return `${days}d`
    if (hours > 0) return `${hours}h`
    if (minutes > 0) return `${minutes}m`
    return `${seconds}s`
  }

  export function timeToDuration(timestamp: number) {
    const now = Date.now()
    const targetTime = new Date(timestamp)
    const diff = targetTime.getTime() - now

    if (diff < 0) return 'expired'

    const seconds = Math.floor(diff / 1_000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const weeks = Math.floor(days / 7)
    const months = Math.floor(days / 30)
    const years = Math.floor(days / 365)

    if (years > 0) return `${years}y`
    if (months > 0) return `${months}M`
    if (weeks > 0) return `${weeks}w`
    if (days > 0) return `${days}d`
    if (hours > 0) return `${hours}h`
    if (minutes > 0) return `${minutes}m`
    return `${seconds}s`
  }
}

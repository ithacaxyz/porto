export function create(options: create.Options = {}) {
  const { prefix = '[Porto]' } = options

  const memo = new Set<string>()

  return {
    error: createLogFn(console.error, { prefix }),
    errorOnce: createLogFn(console.error, { memo, prefix }),
    log: createLogFn(console.log, { prefix }),
    logOnce: createLogFn(console.log, { memo, prefix }),
    warn: createLogFn(console.warn, { prefix }),
    warnOnce: createLogFn(console.warn, { memo, prefix }),
  }
}

export declare namespace create {
  type Options = {
    prefix?: string
  }
}

export const logger = create()

function createLogFn<fn extends (...args: any[]) => void>(
  fn: fn,
  options: createLogFn.Options = {},
) {
  const { memo, prefix } = options
  return (...messages: string[]) => {
    const message = messages.join(' ')
    if (memo?.has(message)) return
    memo?.add(message)
    fn(`${prefix} ${message}`)
  }
}

declare namespace createLogFn {
  type Options = {
    memo?: Set<string> | undefined
    prefix?: string
  }
}

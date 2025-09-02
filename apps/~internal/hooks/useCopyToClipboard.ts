import * as React from 'react'

export function useCopyToClipboard(props?: useCopyToClipboard.Props) {
  const { timeout = 1_500 } = props ?? {}

  const [isCopied, setIsCopied] = React.useState(false)

  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const copyToClipboard: useCopyToClipboard.CopyFn = React.useCallback(
    async (text) => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard API not supported')
        return false
      }

      if (timer.current) clearTimeout(timer.current)

      try {
        await navigator.clipboard.writeText(text)
        setIsCopied(true)
        timer.current = setTimeout(() => setIsCopied(false), timeout)
        return true
      } catch (error) {
        console.error('Failed to copy text: ', error)
        return false
      }
    },
    [timeout],
  )

  return [isCopied, copyToClipboard] as const
}

export declare namespace useCopyToClipboard {
  type CopyFn = (text: string) => Promise<boolean>
  type Props = {
    timeout?: number
  }
}

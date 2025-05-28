import * as React from 'react'

export function useCopyToClipboard(props?: useCopyToClipboard.Props) {
  const { timeout = 1_500 } = props ?? {}

  const [isCopied, setIsCopied] = React.useState(false)

  const copyToClipboard: useCopyToClipboard.CopyFn = React.useCallback(
    async (text) => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard API not supported')
        return false
      }

      try {
        await navigator.clipboard.writeText(text)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), timeout)
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

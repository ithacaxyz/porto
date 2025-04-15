import * as React from 'react'

export function useCopyToClipboard(props: CopyToClipboard.Props) {
  const {
    timeout = 1_500,
    initialText = 'Copy',
    successText = 'Copied',
  } = props

  const [copyText, setCopyText] =
    React.useState<CopyToClipboard.Props['initialText']>(initialText)

  const copyToClipboard: CopyToClipboard.CopyFn = React.useCallback(
    async (text) => {
      if (!navigator?.clipboard) {
        console.warn('Clipboard API not supported')
        return false
      }

      try {
        await navigator.clipboard.writeText(text)
        setCopyText(successText)
        setTimeout(() => setCopyText(initialText), timeout)
        return true
      } catch (error) {
        console.error('Failed to copy text: ', error)
        return false
      } finally {
        setCopyText(initialText)
      }
    },
    [initialText, timeout, successText],
  )

  return [copyText, copyToClipboard] as const
}

declare namespace CopyToClipboard {
  type CopyFn = (text: string) => Promise<boolean>
  type Props = {
    timeout?: number
    initialText?: string
    successText?: string
  }
}

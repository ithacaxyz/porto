import { IndeterminateLoader } from '@porto/apps/components'
import { Screen } from '@porto/ui'
import { useLocation } from '@tanstack/react-router'
import { Hooks } from 'porto/remote'
import type * as React from 'react'
import * as Dialog from '~/lib/Dialog'
import { porto } from '~/lib/Porto'

export function DialogScreen(props: DialogScreen.Props) {
  const { children, loading, loadingTitle } = props

  const location = useLocation()
  const mode = Dialog.useStore((state) => state.mode)
  const request = Hooks.useRequest(porto)

  return (
    <Screen
      name={location.pathname + (request?.id ?? '') + String(Boolean(loading))}
      onContentHeight={(height) => {
        if (mode === 'iframe')
          porto.messenger.send('__internal', {
            height: height + 35,
            type: 'resize',
          })
      }}
      showLoaderAfter={0}
    >
      {loading ? <IndeterminateLoader title={loadingTitle ?? ''} /> : children}
    </Screen>
  )
}

export namespace DialogScreen {
  export type Props = {
    children: React.ReactNode
    loading?: boolean
    loadingTitle?: string
  }
}

import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

const UiContext = createContext<null | Ui.Context>(null)

export function Ui({ assetsBaseUrl = '/ui', children }: Ui.Props) {
  return (
    <UiContext.Provider
      value={{
        assetsBaseUrl,
      }}
    >
      {children}
    </UiContext.Provider>
  )
}

export namespace Ui {
  export interface Props {
    assetsBaseUrl?: string
    children: ReactNode
  }

  export type Context = {
    assetsBaseUrl: string
  }

  export function useUi(optional: true): Ui.Context | null
  export function useUi(optional?: false): Ui.Context
  export function useUi(optional?: boolean): Ui.Context | null {
    const context = useContext(UiContext)
    if (!context && !optional)
      throw new Error('useUi must be used within a Ui context')
    return useContext(UiContext)
  }
}

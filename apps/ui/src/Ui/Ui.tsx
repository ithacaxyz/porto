import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion.js'

const UiContext = createContext<null | Ui.Context>(null)

export function Ui({ children, reducedMotion }: Ui.Props) {
  const autoReducedMotion = useReducedMotion()
  return (
    <UiContext.Provider
      value={{
        reducedMotion: reducedMotion ?? autoReducedMotion,
      }}
    >
      {children}
    </UiContext.Provider>
  )
}

export namespace Ui {
  export interface Props {
    children: ReactNode
    reducedMotion?: boolean
  }

  export type Context = {
    reducedMotion: boolean
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

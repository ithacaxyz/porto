import * as React from 'react'
import { ModeType, modes, porto } from '~/lib/Wagmi'

export function usePorto({ mode }: { mode: ModeType }) {
  React.useEffect(() => porto._internal.setMode(modes[mode]), [mode])

  return { porto }
}

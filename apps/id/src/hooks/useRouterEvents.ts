import { type RouterEvents, useRouter } from '@tanstack/react-router'
import * as React from 'react'

export function useRouterEvent<T extends keyof RouterEvents>(
  type: T,
  handler: (event: RouterEvents[T]) => void,
) {
  const router = useRouter()
  React.useEffect(
    () => router.subscribe(type, handler),
    [router, type, handler],
  )
}

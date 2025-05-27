import {
  waitFor as rtl_waitFor,
  type waitForOptions,
} from '@testing-library/react'
import { type Locator, page } from '@vitest/browser/context'
import * as React from 'react'
import { renderHook } from 'vitest-browser-react'
import type {
  RenderHookOptions,
  RenderHookResult,
} from 'vitest-browser-react/pure'

import { Dialog, Mode, Porto } from '../src/index.js'

export const porto = Porto.create({
  mode: Mode.dialog({
    host: 'http://localhost:5174/dialog/',
    renderer: Dialog.iframe({
      skipProtocolCheck: true,
    }),
  }),
})

export function run<result>(
  action: (options: { getIframe: () => Locator }) => Promise<result>,
  options: RenderHookOptions<unknown> = {},
): RenderHookResult<
  { error: Error | undefined; result: result | undefined },
  unknown
> {
  function useTestHook() {
    const [result, setResult] = React.useState<result>()
    const [error, setError] = React.useState<Error>()
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    React.useEffect(() => {
      action({
        getIframe: () => page.frameLocator(page.getByTestId('porto')),
      })
        .then(setResult)
        .catch(setError)
    }, [])
    return { error, result } as {
      error: Error | undefined
      result: result | undefined
    }
  }
  return renderHook(useTestHook, options)
}

export function waitFor<type>(
  callback: () => Promise<type> | type,
  options?: waitForOptions | undefined,
): Promise<type> {
  return rtl_waitFor(callback, { timeout: 10_000, ...options })
}

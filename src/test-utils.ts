import {
  type RenderHookOptions,
  type RenderHookResult,
  renderHook as rtl_renderHook,
  waitFor as rtl_waitFor,
  type waitForOptions,
} from '@testing-library/react'
import * as React from 'react'
import { http, type Chain } from 'viem'

import { Chains, Porto } from './index.js'

const odysseyTestnet = {
  ...Chains.odysseyTestnet,
  rpcUrls: {
    default: {
      http: ['https://anvil.porto.localhost'],
      webSocket: ['wss://anvil.porto.localhost'],
    },
    public: {
      http: ['https://anvil.porto.localhost'],
      webSocket: ['wss://anvil.porto.localhost'],
    },
  },
} as const satisfies Chain

export function getPorto() {
  return Porto.create({
    chains: [odysseyTestnet],
    transports: {
      [odysseyTestnet.id]: http(),
    },
    storage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    },
  })
}

export function waitFor<type>(
  callback: () => Promise<type> | type,
  options?: waitForOptions | undefined,
): Promise<type> {
  return rtl_waitFor(callback, { timeout: 10_000, ...options })
}

export function run<result, props>(
  action: (props: props) => Promise<result>,
  options: Omit<RenderHookOptions<props>, 'wrapper'> & { name: string },
): RenderHookResult<
  { error: Error | undefined; result: result | undefined },
  props
> {
  function useTestHook(props: props) {
    const [result, setResult] = React.useState<result>()
    const [error, setError] = React.useState<Error>()
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    React.useEffect(() => {
      action(props).then(setResult).catch(setError)
    }, [])
    return { error, result } as {
      error: Error | undefined
      result: result | undefined
    }
  }

  const style = `
:root {
  background-color: light-dark(#fff, #141414);
  color: light-dark(#141414, #fff);
  color-scheme: light dark;
}
h1 { font-size: 20px; }
`
  return rtl_renderHook(useTestHook, {
    ...options,
    wrapper(props) {
      return React.createElement(
        'div',
        null,
        React.createElement('style', null, style),
        React.createElement('h1', null, options.name),
        props.children as React.ReactNode,
      )
    },
  })
}

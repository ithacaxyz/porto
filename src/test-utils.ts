import { http, type Chain } from 'viem'
import * as React from 'react'
import {
  renderHook as rtl_renderHook,
  waitFor as rtl_waitFor,
  type RenderHookOptions,
  type RenderHookResult,
  type waitForOptions,
} from '@testing-library/react'

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
): RenderHookResult<result, props> {
  function useTestHook(props: props) {
    const { setData } = React.useContext(context)
    const [result, setResult] = React.useState<result | null>(null)
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    React.useEffect(() => {
      action(props).then((res) => {
        setResult(res)
        setData(res)
      })
    }, [])
    return result as result
  }

  const context = React.createContext<{
    data: unknown
    setData: React.Dispatch<unknown>
  }>({ data: null, setData: () => {} })
  function Provider(props: React.PropsWithChildren) {
    const [data, setData] = React.useState<unknown>()
    return React.createElement(
      context.Provider,
      { value: { data, setData } },
      props.children,
    )
  }
  function Content(props: React.PropsWithChildren) {
    const { data } = React.useContext(context)
    return React.createElement(
      'div',
      null,
      React.createElement('h1', null, options.name),
      React.createElement('pre', null, JSON.stringify(data, null, 2)),
      props.children,
    )
  }

  const style = `
:root {
  background-color: light-dark(#f8f8f8, #191919);
  color: light-dark(#191919, #f8f8f8);
  color-scheme: light dark;
}
html {
  font-size: 16px;
  font-family: monospace;
}
body { padding: 1rem; }
h1 { font-size: 1rem; }
pre {
  font-size: 0.85rem; 
  white-space: pre-wrap;
}
`
  return rtl_renderHook(useTestHook, {
    ...options,
    wrapper(props) {
      return React.createElement(
        Provider,
        null,
        React.createElement('style', null, style),
        React.createElement(Content, null, props.children),
      )
    },
  })
}

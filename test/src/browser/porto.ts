import { type Chains, Dialog, Mode, Porto } from 'porto'
import { getChain } from '../chains.js'

const chain = getChain(import.meta.env.VITE_DEFAULT_ENV!)

export const getPorto = () =>
  Porto.create({
    chains: [chain] as readonly [Chains.Chain, ...Chains.Chain[]],
    feeToken: 'EXP',
    mode: Mode.dialog({
      host: 'http://localhost:5175/dialog/',
      renderer: Dialog.iframe({
        skipProtocolCheck: true,
        skipUnsupported: true,
      }),
    }),
  })

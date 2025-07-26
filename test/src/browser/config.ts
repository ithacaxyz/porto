import { type Chains, Dialog, Mode, Porto } from 'porto'
import { getChains } from '../chains.js'

const chains = getChains(import.meta.env.VITE_DEFAULT_ENV)

export const getPorto = () =>
  Porto.create({
    chains: chains as readonly [Chains.Chain, ...Chains.Chain[]],
    feeToken: 'EXP',
    mode: Mode.dialog({
      host: 'http://localhost:5175/dialog/',
      renderer: Dialog.iframe({
        skipProtocolCheck: true,
        skipUnsupported: true,
      }),
    }),
  })

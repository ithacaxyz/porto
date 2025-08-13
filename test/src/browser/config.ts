import { type Chains, Dialog, Mode, Porto, Transport } from 'porto'
import { http } from 'viem'
import { getChains } from '../chains.js'

const env = import.meta.env.VITE_DEFAULT_ENV
const chains = getChains(env)

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
    relay: http(
      Transport.relayUrls[env as keyof typeof Transport.relayUrls].http,
    ),
  })

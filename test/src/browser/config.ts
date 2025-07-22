import { type Chains, Dialog, Mode, Porto } from 'porto'
import { getChains } from '../chains.js'

<<<<<<< HEAD:test/src/browser/config.ts
const chains = getChains(import.meta.env.VITE_DEFAULT_ENV)
||||||| parent of 39b82d78 (feat: relay v15 (#604)):test/src/browser/porto.ts
const chain =
  import.meta.env.VITE_LOCAL !== 'false' ? Chains.anvil : Chains.portoDev
=======
const chain =
  import.meta.env.VITE_LOCAL !== 'false'
    ? Chains.anvilParos
    : Chains.portoDevParos
>>>>>>> 39b82d78 (feat: relay v15 (#604)):test/src/browser/porto.ts

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

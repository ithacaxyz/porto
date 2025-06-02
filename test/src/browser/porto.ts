import { Chains, Dialog, Mode, Porto } from 'porto'

const chain =
  import.meta.env.VITE_LOCAL !== 'false' ? Chains.anvil : Chains.portoDev

export const getPorto = () =>
  Porto.create({
    chains: [chain] as readonly [Chains.Chain, ...Chains.Chain[]],
    mode: Mode.dialog({
      host: 'http://localhost:5175/dialog/',
      renderer: Dialog.iframe({
        skipProtocolCheck: true,
        skipUnsupported: true,
      }),
    }),
  })

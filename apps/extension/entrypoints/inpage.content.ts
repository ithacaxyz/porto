import { Chains, Dialog, Mode, Porto } from 'porto'
import { fallback, http } from 'viem'

const relayMethods = [
  'wallet_feeTokens',
  'wallet_getAccounts',
  'wallet_getCapabilities',
  'wallet_getAssets',
  'wallet_getCallsStatus',
  'wallet_getKeys',
  'wallet_prepareCalls',
  'wallet_prepareUpgradeAccount',
  'wallet_sendPreparedCalls',
  'wallet_upgradeAccount',
  'wallet_verifySignature',
]

const defaultConfigs = {
  prod: {
    transports: {
      [Chains.base.id]: fallback([
        http('https://base-mainnet.rpc.ithaca.xyz'),
        http('https://mainnet.base.org', {
          methods: {
            exclude: relayMethods,
          },
        }),
      ]),
    },
  },
  stg: {
    transports: {
      [Chains.baseSepolia.id]: fallback([
        http('https://base-sepolia.rpc.ithaca.xyz'),
        http('https://sepolia.base.org', {
          methods: {
            exclude: relayMethods,
          },
        }),
      ]),
      [Chains.optimismSepolia.id]: fallback([
        http('https://optimism-sepolia.rpc.ithaca.xyz'),
        http('https://sepolia.optimism.io', {
          methods: {
            exclude: relayMethods,
          },
        }),
      ]),
    },
  },
} as const

export default defineContentScript({
  main() {
    let porto: Porto.Porto | undefined
    function init(prod?: boolean) {
      porto = prod
        ? Porto.unstable_create(defaultConfigs.prod)
        : Porto.create(defaultConfigs.stg)
      ;(window as any).ethereum = porto.provider
    }

    window.addEventListener('message', (event) => {
      if (event.data.event !== 'init') return
      init(event.data.payload.env === 'prod')
    })

    window.addEventListener('message', (event) => {
      if (event.data.event !== 'trigger-reload') return
      window.location.reload()
    })

    document.addEventListener('securitypolicyviolation', (event) => {
      if (!event.blockedURI.includes('porto.sh')) return

      const mode = porto?._internal.getMode() as ReturnType<typeof Mode.dialog>

      porto?._internal.setMode(
        Mode.dialog({
          host: mode.config.host,
          renderer: Dialog.popup(),
        }),
      )
    })
  },
  matches: ['https://*/*', 'http://localhost/*'],
  runAt: 'document_end',
  world: 'MAIN',
})

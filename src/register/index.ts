import type { ValueOf } from 'viem'
import type * as Rpc from '../core/internal/schema/rpc.js'

declare module 'viem' {
  interface Register {
    // biome-ignore lint/suspicious/noTsIgnore: _
    // @ts-ignore
    CapabilitiesSchema: {
      getCapabilities: {
        ReturnType: ValueOf<Rpc.wallet_getCapabilities.Response_encoded>
      }
      sendCalls: {
        Request: Rpc.wallet_sendCalls.Capabilities_encoded
      }
    }
  }
}

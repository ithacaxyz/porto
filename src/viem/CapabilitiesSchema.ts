import type { ValueOf } from 'viem'
import type * as Rpc from '../core/internal/schema/rpc.js'

export type CapabilitiesSchema = {
  connect: {
    Request: Pick<Rpc.wallet_connect.Capabilities, 'grantPermissions'>
    Response: Pick<Rpc.wallet_connect.ResponseCapabilities, 'permissions'>
  }
  getCapabilities: {
    Response: ValueOf<Rpc.wallet_getCapabilities.Response>
  }
  sendCalls: {
    Request: Pick<
      Rpc.wallet_prepareCalls.Capabilities,
      'feeToken' | 'permissions' | 'merchantUrl'
    >
  }
}

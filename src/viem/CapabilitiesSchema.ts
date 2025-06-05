import * as Type from '@sinclair/typebox/type'
import type { ValueOf } from 'viem'
import * as Rpc from '../core/internal/typebox/rpc.js'

export type CapabilitiesSchema = {
  connect: {
    Request: Pick<
      Type.StaticDecode<typeof Rpc.wallet_connect.Capabilities>,
      'grantPermissions'
    >
    Response: Pick<
      Type.StaticDecode<typeof Rpc.wallet_connect.ResponseCapabilities>,
      'permissions'
    >
  }
  getCapabilities: {
    Response: ValueOf<
      Type.StaticDecode<typeof Rpc.wallet_getCapabilities.Response>
    >
  }
  sendCalls: {
    Request: Pick<
      Type.StaticDecode<typeof Rpc.wallet_prepareCalls.Capabilities>,
      'feeToken' | 'permissions' | 'sponsorUrl'
    >
  }
}

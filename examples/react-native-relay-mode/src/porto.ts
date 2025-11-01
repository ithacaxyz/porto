import AsyncStorage from '@react-native-async-storage/async-storage'
import { Hex, Json, Value } from 'ox'
import { Mode, Porto, type Storage as PortoStorage } from 'porto'

import { baseSepolia } from 'porto/core/Chains'
import { RelayClient } from 'porto/viem'

import { exp1Address, exp2Address } from './contracts'
import { rp, webAuthn } from './passkeys'

type MaybePromise<T> = T | Promise<T>

const storage: PortoStorage = {
  // @ts-expect-error - async
  getItem: (name: string) =>
    AsyncStorage.getItem(name) as unknown as MaybePromise<string | null>,
  removeItem: (name: string) => AsyncStorage.removeItem(name),
  setItem: (name: string, value: unknown) =>
    AsyncStorage.setItem(name, Json.stringify(value)),
  sizeLimit: 1024 * 1024 * 5, // ≈5MB
}

export const porto = Porto.create({
  chains: [baseSepolia],
  mode: Mode.relay({ keystoreHost: rp.id, webAuthn }),
  storage,
})

export const client = RelayClient.fromPorto(porto, { chainId: baseSepolia.id })

export const permissions = () =>
  ({
    expiry: Math.floor(Date.now() / 1_000) + 60 * 60, // 1 hour
    feeToken: {
      limit: '10',
      symbol: 'EXP',
    },
    permissions: {
      calls: [
        { to: exp1Address },
        { to: exp2Address },
        {
          signature: 'mint()',
          to: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
        },
      ],
      spend: [
        {
          limit: Hex.fromNumber(Value.fromEther('500')),
          period: 'minute',
          token: exp1Address,
        },
      ],
    },
  }) as const

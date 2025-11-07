import * as ExpoCrypto from 'expo-crypto'
import { isReactNative } from '../core/react-native/utils.js'

const shouldPolyfillCrypto =
  isReactNative() &&
  typeof globalThis !== 'undefined' &&
  !('crypto' in globalThis)

if (shouldPolyfillCrypto)
  Object.defineProperty(globalThis, 'crypto', {
    enumerable: true,
    value: {
      digest: (algorithm, message) => ExpoCrypto.digest(algorithm, message),
      getRandomValues: (array) => ExpoCrypto.getRandomValues(array),
      randomUUID: () => ExpoCrypto.randomUUID(),
    } satisfies {
      digest: (
        algorithm: ExpoCrypto.CryptoDigestAlgorithm,
        message: BufferSource,
      ) => Promise<ArrayBuffer>
      randomUUID: () => string
      getRandomValues: (array: Uint8Array) => Uint8Array
    },
  })

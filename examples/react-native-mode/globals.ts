import * as ExpoCrypto from 'expo-crypto'

interface TypedCrypto {
  digest: (
    algorithm: ExpoCrypto.CryptoDigestAlgorithm,
    message: BufferSource,
  ) => Promise<ArrayBuffer>
  randomUUID: () => string
  getRandomValues: (array: Uint8Array) => Uint8Array
}

const globalCrypto = {
  digest: (algorithm, message) => ExpoCrypto.digest(algorithm, message),
  getRandomValues: (array) => ExpoCrypto.getRandomValues(array),
  randomUUID: () => ExpoCrypto.randomUUID(),
} satisfies TypedCrypto

Object.defineProperty(globalThis, 'crypto', {
  enumerable: true,
  value: globalCrypto,
})

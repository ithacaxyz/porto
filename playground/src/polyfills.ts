import { Buffer } from 'node:buffer'

globalThis.Buffer ??= Buffer // https://github.com/AztecProtocol/aztec-packages/issues/10477
// @ts-expect-error
globalThis.process ??= { env: {} } // https://github.com/AztecProtocol/aztec-packages/issues/8881

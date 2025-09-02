import { betterAuth } from 'better-auth'
import { siwe } from 'better-auth/plugins'
import type { Kysely } from 'kysely'
import { Porto } from 'porto'
import { RelayClient } from 'porto/viem'
import {
  generateSiweNonce,
  parseSiweMessage,
  verifySiweMessage,
} from 'viem/siwe'

const porto = Porto.create()

export async function createAuth(options: {
  db: Kysely<unknown>
  domain?: string | undefined
}) {
  const { db, domain } = options

  return betterAuth({
    database: {
      db,
      type: 'sqlite',
    },
    plugins: [
      siwe({
        domain: domain ?? '',
        async getNonce() {
          return generateSiweNonce()
        },
        async verifyMessage({ address, chainId, message, signature }) {
          const client = RelayClient.fromPorto(porto, { chainId })
          const siweMessage = parseSiweMessage(message)
          return await verifySiweMessage(client, {
            address: address as `0x${string}`,
            message: siweMessage,
            signature: signature as `0x${string}`,
          })
        },
      }),
    ],
  })
}

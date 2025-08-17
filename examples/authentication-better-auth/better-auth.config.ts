import { betterAuth } from 'better-auth'
import { siwe } from 'better-auth/plugins'
import type { Kysely } from 'kysely'
import { Porto } from 'porto'
import { RelayActions, RelayClient } from 'porto/viem'
import { hashMessage } from 'viem'
import { generateSiweNonce } from 'viem/siwe'

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
          const { valid } = await RelayActions.verifySignature(client, {
            address: address as `0x${string}`,
            digest: hashMessage(message),
            signature: signature as `0x${string}`,
          })
          return valid
        },
      }),
    ],
  })
}

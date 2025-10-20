import { useLogin, usePrivy, useWallets } from '@privy-io/react-auth'
import { type Address, Hex, Secp256k1, Signature } from 'ox'
import { Account } from 'porto/viem'
import * as React from 'react'
import { encodeFunctionData } from 'viem'
import { baseSepolia } from 'viem/chains'

import { permissions, porto } from './config.ts'
import { expNftAbi, expNftAddress } from './contracts.ts'

export function App() {
  const privy = usePrivy()

  const [errors, setErrors] = React.useState<
    Record<string, string | undefined>
  >({})

  const [_eoaSignature, setEoaSignature] = React.useState<Hex.Hex | null>(null)

  const { login: loginWithPrivy } = useLogin({
    onComplete: (params) => console.info('[login] complete', params),
    onError: (error) => {
      console.error('[login] error', error)
      setErrors((errors) => ({
        ...errors,
        login: error,
      }))
    },
  })

  const { wallets } = useWallets()
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === 'privy',
  )

  const [txHashes, setTxHashes] = React.useState<ReadonlyArray<Hex.Hex>>([])
  const [account, setAccount] =
    React.useState<Account.Account<'privateKey'> | null>(null)
  const [upgradedAccount, setUpgradedAccount] =
    React.useState<Account.Account<'privateKey'> | null>(null)

  if (!privy.ready) return <>Loading...</>

  return (
    <main style={{ fontFamily: 'monospace' }}>
      <h1>Porto x Privy Embedded Wallet (client-side)</h1>
      <section>
        <pre>
          {JSON.stringify(
            {
              accounts: {
                porto: { account, errors, upgradedAccount },
                privy: { account, embeddedWallet, wallets },
              },
              errors,
              transactions: {
                mint: {
                  txHashes,
                },
              },
            },
            undefined,
            2,
          )}
        </pre>
      </section>
      <div>
        <h2>Authenticate</h2>
        <button
          disabled={!privy.ready || !privy.authenticated}
          onClick={() =>
            loginWithPrivy({
              loginMethods: ['passkey', 'wallet', 'email', 'farcaster'],
              walletChainType: 'ethereum-only',
            })
          }
          type="button"
        >
          Login with Privy
        </button>
      </div>
      <div>
        <h2>embeddedWallet</h2>
        <pre>{JSON.stringify(embeddedWallet, undefined, 2)}</pre>
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => {
            if (!embeddedWallet) {
              setErrors((errors) => ({
                ...errors,
                createPortoAccount: 'No embedded wallet found',
              }))
              return
            }

            const account = Account.from({
              address: embeddedWallet.address as Address.Address,
              sign: async (parameters) => {
                const provider = await embeddedWallet.getEthereumProvider()
                const signature = await provider.request({
                  method: 'secp256k1_sign',
                  params: [parameters.hash],
                })

                Hex.assert(signature)
                setEoaSignature(signature)
                return signature
              },
            })
            console.info('[createAccount] account', account)
            setAccount(account)
          }}
          type="button"
        >
          Create Porto Account
        </button>

        <button
          onClick={async () => {
            if (!account) return
            console.info('[prepareUpgradeAccount] account', account)
            const { context, digests } = await porto.provider.request({
              method: 'wallet_prepareUpgradeAccount',
              params: [
                {
                  address: account.address,
                  capabilities: {
                    grantPermissions: permissions(),
                  },
                },
              ],
            })
            console.info('[prepareUpgradeAccount] context', context)
            console.info('[prepareUpgradeAccount] digests', digests)

            const signatures = {
              auth: await account.sign({ hash: digests.auth }),
              exec: await account.sign({ hash: digests.exec }),
            }
            console.info('[Account.sign] signatures', signatures)
            setEoaSignature(signatures.auth)

            const upgradedAccount = await porto.provider.request({
              method: 'wallet_upgradeAccount',
              params: [{ context, signatures }],
            })
            console.info('[upgradeAccount] upgradedAccount', upgradedAccount)
            // @ts-expect-error
            setUpgradedAccount(upgradedAccount)
          }}
          type="button"
        >
          Upgrade Porto Account (7702)
        </button>
      </div>
      <section>
        <h2>7702 Actions</h2>
        <div>
          <h3>Mint NFT using prepareCalls + sendPreparedCalls</h3>
          <button
            onClick={async () => {
              if (!account || !account.address) return

              const adminKey = account.keys?.find((key) => key.role === 'admin')
              if (!adminKey)
                return setErrors((errors) => ({
                  ...errors,
                  adminKey: 'No admin key found',
                }))

              Hex.assert(adminKey.publicKey)

              const { digest, ...request } = await porto.provider.request({
                method: 'wallet_prepareCalls',
                params: [
                  {
                    calls: [
                      {
                        data: encodeFunctionData({
                          abi: expNftAbi,
                          args: [account.address],
                          functionName: 'mint',
                        }),
                        to: expNftAddress[baseSepolia.id] as Address.Address,
                      },
                    ],
                    chainId: Hex.fromNumber(baseSepolia.id),
                    key: { publicKey: adminKey.publicKey, type: 'secp256k1' },
                  },
                ],
              })

              console.info('[prepareCalls] request', request)

              if (!request)
                return setErrors((errors) => ({
                  ...errors,
                  mintNft: 'No request found',
                }))

              const signature = Signature.toHex(
                Secp256k1.sign({
                  payload: digest,
                  privateKey: Hex.toBytes(adminKey.privateKey as `0x${string}`),
                }),
              )

              console.info('[Account.sign] signature', signature)

              const results = await porto.provider.request({
                method: 'wallet_sendPreparedCalls',
                params: [{ ...request, signature }],
              })

              console.info('[wallet_sendPreparedCalls] results', results)

              const statuses = await Promise.all(
                results.map(({ id }) =>
                  porto.provider.request({
                    method: 'wallet_getCallsStatus',
                    params: [id],
                  }),
                ),
              )

              console.info('[wallet_getCallsStatus] statuses', statuses)

              const hashes = statuses
                .map((status) => status.receipts?.at(0)?.transactionHash)
                .filter(Boolean)

              console.info('[getCallsStatus] hashes', hashes)
              setTxHashes(hashes)
            }}
            type="button"
          >
            prepareCalls + sendPreparedCalls
          </button>
        </div>
      </section>
    </main>
  )
}

import { PortoConfig } from '@porto/apps'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import * as Bytes from 'ox/Bytes'
import * as Hex from 'ox/Hex'
import * as PublicKey from 'ox/PublicKey'
import * as WebAuthnP256 from 'ox/WebAuthnP256'
import { Account, ContractActions, Key } from 'porto/viem'
import * as React from 'react'
import {
  type Address,
  type Chain,
  createPublicClient,
  createWalletClient,
  custom,
  decodeAbiParameters,
  decodeFunctionData,
  type EIP1193Provider,
  encodeFunctionData,
  erc20Abi,
  formatUnits,
  getAddress,
  type Hex as Hex_v,
  http,
  isAddress,
  isHex,
  parseAbi,
  parseAbiParameters,
  parseUnits,
  type SignedAuthorization,
  withRetry,
  zeroAddress,
} from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { base } from 'viem/chains'
import { estimateL1Fee } from 'viem/op-stack'
import { recoverAuthorizationAddress } from 'viem/utils'
import {
  type Connector,
  useAccount,
  useConnect,
  useConnectors,
  useDisconnect,
  useSwitchChain,
} from 'wagmi'
import { mipdConfig } from '~/lib/Wagmi'

export const Route = createFileRoute('/recover')({
  component: RouteComponent,
  head: () => ({
    meta: [
      { title: 'Recover Porto funds' },
      {
        content:
          'Transfer funds from a Porto account without using the Porto Relay.',
        name: 'description',
      },
    ],
  }),
})

const config = PortoConfig.getConfig()
const balanceRefetchInterval = 30_000
const inspectionRefetchInterval = 60_000
// Current and legacy production Orchestrators returned by
// `wallet_getCapabilities`. Initialization payloads may target either version.
const initializationOrchestrators = [
  getAddress('0x36a7cd5b1f475122a2b52580fc8e170a2cd312ef'),
  getAddress('0x52c5fc90c7841778acf3c2a5de1f97de4e8fba92'),
]
const executePreCallsAbi = parseAbi([
  'function executePreCalls(address parentEOA, (address eoa, bytes executionData, uint256 nonce, bytes signature)[] preCalls)',
])
const executionCallsParameters = parseAbiParameters(
  '(address to, uint256 value, bytes data)[] calls',
)

type TokenDefinition = {
  addresses: Partial<Record<number, Address>>
  name: string
  symbol: string
}

// USDC is vendored from viem's token definitions. USDT is sourced from Tether
// and the canonical chain token lists. Only addresses for chains supported by
// Porto are included.
const tokenDefinitions: readonly TokenDefinition[] = [
  {
    addresses: {
      1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      10: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
      137: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
      8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
      42220: '0xcebA9300f2b948710d2653dD7B07f33A8B32118C',
      84532: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
      421614: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d',
      11155111: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      11155420: '0x5fd84259d66Cd46123540766Be93DFE6D43130D7',
    },
    name: 'USD Coin',
    symbol: 'USDC',
  },
  {
    addresses: {
      1: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      10: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58',
      56: '0x55d398326f99059fF775485246999027B3197955',
      100: '0x4ECaBa5870353805a9F068101A40E0f32ed605C6',
      8453: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2',
      42220: '0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e',
    },
    name: 'Tether USD',
    symbol: 'USDT',
  },
]

type Asset = {
  address?: Address | undefined
  balance: bigint
  decimals: number
  symbol: string
  type: 'native' | 'erc20'
}

type Discovery = {
  address: Address
  assertion: Pick<WebAuthnP256.sign.ReturnType, 'metadata' | 'signature'>
  challenge: Hex_v
  credentialId: string
}

type ReadyAccount = {
  account: Account.Account
  address: Address
  delegation: Address
  key: Key.WebAuthnKey
  version: string
}

type InitializationPayload = {
  authorization: SignedAuthorization
  data: Hex_v
  to: Address
}

type Busy = 'discover' | 'import' | 'initialize' | 'inspect' | 'submit' | null
type RecoveryError = {
  message: string
  step: 1 | 2 | 3 | 4 | 5
  supportUrl?: string | undefined
}
type InspectionState = {
  error: RecoveryError | null
  needsInitialization: boolean
  readyAccount: ReadyAccount | null
}

function RouteComponent() {
  const externalWallet = useAccount({ config: mipdConfig })
  const discoveredConnectors = useConnectors({ config: mipdConfig })
  const connectors = React.useMemo(
    () =>
      discoveredConnectors.filter(
        (connector) => !connector.id.toLowerCase().includes('porto'),
      ),
    [discoveredConnectors],
  )
  const connect = useConnect({ config: mipdConfig })
  const disconnect = useDisconnect({ config: mipdConfig })
  const switchChain = useSwitchChain({ config: mipdConfig })

  const [chainId, setChainId] = React.useState<number>(base.id)
  const [assetType, setAssetType] = React.useState<Asset['type']>('native')
  const [tokenAddress, setTokenAddress] = React.useState('')
  const [amount, setAmount] = React.useState('')
  const [destination, setDestination] = React.useState('')
  const [discovery, setDiscovery] = React.useState<Discovery | null>(null)
  const [readyAccount, setReadyAccount] = React.useState<ReadyAccount | null>(
    null,
  )
  const [busy, setBusy] = React.useState<Busy>(null)
  const [error, setError] = React.useState<RecoveryError | null>(null)
  const [transactionHash, setTransactionHash] = React.useState<Hex_v | null>(
    null,
  )
  const [needsInitialization, setNeedsInitialization] = React.useState(false)
  const [initializationInput, setInitializationInput] = React.useState('')
  const [initializationPayload, setInitializationPayload] =
    React.useState<InitializationPayload | null>(null)
  const [initializationError, setInitializationError] = React.useState<
    string | null
  >(null)
  const [initializationHash, setInitializationHash] =
    React.useState<Hex_v | null>(null)
  const [initializationFundingHash, setInitializationFundingHash] =
    React.useState<Hex_v | null>(null)
  const [initializationRefundHash, setInitializationRefundHash] =
    React.useState<Hex_v | null>(null)
  const previousGasWalletAddress = React.useRef<Address | undefined>(undefined)
  const inspectionVersion = React.useRef(0)
  const inspectionCache = React.useRef(new Map<string, InspectionState>())

  const chain = config.chains.find((chain) => chain.id === chainId)!
  const availableTokens = tokenDefinitions.flatMap((token) => {
    const address = token.addresses[chain.id]
    return address ? [{ address, name: token.name, symbol: token.symbol }] : []
  })
  const walletBusy =
    connect.isPending || disconnect.isPending || switchChain.isPending
  const gasWalletConnected = Boolean(
    externalWallet.address && externalWallet.connector,
  )
  const temporaryExecutorDescription = externalWallet.connector?.id.startsWith(
    'io.metamask',
  )
    ? 'MetaMask does not support EIP-7702 authorization transactions from websites, so it will briefly fund a temporary account to submit the transaction. Unused gas is returned automatically.'
    : `${externalWallet.connector?.name ?? 'Your gas wallet'} may not support submitting EIP-7702 authorization transactions directly, so it will briefly fund a temporary account to submit the transaction. Unused gas is returned automatically.`
  const validTokenAddress =
    assetType === 'erc20' && isAddress(tokenAddress)
      ? getAddress(tokenAddress)
      : undefined
  const selectedToken = availableTokens.find(
    (token) => token.address.toLowerCase() === validTokenAddress?.toLowerCase(),
  )
  const assetQuery = useQuery({
    enabled: Boolean(
      gasWalletConnected &&
        readyAccount &&
        (assetType === 'native' || validTokenAddress),
    ),
    queryFn: () =>
      loadAsset(
        getPublicClient(chain),
        chain,
        readyAccount!.address,
        assetType,
        validTokenAddress,
      ),
    queryKey: [
      'recoverAsset',
      chain.id,
      readyAccount?.address,
      assetType,
      validTokenAddress,
    ],
    refetchInterval: balanceRefetchInterval,
  })
  const asset = assetQuery.data ?? null
  const assetBalance = asset?.balance
  const assetDecimals = asset?.decimals
  const formattedAssetBalance =
    assetBalance === undefined || assetDecimals === undefined
      ? ''
      : formatUnits(assetBalance, assetDecimals)
  const isMaxAmount = (() => {
    if (!asset) return false
    try {
      return parseUnits(amount, asset.decimals) === asset.balance
    } catch {
      return false
    }
  })()
  const usesConnectedAddress =
    !!externalWallet.address &&
    externalWallet.address.toLowerCase() === destination.toLowerCase()
  const mainnetChains = config.chains.filter((chain) => !chain.testnet)
  const testnetChains = config.chains.filter((chain) => chain.testnet)

  React.useEffect(() => {
    setAmount(formattedAssetBalance)
  }, [formattedAssetBalance])

  React.useEffect(() => {
    const address = externalWallet.address
    if (!address) return

    setDestination((destination) => {
      if (
        destination &&
        destination.toLowerCase() !==
          previousGasWalletAddress.current?.toLowerCase()
      )
        return destination
      return address
    })
    previousGasWalletAddress.current = address
  }, [externalWallet.address])

  const resetInitialization = () => {
    setNeedsInitialization(false)
    setInitializationInput('')
    setInitializationPayload(null)
    setInitializationError(null)
    setInitializationHash(null)
    setInitializationFundingHash(null)
    setInitializationRefundHash(null)
  }

  const resetChainState = (nextChainId: number) => {
    inspectionVersion.current += 1
    const cached = discovery
      ? inspectionCache.current.get(
          getInspectionCacheKey(discovery, nextChainId),
        )
      : undefined
    setChainId(nextChainId)
    setTransactionHash(null)
    resetInitialization()
    setAssetType('native')
    setReadyAccount(cached?.readyAccount ?? null)
    setNeedsInitialization(cached?.needsInitialization ?? false)
    setError(cached?.error ?? null)
  }

  const inspect = React.useCallback(
    async (
      discovery: Discovery,
      chain: Chain,
      { background = false }: { background?: boolean } = {},
    ) => {
      const version = ++inspectionVersion.current
      const cacheKey = getInspectionCacheKey(discovery, chain.id)
      const shouldLog = !background || !inspectionCache.current.has(cacheKey)
      if (!background) {
        setBusy('inspect')
        setError((error) => (error?.step === 3 ? null : error))
        setReadyAccount(null)
      }
      if (shouldLog)
        logRecovery('account inspection started', {
          chainId: chain.id,
          chainName: chain.name,
          portoAccount: discovery.address,
        })

      try {
        const client = getPublicClient(chain)
        const code = await client.getCode({ address: discovery.address })
        if (version !== inspectionVersion.current) return false
        const delegation = parseDelegation(code)
        if (!delegation) {
          const inspectionError = {
            message: `Your Porto account is not delegated on ${chain.name}. The passkey cannot initialize an undelegated account without its original root key.`,
            step: 3,
            supportUrl: getSupportEmailUrl(discovery.address, chain),
          } satisfies RecoveryError
          if (shouldLog)
            logRecovery('account inspection completed', {
              chainId: chain.id,
              chainName: chain.name,
              delegated: false,
              portoAccount: discovery.address,
            })
          inspectionCache.current.set(cacheKey, {
            error: inspectionError,
            needsInitialization: true,
            readyAccount: null,
          })
          setReadyAccount(null)
          setNeedsInitialization(true)
          setError(inspectionError)
          return false
        }

        const [keyCount, domain] = await Promise.all([
          client.readContract({
            abi: ContractActions.abi,
            address: discovery.address,
            functionName: 'keyCount',
          }),
          ContractActions.getEip712Domain(client, {
            account: discovery.address,
          }),
        ])
        if (version !== inspectionVersion.current) return false

        const keys = await Promise.all(
          Array.from({ length: Number(keyCount) }, (_, index) =>
            ContractActions.keyAt(client, {
              account: discovery.address,
              index,
            }),
          ),
        )
        if (version !== inspectionVersion.current) return false

        const matchingKey = keys.find((key) => {
          if (key.type !== 'webauthn-p256' || key.role !== 'admin') return false
          if (key.expiry && key.expiry < Math.floor(Date.now() / 1_000))
            return false
          return WebAuthnP256.verify({
            challenge: discovery.challenge,
            metadata: discovery.assertion.metadata,
            publicKey: PublicKey.fromHex(key.publicKey),
            signature: discovery.assertion.signature,
          })
        })

        if (!matchingKey && keyCount === 0n) {
          const inspectionError = {
            message: `This account is delegated on ${chain.name}, but its admin key has not been initialized.`,
            step: 3,
            supportUrl: getSupportEmailUrl(discovery.address, chain),
          } satisfies RecoveryError
          if (shouldLog)
            logRecovery('account inspection completed', {
              chainId: chain.id,
              chainName: chain.name,
              delegated: true,
              delegation,
              keyCount: keyCount.toString(),
              matchingAdminKey: false,
              portoAccount: discovery.address,
            })
          inspectionCache.current.set(cacheKey, {
            error: inspectionError,
            needsInitialization: true,
            readyAccount: null,
          })
          setReadyAccount(null)
          setNeedsInitialization(true)
          setError(inspectionError)
          return false
        }

        if (!matchingKey) {
          const inspectionError = {
            message: `The selected passkey is not an active admin key for this account on ${chain.name}.`,
            step: 3,
          } satisfies RecoveryError
          if (shouldLog)
            logRecovery('account inspection completed', {
              chainId: chain.id,
              chainName: chain.name,
              delegated: true,
              delegation,
              keyCount: keyCount.toString(),
              matchingAdminKey: false,
              portoAccount: discovery.address,
            })
          inspectionCache.current.set(cacheKey, {
            error: inspectionError,
            needsInitialization: false,
            readyAccount: null,
          })
          setReadyAccount(null)
          setNeedsInitialization(false)
          setError(inspectionError)
          return false
        }

        const publicKey = PublicKey.fromHex(matchingKey.publicKey)
        const key = Key.fromWebAuthnP256({
          chainId: chain.id,
          credential: {
            id: discovery.credentialId,
            publicKey,
          },
          expiry: matchingKey.expiry,
          id: discovery.address,
          role: 'admin',
        })
        const account = Account.from({
          address: discovery.address,
          keys: [key],
        })
        const ready = {
          account,
          address: discovery.address,
          delegation,
          key,
          version: String(domain.version ?? 'unknown'),
        }

        inspectionCache.current.set(cacheKey, {
          error: null,
          needsInitialization: false,
          readyAccount: ready,
        })
        setReadyAccount(ready)
        if (!background) setAssetType('native')
        setNeedsInitialization(false)
        setError((error) => (error?.step === 3 ? null : error))
        if (shouldLog)
          logRecovery('account inspection completed', {
            chainId: chain.id,
            chainName: chain.name,
            delegated: true,
            delegation,
            keyCount: keyCount.toString(),
            matchingAdminKey: true,
            portoAccount: discovery.address,
          })
        return true
      } catch (error) {
        if (version !== inspectionVersion.current) return false
        if (shouldLog)
          logRecoveryError('account inspection failed', error, {
            chainId: chain.id,
            chainName: chain.name,
            portoAccount: discovery.address,
          })
        if (!background || !inspectionCache.current.has(cacheKey)) {
          setReadyAccount(null)
          setError({ message: getErrorMessage(error), step: 3 })
        }
        return false
      } finally {
        if (!background && version === inspectionVersion.current) setBusy(null)
      }
    },
    [],
  )

  React.useEffect(() => {
    if (!discovery) return

    void inspect(discovery, chain, { background: true })
    const interval = window.setInterval(
      () => void inspect(discovery, chain, { background: true }),
      inspectionRefetchInterval,
    )
    return () => {
      window.clearInterval(interval)
      inspectionVersion.current += 1
    }
  }, [chain, discovery, inspect])

  const discover = async () => {
    inspectionVersion.current += 1
    setBusy('discover')
    setError(null)
    setTransactionHash(null)

    try {
      if (!window.PublicKeyCredential)
        throw new Error('This browser does not support passkeys.')

      const challenge = Hex.random(32)
      const assertion = await WebAuthnP256.sign({
        challenge,
        userVerification: 'required',
      })
      const response = assertion.raw.response as AuthenticatorAssertionResponse
      if (!response.userHandle)
        throw new Error('The selected passkey does not contain an account ID.')

      const address = Bytes.toHex(new Uint8Array(response.userHandle))
      if (!isAddress(address))
        throw new Error('The selected passkey contains an invalid account ID.')

      const nextDiscovery = {
        address: getAddress(address),
        assertion: {
          metadata: assertion.metadata,
          signature: assertion.signature,
        },
        challenge,
        credentialId: assertion.raw.id,
      } satisfies Discovery
      const cached = inspectionCache.current.get(
        getInspectionCacheKey(nextDiscovery, chain.id),
      )

      setDiscovery(nextDiscovery)
      logRecovery('Porto account connected', {
        portoAccount: nextDiscovery.address,
      })
      resetInitialization()
      setAssetType('native')
      setReadyAccount(cached?.readyAccount ?? null)
      setNeedsInitialization(cached?.needsInitialization ?? false)
      setError(cached?.error ?? null)
      setBusy(null)
    } catch (error) {
      logRecoveryError('Porto account connection failed', error, {})
      setError({ message: getErrorMessage(error), step: 1 })
      setBusy(null)
      if (discovery) void inspect(discovery, chain, { background: true })
    }
  }

  const disconnectPortoAccount = () => {
    inspectionVersion.current += 1
    setDiscovery(null)
    setReadyAccount(null)
    resetInitialization()
    setAssetType('native')
    setError(null)
    setTransactionHash(null)
  }

  const connectWallet = async (connector: Connector) => {
    setError((error) => (error?.step === 2 ? null : error))
    setTransactionHash(null)

    try {
      if (externalWallet.connector)
        await disconnect.disconnectAsync({
          connector: externalWallet.connector,
        })

      const connection = await connect.connectAsync({ connector })
      logRecovery('gas wallet connected', {
        chainId: connection.chainId,
        connectorId: connector.id,
        connectorName: connector.name,
        gasWallet: connection.accounts[0],
      })
    } catch (error) {
      logRecoveryError('gas wallet connection failed', error, {
        chainId: chain.id,
        chainName: chain.name,
        connectorId: connector.id,
        connectorName: connector.name,
      })
      setError({ message: getErrorMessage(error), step: 2 })
    }
  }

  const disconnectWallet = async () => {
    setError((error) => (error?.step === 2 ? null : error))
    setTransactionHash(null)

    try {
      await disconnect.disconnectAsync({
        connector: externalWallet.connector,
      })
    } catch (error) {
      setError({ message: getErrorMessage(error), step: 2 })
    }
  }

  const importInitialization = async () => {
    if (!discovery) return

    setBusy('import')
    setInitializationError(null)
    setInitializationPayload(null)
    setInitializationHash(null)
    setInitializationFundingHash(null)
    setInitializationRefundHash(null)

    try {
      const payload = await validateInitializationPayload(
        initializationInput,
        discovery,
        chain,
      )
      setInitializationPayload(payload)
      logRecovery('initialization payload validated', {
        authorizationChainId: payload.authorization.chainId,
        authorizationContract: payload.authorization.address,
        authorizationNonce: payload.authorization.nonce,
        chainId: chain.id,
        chainName: chain.name,
        dataBytes: Hex.size(payload.data),
        portoAccount: discovery.address,
        target: payload.to,
      })
    } catch (error) {
      logRecoveryError('initialization payload validation failed', error, {
        chainId: chain.id,
        chainName: chain.name,
        portoAccount: discovery.address,
      })
      setInitializationError(getErrorMessage(error))
    } finally {
      setBusy(null)
    }
  }

  const initializeAccount = async () => {
    if (!discovery || !initializationPayload) return

    setBusy('initialize')
    setInitializationError(null)
    setInitializationHash(null)
    setInitializationFundingHash(null)
    setInitializationRefundHash(null)

    const debugContext = {
      chainId: chain.id,
      chainName: chain.name,
      connectorId: externalWallet.connector?.id,
      connectorName: externalWallet.connector?.name,
      gasWallet: externalWallet.address,
      portoAccount: discovery.address,
      walletChainId: externalWallet.chainId,
    }
    let stage = 'preflight'
    let submittedHash: Hex_v | undefined
    logRecovery('initialization started', debugContext)

    try {
      if (!externalWallet.address || !externalWallet.connector)
        throw new Error('Connect an external wallet to pay network gas.')
      if (externalWallet.chainId !== chain.id) {
        stage = 'switch wallet network'
        await switchChain.switchChainAsync({
          chainId: chain.id,
          connector: externalWallet.connector,
        })
      }

      stage = 'account preflight'
      const client = getPublicClient(chain)
      const code = await client.getCode({ address: discovery.address })
      const delegation = parseDelegation(code)
      if (code && code !== '0x' && !delegation)
        throw new Error(
          `The account has unexpected code on ${chain.name}. Initialization was stopped.`,
        )
      if (
        delegation &&
        delegation.toLowerCase() !==
          initializationPayload.authorization.address.toLowerCase()
      )
        throw new Error(
          `The account is delegated to a different contract on ${chain.name}.`,
        )
      if (!delegation)
        await assertAuthorizationNonce(
          client,
          discovery.address,
          initializationPayload.authorization.nonce,
        )

      const executor = {
        address: externalWallet.address,
        type: 'json-rpc',
      } as const
      if (executor.address.toLowerCase() === discovery.address.toLowerCase())
        throw new Error(
          'Choose a different external wallet to pay network gas.',
        )
      const executorBalance = await client.getBalance({
        address: executor.address,
      })
      if (executorBalance === 0n)
        throw new Error(
          `The external wallet needs ${chain.nativeCurrency.symbol} on ${chain.name} to pay gas.`,
        )

      const authorizationList = delegation
        ? undefined
        : [initializationPayload.authorization]
      const request = {
        authorizationList,
        data: initializationPayload.data,
        to: initializationPayload.to,
      } as const

      // Simulate the exact initialization before asking the wallet to submit it.
      stage = 'simulation'
      logRecovery('initialization transaction prepared', {
        ...debugContext,
        authorizationList:
          authorizationList?.map((authorization) => ({
            address: authorization.address,
            chainId: authorization.chainId,
            fields: Object.keys(authorization),
            nonce: authorization.nonce,
            yParity: authorization.yParity,
          })) ?? [],
        dataBytes: Hex.size(request.data),
        delegated: Boolean(delegation),
        requestFields: Object.keys(request),
        target: request.to,
      })
      const estimatedGas = await client.estimateGas({
        ...request,
        account: executor,
      })
      logRecovery('initialization simulation succeeded', {
        ...debugContext,
        estimatedGas: estimatedGas.toString(),
      })

      stage = 'get wallet provider'
      const provider = await externalWallet.connector.getProvider()
      if (!provider)
        throw new Error('The connected wallet did not return a provider.')
      const walletClient = createWalletClient({
        chain,
        transport: custom(provider as EIP1193Provider),
      })
      const temporaryExecutor = authorizationList
        ? getTemporaryExecutor(
            chain.id,
            discovery.address,
            externalWallet.address,
          )
        : null
      const temporaryWalletClient = temporaryExecutor
        ? createWalletClient({
            account: temporaryExecutor.account,
            chain,
            transport: http(chain.rpcUrls.default.http[0]),
          })
        : null

      let gas = estimatedGas
      let maxFeePerGas: bigint | undefined
      let maxPriorityFeePerGas: bigint | undefined
      let nonce: number | undefined
      let submissionAuthorizationList = authorizationList
      if (temporaryExecutor && temporaryWalletClient) {
        stage = 'prepare temporary gas payer'
        gas = (estimatedGas * 120n) / 100n
        const fees = await client.estimateFeesPerGas()
        maxFeePerGas = fees.maxFeePerGas
        maxPriorityFeePerGas = fees.maxPriorityFeePerGas
        const [initializationL1Fee, refundL1Fee] = await Promise.all([
          estimateL1DataFee(client, {
            account: temporaryExecutor.account.address,
            data: request.data,
            to: request.to,
          }),
          estimateL1DataFee(client, {
            account: temporaryExecutor.account.address,
            to: externalWallet.address,
          }),
        ])
        const refundGas = 21_000n
        const requiredBalance =
          gas * maxFeePerGas +
          initializationL1Fee * 2n +
          refundGas * maxFeePerGas +
          refundL1Fee * 2n
        const temporaryBalance = await client.getBalance({
          address: temporaryExecutor.account.address,
        })
        const fundingAmount =
          requiredBalance > temporaryBalance
            ? requiredBalance - temporaryBalance
            : 0n

        logRecovery('temporary gas payer prepared', {
          ...debugContext,
          address: temporaryExecutor.account.address,
          estimatedGas: estimatedGas.toString(),
          fundingAmount: fundingAmount.toString(),
          gas: gas.toString(),
          initializationL1Fee: initializationL1Fee.toString(),
          requiredBalance: requiredBalance.toString(),
        })

        if (fundingAmount > 0n) {
          stage = 'fund temporary gas payer'
          const fundingHash = await walletClient.sendTransaction({
            account: executor,
            to: temporaryExecutor.account.address,
            value: fundingAmount,
          })
          setInitializationFundingHash(fundingHash)
          logRecovery('temporary gas payer funding submitted', {
            ...debugContext,
            address: temporaryExecutor.account.address,
            amount: fundingAmount.toString(),
            hash: fundingHash,
          })
          const fundingReceipt = await client.waitForTransactionReceipt({
            hash: fundingHash,
          })
          if (fundingReceipt.status !== 'success')
            throw new Error('The temporary gas funding transaction reverted.')
          await withRetry(
            async () => {
              const balance = await client.getBalance({
                address: temporaryExecutor.account.address,
              })
              if (balance < requiredBalance)
                throw new Error('Temporary gas funding is not available yet.')
            },
            { delay: 1_000, retryCount: 10 },
          )
        }

        stage = 'authorization recheck'
        const latestCode = await client.getCode({ address: discovery.address })
        const latestDelegation = parseDelegation(latestCode)
        if (latestCode && latestCode !== '0x' && !latestDelegation)
          throw new Error(
            `The account has unexpected code on ${chain.name}. Initialization was stopped.`,
          )
        if (
          latestDelegation &&
          latestDelegation.toLowerCase() !==
            initializationPayload.authorization.address.toLowerCase()
        )
          throw new Error(
            `The account is delegated to a different contract on ${chain.name}.`,
          )
        if (!latestDelegation)
          await assertAuthorizationNonce(
            client,
            discovery.address,
            initializationPayload.authorization.nonce,
          )
        else submissionAuthorizationList = undefined
        nonce = await client.getTransactionCount({
          address: temporaryExecutor.account.address,
          blockTag: 'latest',
        })

        stage = 'temporary gas payer submission'
        logRecovery('initialization raw transaction submission requested', {
          ...debugContext,
          authorizationCount: submissionAuthorizationList?.length ?? 0,
          temporaryGasPayer: temporaryExecutor.account.address,
        })
      } else {
        stage = 'wallet submission'
        logRecovery('initialization wallet submission requested', {
          ...debugContext,
          authorizationCount: 0,
          browser: navigator.userAgent,
        })
      }

      const hash = temporaryWalletClient
        ? await temporaryWalletClient.sendTransaction({
            ...request,
            account: temporaryExecutor!.account,
            authorizationList: submissionAuthorizationList,
            gas,
            maxFeePerGas,
            maxPriorityFeePerGas,
            nonce,
          })
        : await walletClient.sendTransaction({
            ...request,
            account: executor,
          })
      submittedHash = hash

      setInitializationHash(hash)
      stage = 'confirmation'
      logRecovery('initialization transaction submitted', {
        ...debugContext,
        hash,
      })
      const receipt = await client.waitForTransactionReceipt({ hash })
      logRecovery('initialization transaction confirmed', {
        ...debugContext,
        blockNumber: receipt.blockNumber.toString(),
        gasUsed: receipt.gasUsed.toString(),
        hash,
        status: receipt.status,
      })

      if (temporaryExecutor && temporaryWalletClient) {
        stage = 'refund temporary gas payer'
        try {
          const balance = await client.getBalance({
            address: temporaryExecutor.account.address,
          })
          const fees = await client.estimateFeesPerGas()
          const l1Fee = await estimateL1DataFee(client, {
            account: temporaryExecutor.account.address,
            to: externalWallet.address,
          })
          const gas = 21_000n
          const fee = gas * fees.maxFeePerGas + l1Fee * 2n
          if (balance > fee) {
            const refundHash = await temporaryWalletClient.sendTransaction({
              gas,
              maxFeePerGas: fees.maxFeePerGas,
              maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
              to: externalWallet.address,
              value: balance - fee,
            })
            setInitializationRefundHash(refundHash)
            const refundReceipt = await client.waitForTransactionReceipt({
              hash: refundHash,
            })
            if (refundReceipt.status !== 'success')
              throw new Error('The temporary gas refund transaction reverted.')
            logRecovery('temporary gas payer refunded', {
              ...debugContext,
              address: temporaryExecutor.account.address,
              hash: refundHash,
              value: (balance - fee).toString(),
            })
          }
          window.localStorage.removeItem(temporaryExecutor.storageKey)
        } catch (error) {
          logRecoveryError('temporary gas payer refund failed', error, {
            ...debugContext,
            address: temporaryExecutor.account.address,
          })
        }
      }

      if (receipt.status !== 'success')
        throw new Error(
          'The initialization transaction reverted. Try initializing again to complete any delegation that was applied.',
        )

      setBusy(null)
      stage = 'post-transaction inspection'
      const initialized = await inspect(discovery, chain)
      if (initialized) setInitializationPayload(null)
    } catch (error) {
      logRecoveryError('initialization failed', error, {
        ...debugContext,
        hash: submittedHash,
        stage,
      })
      setInitializationError(getErrorMessage(error))
    } finally {
      setBusy(null)
    }
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!readyAccount || !asset) return

    setBusy('submit')
    setError(null)
    setTransactionHash(null)

    const debugContext = {
      assetAddress: asset.address,
      assetSymbol: asset.symbol,
      assetType: asset.type,
      chainId: chain.id,
      chainName: chain.name,
      connectorId: externalWallet.connector?.id,
      connectorName: externalWallet.connector?.name,
      destination,
      gasWallet: externalWallet.address,
      portoAccount: readyAccount.address,
      requestedAmount: amount,
      walletChainId: externalWallet.chainId,
    }
    let stage = 'preflight'
    let submittedHash: Hex_v | undefined
    logRecovery('recovery transfer started', debugContext)

    try {
      if (!isAddress(destination))
        throw new Error('Enter a valid destination address.')
      const to = getAddress(destination)
      if (to.toLowerCase() === readyAccount.address.toLowerCase())
        throw new Error('Choose a destination other than this Porto account.')
      if (!externalWallet.address || !externalWallet.connector)
        throw new Error('Connect an external wallet to pay network gas.')

      stage = 'refresh asset balance'
      const latestAsset = await loadAsset(
        getPublicClient(chain),
        chain,
        readyAccount.address,
        asset.type,
        asset.address,
      )
      if (latestAsset.balance === 0n)
        throw new Error(`This account has no ${latestAsset.symbol} to recover.`)
      let transferAmount: bigint
      try {
        transferAmount = parseUnits(amount, latestAsset.decimals)
      } catch {
        throw new Error(`Enter a valid ${latestAsset.symbol} amount.`)
      }
      if (transferAmount <= 0n)
        throw new Error(
          `Enter a ${latestAsset.symbol} amount greater than zero.`,
        )
      if (transferAmount > latestAsset.balance)
        throw new Error(
          `The transfer amount exceeds the available ${latestAsset.symbol} balance.`,
        )

      if (externalWallet.chainId !== chain.id) {
        stage = 'switch wallet network'
        await switchChain.switchChainAsync({
          chainId: chain.id,
          connector: externalWallet.connector,
        })
      }

      stage = 'gas wallet preflight'
      const executor = {
        address: externalWallet.address,
        type: 'json-rpc',
      } as const
      if (
        latestAsset.type === 'native' &&
        executor.address.toLowerCase() === readyAccount.address.toLowerCase()
      )
        throw new Error(
          'Choose a different external wallet to pay gas when recovering native currency.',
        )
      const client = getPublicClient(chain)
      const executorBalance = await client.getBalance({
        address: executor.address,
      })
      if (executorBalance === 0n)
        throw new Error(
          `The external wallet needs ${chain.nativeCurrency.symbol} on ${chain.name} to pay gas.`,
        )

      const calls: readonly {
        data?: Hex_v | undefined
        to: Address
        value?: bigint | undefined
      }[] =
        latestAsset.type === 'native'
          ? [{ to, value: transferAmount }]
          : [
              {
                data: encodeFunctionData({
                  abi: erc20Abi,
                  args: [to, transferAmount],
                  functionName: 'transfer',
                }),
                to: latestAsset.address!,
              },
            ]

      stage = 'prepare account execution'
      const { digests, request } = await ContractActions.prepareExecute(
        client,
        {
          account: readyAccount.account,
          calls,
          executor,
        },
      )
      logRecovery('recovery transaction prepared', {
        ...debugContext,
        availableBalance: latestAsset.balance.toString(),
        callCount: calls.length,
        executor: executor.address,
        hasAuthorization: Boolean(request.authorization),
        nonce: request.nonce.toString(),
        requestFields: Object.keys(request),
        transferAmount: transferAmount.toString(),
      })
      stage = 'passkey signature'
      const exec = await Account.sign(readyAccount.account, {
        key: readyAccount.key,
        payload: digests.exec,
        replaySafe: false,
      })
      stage = 'get wallet provider'
      const provider = await externalWallet.connector.getProvider()
      if (!provider)
        throw new Error('The connected wallet did not return a provider.')
      const walletClient = createWalletClient({
        chain,
        transport: custom(provider as EIP1193Provider),
      })
      stage = 'wallet submission'
      logRecovery('recovery wallet submission requested', {
        ...debugContext,
        browser: navigator.userAgent,
        executor: executor.address,
      })
      const hash = await ContractActions.execute(walletClient, {
        ...request,
        signatures: { exec },
      })
      submittedHash = hash

      setTransactionHash(hash)
      stage = 'confirmation'
      logRecovery('recovery transaction submitted', {
        ...debugContext,
        hash,
      })
      const receipt = await client.waitForTransactionReceipt({ hash })
      logRecovery('recovery transaction confirmed', {
        ...debugContext,
        blockNumber: receipt.blockNumber.toString(),
        gasUsed: receipt.gasUsed.toString(),
        hash,
        status: receipt.status,
      })
      if (receipt.status !== 'success')
        throw new Error('The recovery transaction reverted.')

      stage = 'post-transfer balance verification'
      const expectedBalance = latestAsset.balance - transferAmount
      const unexpectedBalanceError = new Error(
        `The transaction was confirmed, but the ${latestAsset.symbol} balance did not update as expected. The token may not support this transfer.`,
      )
      await withRetry(
        async () => {
          const result = await assetQuery.refetch()
          if (result.error) throw result.error
          if (!result.data || result.data.balance !== expectedBalance)
            throw unexpectedBalanceError
        },
        { delay: 1_000, retryCount: 10 },
      )
      logRecovery('recovery transfer completed', {
        ...debugContext,
        expectedBalance: expectedBalance.toString(),
        hash,
      })
    } catch (error) {
      logRecoveryError('recovery transfer failed', error, {
        ...debugContext,
        hash: submittedHash,
        stage,
      })
      setError({ message: getErrorMessage(error), step: 5 })
    } finally {
      setBusy(null)
    }
  }

  const explorerUrl =
    transactionHash && chain.blockExplorers?.default
      ? `${chain.blockExplorers.default.url}/tx/${transactionHash}`
      : undefined
  const initializationExplorerUrl =
    initializationHash && chain.blockExplorers?.default
      ? `${chain.blockExplorers.default.url}/tx/${initializationHash}`
      : undefined
  const initializationFundingExplorerUrl =
    initializationFundingHash && chain.blockExplorers?.default
      ? `${chain.blockExplorers.default.url}/tx/${initializationFundingHash}`
      : undefined
  const initializationRefundExplorerUrl =
    initializationRefundHash && chain.blockExplorers?.default
      ? `${chain.blockExplorers.default.url}/tx/${initializationRefundHash}`
      : undefined
  const accountExplorerUrl =
    readyAccount && chain.blockExplorers?.default
      ? `${chain.blockExplorers.default.url}/address/${readyAccount.address}`
      : undefined

  return (
    <main className="min-h-full bg-gray2 text-gray12">
      <div className="w-full max-w-[768px] p-4">
        <h1 className="font-bold font-serif text-4xl">Recover funds</h1>
        <p className="mt-4">
          Transfer native currency or ERC-20 tokens from a Porto account by
          interacting directly with the account contract.
        </p>

        <hr className="my-6 border-gray7" />

        <section className="space-y-3">
          <Step number="1" title="Connect Porto account" />

          <p>
            Choose the passkey for the Porto account you want to recover funds
            from.
          </p>

          {discovery ? (
            <div className="flex flex-wrap items-center gap-2">
              <PortoIcon />
              <strong>Account:</strong>
              <span className="break-all font-mono">{discovery.address}</span>
              <button
                className={buttonClassName}
                disabled={busy !== null}
                onClick={disconnectPortoAccount}
                type="button"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              className={`${buttonClassName} inline-flex items-center gap-2`}
              disabled={busy !== null}
              onClick={discover}
              type="button"
            >
              <PortoIcon />
              {busy === 'discover'
                ? 'Connecting account…'
                : 'Choose Porto passkey'}
            </button>
          )}

          <ErrorMessage message={error?.step === 1 ? error.message : null} />
        </section>

        <hr className="my-6 border-gray7" />

        <section className="space-y-3">
          <Step number="2" title="Connect gas wallet" />

          <p>Connect wallet to pay network fees.</p>

          {externalWallet.address && externalWallet.connector ? (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {externalWallet.connector.icon ? (
                  <img
                    alt=""
                    className="size-5 rounded"
                    src={externalWallet.connector.icon}
                  />
                ) : null}
                <strong>{externalWallet.connector.name}:</strong>
                <span className="break-all font-mono">
                  {externalWallet.address}
                </span>
                <button
                  className={buttonClassName}
                  disabled={walletBusy || busy !== null}
                  onClick={disconnectWallet}
                  type="button"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : connectors.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {connectors.map((connector) => (
                <li key={connector.uid}>
                  <button
                    className={`${buttonClassName} inline-flex items-center gap-2`}
                    disabled={walletBusy || busy !== null}
                    onClick={() => connectWallet(connector)}
                    type="button"
                  >
                    {connector.icon ? (
                      <img
                        alt=""
                        className="size-5 rounded"
                        src={connector.icon}
                      />
                    ) : null}
                    <span>{connector.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <strong>No compatible wallets were found.</strong> Install or open
              a browser wallet extension,{' '}
              <span className="whitespace-nowrap">then reload this page.</span>
            </p>
          )}

          <ErrorMessage message={error?.step === 2 ? error.message : null} />
        </section>

        <hr className="my-6 border-gray7" />

        <section className="space-y-3">
          <Step number="3" title="Select network" />

          <p>Choose the network where your funds are held.</p>

          <div className="relative w-full max-w-[32rem]">
            <select
              aria-label="Network"
              className={`${fieldClassName} appearance-none pr-9`}
              disabled={!discovery || busy !== null}
              id="recovery-network"
              onChange={(event) => resetChainState(Number(event.target.value))}
              value={chain.id}
            >
              {mainnetChains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
              {testnetChains.length > 0 ? (
                <option disabled>────────</option>
              ) : null}
              {testnetChains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name}
                </option>
              ))}
            </select>
            <svg
              aria-hidden="true"
              className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3 size-4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>

          {gasWalletConnected ? (
            <>
              <ErrorMessage
                message={error?.step === 3 ? error.message : null}
                supportUrl={error?.step === 3 ? error.supportUrl : undefined}
              />

              {needsInitialization ? (
                <details className="space-y-3">
                  <summary className="cursor-pointer underline">
                    Import initialization payload
                  </summary>
                  <div className="space-y-3 pt-2">
                    <Field
                      id="recovery-initialization-payload"
                      label="Initialization payload"
                    >
                      <textarea
                        autoCapitalize="off"
                        autoComplete="off"
                        className={`${fieldClassName} max-w-[48rem] font-mono text-sm`}
                        disabled={busy !== null}
                        id="recovery-initialization-payload"
                        onChange={(event) => {
                          setInitializationInput(event.target.value)
                          setInitializationPayload(null)
                          setInitializationError(null)
                          setInitializationHash(null)
                          setInitializationFundingHash(null)
                          setInitializationRefundHash(null)
                        }}
                        placeholder="Paste the JSON provided by Ithaca Support"
                        readOnly={Boolean(initializationPayload)}
                        rows={7}
                        spellCheck={false}
                        value={initializationInput}
                      />
                    </Field>

                    {initializationPayload ? (
                      <div className="space-y-3">
                        <p>{temporaryExecutorDescription}</p>
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            className={buttonClassName}
                            disabled={busy !== null || walletBusy}
                            onClick={initializeAccount}
                            type="button"
                          >
                            {busy === 'initialize'
                              ? 'Initializing account…'
                              : 'Initialize Porto account'}
                          </button>
                          <button
                            className="text-accent underline disabled:text-gray9"
                            disabled={busy !== null}
                            onClick={() => {
                              setInitializationPayload(null)
                              setInitializationError(null)
                              setInitializationHash(null)
                              setInitializationFundingHash(null)
                              setInitializationRefundHash(null)
                            }}
                            type="button"
                          >
                            Use another payload
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className={buttonClassName}
                        disabled={!initializationInput.trim() || busy !== null}
                        onClick={importInitialization}
                        type="button"
                      >
                        {busy === 'import'
                          ? 'Validating payload…'
                          : 'Import payload'}
                      </button>
                    )}
                    <ErrorMessage message={initializationError} />
                  </div>
                </details>
              ) : null}
            </>
          ) : null}

          {initializationFundingHash ? (
            <div className="space-y-1">
              <p>
                <strong className="block">Gas funding transaction:</strong>
                <span className="block break-all font-mono">
                  {initializationFundingHash}
                </span>
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {initializationFundingExplorerUrl ? (
                  <a
                    className="text-accent underline"
                    href={initializationFundingExplorerUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    View on block explorer
                  </a>
                ) : null}
                {busy === 'initialize' && !initializationHash ? (
                  <ConfirmingStatus />
                ) : null}
              </div>
            </div>
          ) : null}

          {initializationHash ? (
            <div className="space-y-1">
              <p>
                <strong className="block">Initialization transaction:</strong>
                <span className="block break-all font-mono">
                  {initializationHash}
                </span>
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {initializationExplorerUrl ? (
                  <a
                    className="text-accent underline"
                    href={initializationExplorerUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    View on block explorer
                  </a>
                ) : null}
                {busy === 'initialize' && !initializationRefundHash ? (
                  <ConfirmingStatus />
                ) : null}
              </div>
            </div>
          ) : null}

          {initializationRefundHash ? (
            <div className="space-y-1">
              <p>
                <strong className="block">Gas refund transaction:</strong>
                <span className="block break-all font-mono">
                  {initializationRefundHash}
                </span>
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {initializationRefundExplorerUrl ? (
                  <a
                    className="text-accent underline"
                    href={initializationRefundExplorerUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    View on block explorer
                  </a>
                ) : null}
                {busy === 'initialize' ? <ConfirmingStatus /> : null}
              </div>
            </div>
          ) : null}
        </section>

        <hr className="my-6 border-gray7" />

        <section className="space-y-3">
          <Step number="4" title="Choose funds" />

          <p>Choose the native currency or token you want to recover.</p>

          <div className="flex flex-wrap gap-2">
            <button
              className={`${buttonClassName} inline-flex items-center gap-2 ${assetType === 'native' ? 'bg-gray5' : ''}`}
              disabled={!readyAccount || busy !== null}
              onClick={() => {
                setAssetType('native')
                setError(null)
              }}
              title={chain.nativeCurrency.name}
              type="button"
            >
              <AssetIcon symbol={chain.nativeCurrency.symbol} />
              <span>{chain.nativeCurrency.symbol}</span>
            </button>

            {availableTokens.map((token) => (
              <button
                className={`${buttonClassName} inline-flex items-center gap-2 ${selectedToken?.address === token.address ? 'bg-gray5' : ''}`}
                disabled={!readyAccount || busy !== null}
                key={token.address}
                onClick={() => {
                  setAssetType('erc20')
                  setTokenAddress(token.address)
                  setError(null)
                }}
                title={token.name}
                type="button"
              >
                <AssetIcon symbol={token.symbol} />
                <span>{token.symbol}</span>
              </button>
            ))}

            <button
              className={`${buttonClassName} ${assetType === 'erc20' && !selectedToken ? 'bg-gray5' : ''}`}
              disabled={!readyAccount || busy !== null}
              onClick={() => {
                setAssetType('erc20')
                setTokenAddress('')
                setError(null)
              }}
              type="button"
            >
              Custom token
            </button>
          </div>

          {assetType === 'erc20' && !selectedToken ? (
            <>
              <Field id="recovery-token" label="Token contract">
                <input
                  autoCapitalize="off"
                  autoComplete="off"
                  className={fieldClassName}
                  disabled={!readyAccount || busy !== null}
                  id="recovery-token"
                  onChange={(event) => {
                    setTokenAddress(event.target.value)
                  }}
                  placeholder="0x…"
                  spellCheck={false}
                  value={tokenAddress}
                />
              </Field>
              {accountExplorerUrl ? (
                <p>
                  <a
                    className="text-accent underline"
                    href={accountExplorerUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Check token holdings on block explorer
                  </a>
                </p>
              ) : null}
            </>
          ) : null}

          {gasWalletConnected ? (
            <>
              {assetQuery.isFetching && !asset ? (
                <p>
                  <strong>Balance:</strong> Loading…
                </p>
              ) : asset ? (
                <p className="break-all">
                  <strong>Balance:</strong>{' '}
                  <span className="inline-flex items-baseline gap-1">
                    <span className="font-mono">
                      {formatUnits(asset.balance, asset.decimals)}
                    </span>
                    <span>{asset.symbol}</span>
                  </span>
                </p>
              ) : null}

              <ErrorMessage
                message={
                  !busy && !error && assetQuery.error
                    ? getErrorMessage(assetQuery.error)
                    : null
                }
              />
            </>
          ) : null}
        </section>

        <hr className="my-6 border-gray7" />

        <form className="space-y-3 pb-8" onSubmit={submit}>
          <Step number="5" title="Transfer funds" />

          <p>Enter the amount and destination address.</p>

          <Field id="recovery-amount" label="Amount">
            <div className="flex w-full max-w-[48rem] gap-2">
              <input
                autoCapitalize="off"
                autoComplete="off"
                className={`${fieldClassName} min-w-0 max-w-none flex-1`}
                disabled={!asset || busy !== null}
                id="recovery-amount"
                inputMode="decimal"
                max={formattedAssetBalance || undefined}
                min="0"
                onChange={(event) => setAmount(event.target.value)}
                placeholder="0.00"
                required
                spellCheck={false}
                step="any"
                type="number"
                value={amount}
              />
              <button
                className={`${buttonClassName} shrink-0`}
                disabled={!asset || busy !== null || isMaxAmount}
                onClick={() => setAmount(formattedAssetBalance)}
                type="button"
              >
                Max
              </button>
            </div>
          </Field>

          <Field id="recovery-destination" label="Destination address">
            <div className="flex w-full max-w-[48rem] gap-2">
              <input
                autoCapitalize="off"
                autoComplete="off"
                className={`${fieldClassName} min-w-0 max-w-none flex-1`}
                disabled={!asset || busy !== null}
                id="recovery-destination"
                onChange={(event) => setDestination(event.target.value)}
                placeholder="0x…"
                required
                spellCheck={false}
                value={destination}
              />
              <button
                className={`${buttonClassName} shrink-0`}
                disabled={
                  !asset ||
                  !externalWallet.address ||
                  busy !== null ||
                  usesConnectedAddress
                }
                onClick={() => {
                  if (externalWallet.address)
                    setDestination(externalWallet.address)
                }}
                type="button"
              >
                Use connected address
              </button>
            </div>
          </Field>

          <button
            className={buttonClassName}
            disabled={
              !readyAccount ||
              !asset ||
              asset.balance === 0n ||
              !externalWallet.address ||
              busy !== null ||
              walletBusy
            }
            type="submit"
          >
            {busy === 'submit'
              ? 'Transferring funds…'
              : asset
                ? `Transfer ${asset.symbol}`
                : 'Transfer funds'}
          </button>

          <ErrorMessage message={error?.step === 5 ? error.message : null} />

          {transactionHash ? (
            <div className="space-y-1">
              <p>
                <strong className="block">Transaction:</strong>
                <span className="block break-all font-mono">
                  {transactionHash}
                </span>
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {explorerUrl ? (
                  <a
                    className="text-accent underline"
                    href={explorerUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    View on block explorer
                  </a>
                ) : null}
                {busy === 'submit' ? <ConfirmingStatus /> : null}
              </div>
            </div>
          ) : null}
        </form>
      </div>
    </main>
  )
}

function getPublicClient(chain: Chain) {
  return createPublicClient({
    chain,
    transport: http(chain.rpcUrls.default.http[0]),
  })
}

function getTemporaryExecutor(
  chainId: number,
  portoAccount: Address,
  funder: Address,
) {
  const storageKey = [
    'porto.recovery.temporary-executor',
    chainId,
    portoAccount.toLowerCase(),
    funder.toLowerCase(),
  ].join('.')

  try {
    const stored = window.localStorage.getItem(storageKey)
    const privateKey = (() => {
      if (stored) {
        try {
          const record = JSON.parse(stored) as { privateKey?: unknown }
          if (
            typeof record.privateKey === 'string' &&
            isHex(record.privateKey) &&
            Hex.size(record.privateKey) === 32
          )
            return record.privateKey
        } catch {}
      }
      return generatePrivateKey()
    })()

    // Persist before funding so a reload cannot strand the temporary gas.
    // This key controls only the small amount needed for initialization.
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        createdAt: Date.now(),
        funder,
        privateKey,
      }),
    )
    return {
      account: privateKeyToAccount(privateKey),
      storageKey,
    }
  } catch {
    throw new Error(
      'Browser storage must be available to safely initialize this Porto account.',
    )
  }
}

async function estimateL1DataFee(
  client: ReturnType<typeof getPublicClient>,
  request: {
    account: Address
    data?: Hex_v | undefined
    to: Address
  },
) {
  try {
    return await estimateL1Fee(client, request)
  } catch {
    return 0n
  }
}

function getInspectionCacheKey(discovery: Discovery, chainId: number) {
  return `${discovery.credentialId}:${chainId}`
}

async function validateInitializationPayload(
  input: string,
  discovery: Discovery,
  chain: Chain,
): Promise<InitializationPayload> {
  const payload = parseInitializationPayload(input)
  const signer = await recoverAuthorizationAddress({
    authorization: payload.authorization,
  })
  if (signer.toLowerCase() !== discovery.address.toLowerCase())
    throw new Error(
      'The initialization authorization was not signed by this Porto account.',
    )
  if (
    payload.authorization.chainId !== 0 &&
    payload.authorization.chainId !== chain.id
  )
    throw new Error(
      `The initialization authorization is not valid on ${chain.name}.`,
    )
  if (
    !initializationOrchestrators.some(
      (address) => address.toLowerCase() === payload.to.toLowerCase(),
    )
  )
    throw new Error('The initialization payload uses an unknown Orchestrator.')

  const decoded = decodeFunctionData({
    abi: executePreCallsAbi,
    data: payload.data,
  })
  if (decoded.functionName !== 'executePreCalls')
    throw new Error('The initialization payload contains an unsupported call.')
  const [parentEoa, preCalls] = decoded.args
  if (parentEoa.toLowerCase() !== discovery.address.toLowerCase())
    throw new Error('The initialization payload targets a different account.')
  if (preCalls.length !== 1 || !preCalls[0])
    throw new Error(
      'The initialization payload must contain one initialization.',
    )

  const preCall = preCalls[0]
  if (
    preCall.eoa.toLowerCase() !== zeroAddress &&
    preCall.eoa.toLowerCase() !== discovery.address.toLowerCase()
  )
    throw new Error('The initialization payload targets a different account.')

  const [calls] = decodeAbiParameters(
    executionCallsParameters,
    preCall.executionData,
  )
  if (calls.length === 0)
    throw new Error('The initialization payload does not install any keys.')

  let installsSelectedPasskey = false
  for (const call of calls) {
    if (call.value !== 0n)
      throw new Error('The initialization payload attempts to transfer funds.')
    if (
      call.to.toLowerCase() !== zeroAddress &&
      call.to.toLowerCase() !== discovery.address.toLowerCase()
    )
      throw new Error('The initialization payload calls an external contract.')

    const accountCall = decodeFunctionData({
      abi: ContractActions.abi,
      data: call.data,
    })
    if (
      accountCall.functionName !== 'authorize' &&
      accountCall.functionName !== 'setCanExecute' &&
      accountCall.functionName !== 'setSpendLimit'
    )
      throw new Error(
        `The initialization payload contains an unsupported ${accountCall.functionName} call.`,
      )

    if (accountCall.functionName === 'authorize') {
      const [key] = accountCall.args
      const expiry = Number(key.expiry)
      if (
        key.keyType === 1 &&
        key.isSuperAdmin &&
        (!expiry || expiry >= Math.floor(Date.now() / 1_000)) &&
        WebAuthnP256.verify({
          challenge: discovery.challenge,
          metadata: discovery.assertion.metadata,
          publicKey: PublicKey.fromHex(key.publicKey),
          signature: discovery.assertion.signature,
        })
      )
        installsSelectedPasskey = true
    }
  }

  if (!installsSelectedPasskey)
    throw new Error(
      'The initialization payload does not install the selected passkey as an admin key.',
    )

  const client = getPublicClient(chain)
  const [accountCode, delegationCode, orchestratorCode] = await Promise.all([
    client.getCode({ address: discovery.address }),
    client.getCode({ address: payload.authorization.address }),
    client.getCode({ address: payload.to }),
  ])
  const delegation = parseDelegation(accountCode)
  if (accountCode && accountCode !== '0x' && !delegation)
    throw new Error(`The account has unexpected code on ${chain.name}.`)
  if (
    delegation &&
    delegation.toLowerCase() !== payload.authorization.address.toLowerCase()
  )
    throw new Error(
      `The account is already delegated to a different contract on ${chain.name}.`,
    )
  if (!delegationCode || delegationCode === '0x')
    throw new Error(
      `The Porto account contract is not deployed on ${chain.name}.`,
    )
  if (!orchestratorCode || orchestratorCode === '0x')
    throw new Error(`The Porto Orchestrator is not deployed on ${chain.name}.`)
  if (!delegation)
    await assertAuthorizationNonce(
      client,
      discovery.address,
      payload.authorization.nonce,
    )

  return payload
}

function parseInitializationPayload(input: string): InitializationPayload {
  let parsed: unknown
  try {
    parsed = JSON.parse(input)
  } catch {
    throw new Error('Enter a valid JSON initialization payload.')
  }

  const envelope = parseObject(parsed, 'initialization payload')
  const payload = parseObject(
    'result' in envelope ? envelope.result : envelope,
    'initialization payload',
  )
  const authorization = parseObject(
    payload.authorization,
    'initialization authorization',
  )
  const yParity = parseRpcNumber(authorization.yParity, 'authorization yParity')
  if (yParity !== 0 && yParity !== 1)
    throw new Error('The authorization yParity must be 0 or 1.')

  return {
    authorization: {
      address: parseAddress(authorization.address, 'authorization address'),
      chainId: parseRpcNumber(authorization.chainId, 'authorization chainId'),
      nonce: parseRpcNumber(authorization.nonce, 'authorization nonce'),
      r: parseHex(authorization.r, 'authorization r', 32),
      s: parseHex(authorization.s, 'authorization s', 32),
      yParity,
    },
    data: parseHex(payload.data, 'initialization data'),
    to: parseAddress(payload.to, 'initialization target'),
  }
}

function parseObject(value: unknown, name: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    throw new Error(`The ${name} must be an object.`)
  return value as Record<string, unknown>
}

function parseAddress(value: unknown, name: string): Address {
  if (typeof value !== 'string' || !isAddress(value))
    throw new Error(`The ${name} is invalid.`)
  return getAddress(value)
}

function parseHex(value: unknown, name: string, size?: number): Hex_v {
  if (typeof value !== 'string' || !isHex(value, { strict: true }))
    throw new Error(`The ${name} is invalid.`)
  if (size !== undefined && Hex.size(value) !== size)
    throw new Error(`The ${name} must be ${size} bytes.`)
  return value
}

function parseRpcNumber(value: unknown, name: string): number {
  let number: bigint
  try {
    if (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0)
      return value
    if (
      typeof value !== 'string' ||
      (!/^0x[0-9a-fA-F]+$/.test(value) && !/^\d+$/.test(value))
    )
      throw new Error()
    number = BigInt(value)
  } catch {
    throw new Error(`The ${name} is invalid.`)
  }
  if (number < 0n || number > BigInt(Number.MAX_SAFE_INTEGER))
    throw new Error(`The ${name} is outside the supported range.`)
  return Number(number)
}

async function assertAuthorizationNonce(
  client: ReturnType<typeof getPublicClient>,
  address: Address,
  nonce: number,
) {
  const currentNonce = await client.getTransactionCount({
    address,
    blockTag: 'pending',
  })
  if (currentNonce !== nonce)
    throw new Error(
      `The initialization authorization is stale. It expects account nonce ${nonce}, but ${currentNonce} is required on this network.`,
    )
}

async function loadAsset(
  client: ReturnType<typeof getPublicClient>,
  chain: Chain,
  account: Address,
  type: Asset['type'],
  tokenAddress?: string | Address,
): Promise<Asset> {
  if (type === 'native')
    return {
      balance: await client.getBalance({ address: account }),
      decimals: chain.nativeCurrency.decimals,
      symbol: chain.nativeCurrency.symbol,
      type,
    }

  if (!tokenAddress || !isAddress(tokenAddress))
    throw new Error('Enter a valid ERC-20 token contract address.')
  const address = getAddress(tokenAddress)
  const [balance, decimals, symbol] = await Promise.all([
    client.readContract({
      abi: erc20Abi,
      address,
      args: [account],
      functionName: 'balanceOf',
    }),
    client.readContract({
      abi: erc20Abi,
      address,
      functionName: 'decimals',
    }),
    client.readContract({
      abi: erc20Abi,
      address,
      functionName: 'symbol',
    }),
  ])

  return {
    address,
    balance,
    decimals,
    symbol,
    type,
  }
}

function parseDelegation(code: Hex_v | undefined): Address | null {
  const match = code?.match(/^0xef0100([a-fA-F0-9]{40})$/)
  if (!match?.[1]) return null
  return getAddress(`0x${match[1]}`)
}

function getErrorMessage(error: unknown) {
  const httpStatus = getHttpStatus(error)
  if (httpStatus === 429)
    return 'The network provider rate limit was reached (HTTP 429). Please try again shortly.'
  if (httpStatus) return `HTTP request failed (${httpStatus}).`

  if (typeof error === 'object' && error !== null) {
    if ('shortMessage' in error && typeof error.shortMessage === 'string')
      return error.shortMessage
    if ('message' in error && typeof error.message === 'string')
      return error.message
  }
  return 'Recovery failed. Please try again.'
}

function getHttpStatus(error: unknown) {
  const seen = new Set<unknown>()
  let current = error
  while (
    typeof current === 'object' &&
    current !== null &&
    !seen.has(current)
  ) {
    seen.add(current)
    if (
      'name' in current &&
      current.name === 'HttpRequestError' &&
      'status' in current &&
      typeof current.status === 'number'
    )
      return current.status
    current = 'cause' in current ? current.cause : undefined
  }
  return undefined
}

function logRecovery(event: string, details: Record<string, unknown>) {
  console.info('[Porto recovery]', event, {
    timestamp: new Date().toISOString(),
    ...details,
  })
}

function logRecoveryError(
  event: string,
  error: unknown,
  details: Record<string, unknown>,
) {
  console.error('[Porto recovery]', event, {
    timestamp: new Date().toISOString(),
    ...details,
    error: getRecoveryErrorDetails(error),
  })
}

function getRecoveryErrorDetails(error: unknown, depth = 0): unknown {
  if (typeof error !== 'object' || error === null) return error

  const value = error as Record<string, unknown>
  const details: Record<string, unknown> = {}
  for (const key of [
    'name',
    'message',
    'shortMessage',
    'details',
    'metaMessages',
    'code',
    'data',
    'status',
    'url',
    'stack',
  ])
    if (key in value) details[key] = value[key]
  if ('cause' in value && depth < 5)
    details.cause = getRecoveryErrorDetails(value.cause, depth + 1)
  return details
}

function getSupportEmailUrl(address: Address, chain: Chain) {
  const subject = 'Help recovering an undelegated Porto account'
  const body = [
    'Hello Ithaca Support,',
    '',
    'I need help recovering funds from an undelegated Porto account.',
    '',
    `Account address: ${address}`,
    `Network: ${chain.name}`,
    `Chain ID: ${chain.id}`,
  ].join('\n')
  return `mailto:support@ithaca.xyz?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function ErrorMessage({
  message,
  supportUrl,
}: {
  message: string | null
  supportUrl?: string | undefined
}) {
  if (!message) return null
  return (
    <p className="break-words text-destructive" role="alert">
      <strong>Error:</strong> {message}
      {supportUrl ? (
        <>
          <br />
          For help, send a message to{' '}
          <a className="underline" href={supportUrl}>
            support@ithaca.xyz
          </a>{' '}
          with your Porto address and network name.
        </>
      ) : null}
    </p>
  )
}

function AssetIcon({ symbol }: { symbol?: string | undefined }) {
  return (
    <img
      alt=""
      aria-hidden="true"
      className="size-5"
      onError={(event) => {
        event.currentTarget.src = '/icons/fallback.svg'
        event.currentTarget.onerror = null
      }}
      src={
        symbol ? `/icons/${symbol.toLowerCase()}.svg` : '/icons/fallback.svg'
      }
    />
  )
}

function PortoIcon() {
  return (
    <picture>
      <source media="(prefers-color-scheme: light)" srcSet="/icon-dark.png" />
      <img
        alt=""
        aria-hidden="true"
        className="size-5 rounded"
        src="/icon-light.png"
      />
    </picture>
  )
}

function ConfirmingStatus() {
  return (
    <output className="inline-flex items-center gap-1.5 text-gray11">
      <svg
        aria-hidden="true"
        className="size-3.5 animate-spin"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="opacity-75"
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
      Confirming…
    </output>
  )
}

function Step({ number, title }: { number: string; title: string }) {
  return (
    <h2 className="font-bold font-serif text-2xl">{`${number}. ${title}`}</h2>
  )
}

function Field({
  children,
  id,
  label,
}: {
  children: React.ReactNode
  id: string
  label: string
}) {
  return (
    <div className="space-y-1">
      <label className="block font-bold" htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  )
}

const fieldClassName =
  'min-h-9 w-full max-w-[32rem] rounded-md border border-gray8 bg-gray3 px-2 py-1 text-gray12 outline-none placeholder:text-gray9 focus:border-gray10 disabled:opacity-50'

const buttonClassName =
  'min-h-9 rounded-md border border-gray8 bg-gray3 px-3 py-1 text-gray12 hover:bg-gray4 disabled:bg-gray2 disabled:text-gray9'

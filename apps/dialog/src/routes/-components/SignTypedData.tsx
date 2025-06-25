import { Button } from '@porto/apps/components'
import { useCopyToClipboard } from '@porto/apps/hooks'
import type { Address } from 'ox'
import { Hooks } from 'porto/remote'
import { useEffect, useMemo, useState } from 'react'
import { formatUnits } from 'viem'

import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import ArrowDownLeft from '~icons/lucide/arrow-down-left'
import ArrowUpRight from '~icons/lucide/arrow-up-right'
import CopyIcon from '~icons/lucide/copy'
import LucideLoader2 from '~icons/lucide/loader-2'
import LucidePenTool from '~icons/lucide/pen-tool'
import LucideShieldCheck from '~icons/lucide/shield-check'
import LucideTriangleAlert from '~icons/lucide/triangle-alert'

export function SignTypedData(props: SignTypedData.Props) {
  const { address, typedDataString, loading, onApprove, onReject } = props

  const account = Hooks.useAccount(porto, { address })
  const [, copyToClipboard] = useCopyToClipboard({ timeout: 2_000 })
  const [enhancedProtocol, setEnhancedProtocol] = useState<any>(null)
  const [protocolLoading, setProtocolLoading] = useState(false)

  // Parse the typed data to display structured information
  const parsedData = useMemo(() => {
    try {
      return JSON.parse(typedDataString)
    } catch {
      return null
    }
  }, [typedDataString])

  // Enhanced protocol detection using the new two-tier system
  useEffect(() => {
    async function detectProtocol() {
      if (!parsedData?.domain) return

      setProtocolLoading(true)
      try {
        // Dynamic import to use the enhanced detection system
        const { decodeProtocolSignature } = await import('porto/core/detectors')

        const signatureInput = {
          chainId: parsedData.domain.chainId || 1,
          context: {
            origin:
              typeof window !== 'undefined'
                ? window.location.origin
                : undefined,
          },
          typedData: parsedData,
        }

        const result = await decodeProtocolSignature(signatureInput)
        setEnhancedProtocol(result)
      } catch (error) {
        console.warn('Enhanced protocol detection failed:', error)
        setEnhancedProtocol(null)
      } finally {
        setProtocolLoading(false)
      }
    }

    detectProtocol()
  }, [parsedData])

  // Fallback protocol detection for backwards compatibility
  const protocolInfo = useMemo(() => {
    if (enhancedProtocol && enhancedProtocol.protocol !== 'Unknown Protocol') {
      return {
        action: enhancedProtocol.action,
        detected: true,
        enhanced: true,
        name: enhancedProtocol.protocol,
        verificationLevel:
          enhancedProtocol.metadata?.verificationLevel || 'curated',
      }
    }

    if (!parsedData?.domain?.name) return null

    // Simple protocol detection based on domain name (fallback)
    const domainName = parsedData.domain.name.toLowerCase()
    if (domainName.includes('dummyswap')) {
      return {
        action: 'Limit Order',
        detected: true,
        enhanced: false,
        name: 'DummySwap Protocol',
      }
    }
    if (domainName.includes('cow')) {
      return {
        action: 'Trade Order',
        detected: true,
        enhanced: false,
        name: 'CoW Protocol',
      }
    }
    return {
      action: 'Signature',
      detected: false,
      enhanced: false,
      name: 'Unknown Protocol',
    }
  }, [parsedData, enhancedProtocol])

  // Common token addresses for quick recognition
  const WELL_KNOWN_TOKENS = useMemo(
    () => ({
      // Base Sepolia common tokens
      '0x036cbd53842c5426634e7929541ec2318f3dcf7e': {
        decimals: 6,
        symbol: 'USDC',
      },
      // ETH/native
      '0x0000000000000000000000000000000000000000': {
        decimals: 18,
        symbol: 'ETH',
      },
      '0x4200000000000000000000000000000000000006': {
        decimals: 18,
        symbol: 'WETH',
      },
      '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': {
        decimals: 18,
        symbol: 'ETH',
      },
    }),
    [],
  )

  // Extract readable information from the message
  const messageInfo = useMemo(() => {
    // Use enhanced protocol data if available
    if (enhancedProtocol && enhancedProtocol.details?.assets?.length > 0) {
      const sendAssets = enhancedProtocol.details.assets.filter(
        (a: any) => a.type === 'send',
      )
      const receiveAssets = enhancedProtocol.details.assets.filter(
        (a: any) => a.type === 'receive',
      )

      if (sendAssets.length > 0 && receiveAssets.length > 0) {
        return {
          buyAmountFormatted: receiveAssets[0].amountFormatted,
          buyToken: {
            address: receiveAssets[0].token.address,
            decimals: receiveAssets[0].token.decimals || 18,
            label: receiveAssets[0].label || 'Receive',
            symbol: receiveAssets[0].token.symbol || 'TOKEN',
          },
          enhanced: true,
          sellAmountFormatted: sendAssets[0].amountFormatted,
          sellToken: {
            address: sendAssets[0].token.address,
            decimals: sendAssets[0].token.decimals || 18,
            label: sendAssets[0].label || 'Send',
            symbol: sendAssets[0].token.symbol || 'TOKEN',
          },
          type: 'swap',
          validUntil:
            enhancedProtocol.details.timing?.validUntil?.toLocaleString(),
        }
      }
    }

    // Fallback to legacy parsing
    if (!parsedData?.message) return null

    const message = parsedData.message
    const info: any = { enhanced: false }

    // Try to extract common fields
    if (message.sellToken && message.buyToken) {
      info.type = 'swap'

      // Get token info from well-known tokens or use fallback
      const sellTokenInfo = WELL_KNOWN_TOKENS[
        message.sellToken?.toLowerCase() as keyof typeof WELL_KNOWN_TOKENS
      ] || { decimals: 18, symbol: 'TOKEN' }
      const buyTokenInfo = WELL_KNOWN_TOKENS[
        message.buyToken?.toLowerCase() as keyof typeof WELL_KNOWN_TOKENS
      ] || { decimals: 18, symbol: 'TOKEN' }

      info.sellToken = {
        address: message.sellToken,
        ...sellTokenInfo,
        label: 'Send', // Default label, will be overridden by protocol decoder if available
      }
      info.buyToken = {
        address: message.buyToken,
        ...buyTokenInfo,
        label: 'Receive', // Default label, will be overridden by protocol decoder if available
      }

      // Format amounts using proper decimals
      if (message.sellAmount) {
        info.sellAmountFormatted = formatUnits(
          BigInt(message.sellAmount),
          sellTokenInfo.decimals,
        )
      }
      if (message.buyAmount) {
        info.buyAmountFormatted = formatUnits(
          BigInt(message.buyAmount),
          buyTokenInfo.decimals,
        )
      }
    }

    if (message.validTo) {
      info.validUntil = new Date(message.validTo * 1000).toLocaleString()
    }

    if (message.user) {
      info.user = message.user
    }

    return info
  }, [parsedData, WELL_KNOWN_TOKENS, enhancedProtocol])

  return (
    <Layout loading={loading} loadingTitle="Signing...">
      <Layout.Header>
        <Layout.Header.Default
          content={
            protocolLoading ? (
              'Detecting protocol...'
            ) : protocolInfo?.detected ? (
              <>
                Review the <strong>{protocolInfo.action}</strong> details below
                from <strong>{protocolInfo.name}</strong>.
              </>
            ) : (
              'Review the signature details below.'
            )
          }
          icon={
            protocolLoading
              ? LucideLoader2
              : protocolInfo?.detected
                ? LucideShieldCheck
                : LucidePenTool
          }
          title={
            protocolLoading
              ? 'Detecting Protocol'
              : protocolInfo?.detected
                ? `${protocolInfo.name} ${protocolInfo.action}`
                : 'Sign Typed Data'
          }
          variant={protocolInfo?.detected ? 'default' : 'warning'}
        />
      </Layout.Header>

      <Layout.Content>
        {protocolInfo?.detected && messageInfo?.type === 'swap' ? (
          // Enhanced protocol display
          <div className="rounded-lg bg-surface">
            <div className="px-3 pt-2 pb-3">
              <div className="mb-3 flex items-center justify-between">
                <div className="font-medium text-[14px] text-secondary">
                  {protocolInfo.name} Order
                </div>
                <button
                  className="flex items-center gap-1 text-secondary text-xs hover:text-primary"
                  onClick={() => copyToClipboard(JSON.stringify(parsedData))}
                  title="Copy signature data for debugging"
                  type="button"
                >
                  <CopyIcon className="size-3" />
                  Copy
                </button>
              </div>

              <div className="space-y-2">
                {/* Send Asset */}
                <div className="flex items-center gap-2 font-medium">
                  <div className="flex size-6 items-center justify-center rounded-full bg-gray5">
                    <ArrowUpRight className="size-4 text-secondary" />
                  </div>
                  <div>
                    {messageInfo.sellToken.label || 'Send'}{' '}
                    <span className="text-secondary">
                      {messageInfo.sellAmountFormatted}
                    </span>{' '}
                    {messageInfo.sellToken.symbol}
                  </div>
                </div>

                {/* Receive Asset */}
                <div className="flex items-center gap-2 font-medium">
                  <div className="flex size-6 items-center justify-center rounded-full bg-successTint">
                    <ArrowDownLeft className="size-4 text-success" />
                  </div>
                  <div>
                    {messageInfo.buyToken.label || 'Receive'}{' '}
                    <span className="text-success">
                      {messageInfo.buyAmountFormatted}
                    </span>{' '}
                    {messageInfo.buyToken.symbol}
                  </div>
                </div>

                {messageInfo.validUntil && (
                  <div className="border-primary/10 border-t pt-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-secondary">Valid until:</span>
                      <span className="font-medium text-primary">
                        {messageInfo.validUntil}
                      </span>
                    </div>
                  </div>
                )}

                <div className="border-primary/10 border-t pt-2">
                  <div className="flex items-center gap-2 text-secondary text-xs">
                    {protocolInfo?.verificationLevel === 'curated' ? (
                      <>
                        <LucideShieldCheck className="size-4 text-green-600" />
                        <span>✅ Decoder verified by Porto Core Team</span>
                      </>
                    ) : protocolInfo?.verificationLevel === 'community' ? (
                      <>
                        <LucideShieldCheck className="size-4 text-blue-600" />
                        <span>🔍 Community verified detector</span>
                      </>
                    ) : protocolInfo?.verificationLevel === 'certified' ? (
                      <>
                        <LucideShieldCheck className="size-4 text-purple-600" />
                        <span>🛡️ Porto certified detector</span>
                      </>
                    ) : (
                      <>
                        <LucideShieldCheck className="size-4 text-green-600" />
                        <span>
                          Recognized protocol - transaction details verified
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Fallback display for unknown protocols
          <div className="space-y-3">
            <div className="rounded-lg bg-surface">
              <div className="px-3 pt-2 pb-3">
                <div className="mb-3 flex items-center justify-between">
                  <div className="font-medium text-[14px] text-secondary">
                    Unknown Protocol
                  </div>
                  <button
                    className="flex items-center gap-1 text-secondary text-xs hover:text-primary"
                    onClick={() => copyToClipboard(JSON.stringify(parsedData))}
                    title="Copy signature data for debugging"
                    type="button"
                  >
                    <CopyIcon className="size-3" />
                    Copy
                  </button>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <LucideTriangleAlert className="size-4 text-amber-600" />
                  <div>
                    <div className="font-medium text-primary">
                      Protocol not recognized
                    </div>
                    <div className="mt-1 text-secondary text-xs">
                      Please verify the details carefully before signing
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Layout.Content>

      <Layout.Footer>
        <Layout.Footer.Actions>
          <Button
            className="flex-grow"
            onClick={() => onReject()}
            type="button"
          >
            Reject
          </Button>

          <Button
            className="flex-grow"
            onClick={() => onApprove()}
            type="button"
            variant="accent"
          >
            Sign {protocolInfo?.detected ? protocolInfo.action : 'Data'}
          </Button>
        </Layout.Footer.Actions>

        {account?.address && (
          <Layout.Footer.Account address={account.address} />
        )}
      </Layout.Footer>
    </Layout>
  )
}

export namespace SignTypedData {
  export type Props = {
    address?: Address.Address | undefined
    typedDataString: string
    loading?: boolean | undefined
    onApprove: () => void
    onReject: () => void
  }
}

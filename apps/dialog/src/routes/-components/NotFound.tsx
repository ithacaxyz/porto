import { Button } from '@porto/apps/components'
import { useMutation } from '@tanstack/react-query'
import { Json } from 'ox'
import { Actions, Hooks } from 'porto/remote'
import { useEffect, useState } from 'react'
import { porto } from '~/lib/Porto'
import { Layout } from '~/routes/-components/Layout'
import LucideTriangleAlert from '~icons/lucide/triangle-alert'

// Custom x402 Logo component
const X402Logo = () => (
  <img alt="x402 Logo" className="h-6 w-6" src="./icons/favicon-96x96.png" />
)

export function NotFound() {
  const request = Hooks.useRequest(porto)
  const [currentTime, setCurrentTime] = useState(Date.now())

  const respond = useMutation({
    mutationFn() {
      return Actions.respond(porto, request!)
    },
  })

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Special handling for specific methods
  const isSignTypedData =
    request?.method === 'eth_signTypedData_v4' ||
    (request && JSON.stringify(request).includes('eth_signTypedData_v4'))

  // For now, treat all eth_signTypedData_v4 as x402 Payment
  const isX402Payment = isSignTypedData

  if (isSignTypedData) {
    // Your special logic here before showing the dialog
    console.log('Detected eth_signTypedData_v4 request:', request)
    if (isX402Payment) {
      console.log(
        'This is an x402 Payment (TransferWithAuthorization):',
        request.params?.[1],
      )
    }
    // You could trigger analytics, validation, etc.
  }

  return (
    <Layout loading={respond.isPending} loadingTitle="Responding...">
      <Layout.Header>
        <Layout.Header.Default
          content={
            isX402Payment
              ? "You're about to authorize a payment from your Porto account, please review the details below carefully."
              : isSignTypedData
                ? 'Special handling for eth_signTypedData_v4! Blaine detected this signature request.'
                : `Blaine olivia here! UI support for method "${request?.method}" is not implemented yet. You may still proceed by rejecting or responding.`
          }
          icon={isX402Payment ? X402Logo : LucideTriangleAlert}
          title={
            isX402Payment
              ? 'Paywalled Content Detected'
              : isSignTypedData
                ? 'Sign Typed Data'
                : 'Method Not implemented'
          }
          variant="warning"
        />
      </Layout.Header>

      <Layout.Content>
        {isX402Payment ? (
          <div className="space-y-4">
            {/* Payment Details Section */}
            <div className="rounded-lg bg-th_field">
              <div className="px-3 pt-2 pb-2 font-bold text-[14px] text-th_field-secondary">
                Payment Details
              </div>
              <div className="px-3 pb-2">
                {(() => {
                  // Debug: Log the request structure
                  console.log('Full request for payment details:', request)

                  // Parse the typed data from params[1] which is a JSON string
                  let parsedTypedData = null
                  let message = null
                  let domain = null

                  try {
                    // The typed data is in params[1] as a JSON string
                    const typedDataString = request?.params?.[1]
                    if (
                      typedDataString &&
                      typeof typedDataString === 'string'
                    ) {
                      parsedTypedData = JSON.parse(typedDataString)
                      message = parsedTypedData.message
                      domain = parsedTypedData.domain
                      console.log('Parsed typed data:', parsedTypedData)
                      console.log('Parsed message:', message)
                      console.log('Parsed domain:', domain)
                    }
                  } catch (e) {
                    console.log('Failed to parse typed data:', e)
                  }

                  const finalMessage = message
                  const finalDomain = domain

                  // Format address for display
                  const formatAddress = (addr: any) => {
                    if (!addr) return 'Unknown'
                    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
                  }

                  return (
                    <div className="space-y-1.5">
                      {/* Payment Details */}
                      <div className="space-y-1.5">
                        {/* Amount */}
                        <div className="flex h-5.5 items-center justify-between text-[14px]">
                          <span className="text-[14px] text-th_base-secondary leading-4">
                            Amount
                          </span>
                          <span className="font-medium text-[16px] tabular-nums leading-4">
                            {(() => {
                              // Use the parsed message value
                              const rawValue = finalMessage?.value
                              if (rawValue) {
                                try {
                                  // USDC has 6 decimals, so 750 = 0.000750 USDC
                                  const num = Number.parseInt(rawValue)
                                  const formatted = (num / 1000000).toFixed(6)
                                  return `$${formatted} USDC`
                                } catch {
                                  return `${rawValue} USDC (raw)`
                                }
                              }
                              return 'Amount not found'
                            })()}
                          </span>
                        </div>
                        {/* Type */}
                        <div className="flex h-5.5 items-center justify-between text-[14px]">
                          <span className="text-[14px] text-th_base-secondary leading-4">
                            Type
                          </span>
                          <span className="font-medium leading-4">
                            Payment (x402)
                          </span>
                        </div>

                        {/* From Address */}
                        {finalMessage?.from && (
                          <div className="flex h-5.5 items-center justify-between text-[14px]">
                            <span className="text-[14px] text-th_base-secondary leading-4">
                              From
                            </span>
                            <span className="font-medium font-mono leading-4">
                              {formatAddress(finalMessage.from)}
                            </span>
                          </div>
                        )}

                        {/* To Address */}
                        {finalMessage?.to && (
                          <div className="flex h-5.5 items-center justify-between text-[14px]">
                            <span className="text-[14px] text-th_base-secondary leading-4">
                              To
                            </span>
                            <span className="font-medium font-mono leading-4">
                              {formatAddress(finalMessage.to)}
                            </span>
                          </div>
                        )}

                        {/* Token */}
                        {finalDomain?.name && (
                          <div className="flex h-5.5 items-center justify-between text-[14px]">
                            <span className="text-[14px] text-th_base-secondary leading-4">
                              Token
                            </span>
                            <span className="font-medium leading-4">
                              {finalDomain.name}
                            </span>
                          </div>
                        )}

                        {/* Token Contract */}
                        {finalDomain?.verifyingContract && (
                          <div className="flex h-5.5 items-center justify-between text-[14px]">
                            <span className="text-[14px] text-th_base-secondary leading-4">
                              Contract
                            </span>
                            <span className="font-medium font-mono leading-4">
                              {formatAddress(finalDomain.verifyingContract)}
                            </span>
                          </div>
                        )}

                        {/* Expiration */}
                        {finalMessage?.validBefore && (
                          <div className="flex h-5.5 items-center justify-between text-[14px]">
                            <span className="text-[14px] text-th_base-secondary leading-4">
                              Expires in
                            </span>
                            <span className="font-medium leading-4">
                              {(() => {
                                const expiresAt =
                                  Number.parseInt(finalMessage.validBefore) *
                                  1000
                                const diffMs = expiresAt - currentTime

                                if (diffMs <= 0)
                                  return (
                                    <span className="text-red-400">
                                      Expired
                                    </span>
                                  )

                                const diffSeconds = Math.floor(diffMs / 1000)
                                const diffMinutes = Math.floor(diffSeconds / 60)
                                const diffHours = Math.floor(diffMinutes / 60)

                                if (diffHours > 0) {
                                  return (
                                    <span className="font-semibold text-red-400 tabular-nums">
                                      {diffHours} hour
                                      {diffHours !== 1 ? 's' : ''}
                                    </span>
                                  )
                                }
                                if (diffMinutes > 0) {
                                  return (
                                    <span className="font-semibold text-red-400 tabular-nums">
                                      {diffMinutes} minute
                                      {diffMinutes !== 1 ? 's' : ''}
                                    </span>
                                  )
                                }
                                return (
                                  <span className="font-semibold text-red-400 tabular-nums">
                                    {diffSeconds} second
                                    {diffSeconds !== 1 ? 's' : ''}
                                  </span>
                                )
                              })()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        ) : (
          <pre className="max-h-[400px] overflow-scroll rounded-lg border border-th_base bg-th_field p-3 text-[14px] text-th_base leading-[22px]">
            {Json.stringify(request ?? {}, null, 2)}
          </pre>
        )}
      </Layout.Content>

      <Layout.Footer>
        <Layout.Footer.Actions>
          <Button
            className="flex-grow"
            onClick={() => Actions.reject(porto, request!)}
            type="button"
          >
            Reject
          </Button>

          <Button
            className="flex-grow"
            onClick={() => respond.mutate()}
            type="button"
            variant={isX402Payment ? 'primary' : 'warning'}
          >
            {isX402Payment ? 'Pay' : 'Respond'}
          </Button>
        </Layout.Footer.Actions>
      </Layout.Footer>
    </Layout>
  )
}

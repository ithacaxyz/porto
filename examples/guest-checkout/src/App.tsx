import { useRef, useState } from 'react'
import { type Address, erc20Abi, type Hex, isAddress, parseUnits } from 'viem'
import { writeContract } from 'viem/actions'
import { normalize } from 'viem/ens'
import { chain, client, mainnetClient, porto, usdcAddress } from './config'
import { Button } from './ui/Button/Button'
import { CopyButton } from './ui/CopyButton/CopyButton'
import { Input } from './ui/Input/Input'

export function App() {
  return (
    <>
      <style>{`
        .container-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
          background: #F9F9F9;
        }
        .container {
          background: white;
          border-radius: 16px;
          padding: 48px 48px 40px;
          width: 520px;
          min-width: 400px;
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
        }
        @media (max-width: 600px) {
          .container {
            padding: 20px;
            border-radius: 0;
            box-shadow: none;
            width: 100%;
          }
          .container-wrapper {
            padding: 0;
            align-items: stretch;
          }
        }
      `}</style>
      <div className="container-wrapper">
        <div className="container">
          <Send />
        </div>
      </div>
    </>
  )
}

function Send() {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('5')
  const ens = useEnsResolver(setRecipient)

  const [hash, setHash] = useState<Hex | null>(null)
  const [error, setError] = useState<unknown | null>(null)
  const [isPending, setIsPending] = useState(false)
  const cancelTx = useRef<(() => void) | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!recipient || !amount || !isAddress(recipient)) return

    let cancelled = false
    cancelTx.current?.()
    cancelTx.current = () => {
      cancelled = true
    }

    setIsPending(true)
    setError(null)
    setHash(null)

    try {
      // disconnect first
      await client.request({ method: 'wallet_disconnect' })

      const txHash = await writeContract(client, {
        abi: erc20Abi,
        account: null,
        address: usdcAddress[chain.id],
        args: [recipient, parseUnits(amount, 6)],
        functionName: 'transfer',
      })

      if (!cancelled) setHash(txHash)
    } catch (err) {
      if (cancelled) return
      const { shortMessage: errMessage } = err as { shortMessage: string }
      console.log('Transaction error:', errMessage)
      if (errMessage.includes('User rejected the request.')) return
      setError(err)
    } finally {
      if (!cancelled) {
        cancelTx.current = null
        setIsPending(false)
      }
    }
  }

  return (
    <>
      <div
        style={{
          marginBottom: 32,
          textAlign: 'left',
        }}
      >
        <div
          style={{
            alignItems: 'start',
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <h1
            style={{
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            Porto Guest Mode
          </h1>
        </div>
        <p
          style={{
            color: '#666',
            lineHeight: 1.5,
            marginBottom: 16,
            textAlign: 'left',
          }}
        >
          Transactions can be sent without a connected account, letting Porto
          handle the account connection for you.
        </p>
      </div>
      <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 12 }}>
          <label
            style={{
              color: '#666',
              display: 'block',
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 8,
            }}
          >
            Send a payment, with no prior connection
          </label>
          <Input
            adornments={
              ens.isResolving ? { end: `resolving ${recipient}…` } : undefined
            }
            autoFocus
            invalid={
              recipient !== '' &&
              !isAddress(recipient) &&
              !recipient.endsWith('.eth')
            }
            onBlur={() => {
              if (recipient.endsWith('.eth'))
                ens.resolve(recipient as `${string}.eth`)
            }}
            onChange={setRecipient}
            onFocus={ens.cancel}
            placeholder="0x123… or example.eth"
            type="text"
            value={recipient}
          />
        </div>

        <div
          style={{
            marginBottom: 24,
          }}
        >
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              gap: 12,
            }}
          >
            <div
              style={{
                flex: 1,
                minWidth: 0,
              }}
            >
              <Input
                adornments={{
                  start: {
                    label: '$',
                    type: 'solid',
                  },
                }}
                inputMode="numeric"
                onChange={setAmount}
                placeholder="5"
                value={amount}
              />
            </div>
            <div style={{ flexShrink: 0 }}>
              <Button
                disabled={
                  !recipient || !amount || !isAddress(recipient) || isPending
                }
                loading={isPending ? 'Sending…' : false}
                size="medium"
                style={{ minWidth: 100 }}
                type="submit"
                variant="primary"
              >
                Send
              </Button>
            </div>
          </div>
        </div>

        {hash && (
          <Info type="info">
            <a
              href={`https://${chain.id === 84532 ? 'sepolia.' : ''}basescan.org/tx/${hash}`}
              rel="noopener noreferrer"
              style={{ textDecoration: 'underline' }}
              target="_blank"
              title={hash}
            >
              View transaction
            </a>
          </Info>
        )}
        {error ? <Info type="error">{(error as Error).message}</Info> : null}
      </form>
      <CodePreview
        amount={amount}
        recipient={isAddress(recipient) ? recipient : null}
      />
    </>
  )
}

function Info({
  children,
  type = 'info',
}: {
  children: React.ReactNode
  type?: 'info' | 'error'
}) {
  const isError = type === 'error'
  return (
    <div
      style={{
        background: isError ? '#fef2f2' : '#f0f9ff',
        borderColor: isError ? '#fecaca' : '#bfdbfe',
        borderRadius: 8,
        borderWidth: 1,
        color: isError ? '#dc2626' : '#0369a1',
        fontSize: 14,
        marginTop: 16,
        padding: 12,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
    >
      {children}
    </div>
  )
}

function CodePreview({
  recipient,
  amount,
}: {
  recipient: Address | null
  amount: string
}) {
  const displayRecipient =
    recipient && isAddress(recipient) ? recipient : '<address>'
  const displayAmount = amount || '5'

  const plainCode = `await writeContract(client, {
  abi: erc20Abi,
  account: null,
  address: usdcAddress,
  functionName: "transfer",
  args: [
    "${displayRecipient}",
    parseUnits("${displayAmount}", 6),
  ],
})`

  return (
    <div>
      <label
        style={{
          color: '#666',
          display: 'block',
          fontSize: 14,
          fontWeight: 500,
          marginBottom: 8,
        }}
      >
        By using this code
      </label>
      <div style={{ position: 'relative' }}>
        <pre
          style={{
            background: '#f9f9f9',
            border: '1px solid #e0e0e0',
            borderRadius: 8,
            fontSize: 12,
            lineHeight: 1.6,
            overflowX: 'auto',
            padding: 16,
          }}
        >
          {`await writeContract(client, {
  abi: erc20Abi,
  `}
          <span
            style={{ background: '#fef3c7', borderRadius: 2, padding: '0 2px' }}
          >
            account: null
          </span>
          {`, `}
          <span style={{ color: '#999' }}>// let Porto handle the account</span>
          {`
  address: usdcAddress,
  functionName: "transfer",
  args: [
    "${displayRecipient}",
    parseUnits("${displayAmount}", 6),
  ],
})`}
        </pre>
        <div
          style={{
            bottom: 12,
            position: 'absolute',
            right: 12,
          }}
        >
          <CopyButton size="mini" value={plainCode} variant="content" />
        </div>
      </div>
    </div>
  )
}

function useEnsResolver(onResolved: (address: Address) => void = () => {}) {
  const [isResolving, setIsResolving] = useState(false)
  const cancelFn = useRef<(() => void) | null>(null)

  const resolve = async (name: `${string}.eth`) => {
    let cancelled = false
    cancelFn.current?.()
    cancelFn.current = () => {
      cancelled = true
      cancelFn.current = null
    }
    setIsResolving(true)

    try {
      const address = await mainnetClient.getEnsAddress({
        name: normalize(name),
      })
      if (!cancelled && address) onResolved(address)
    } catch (error) {
      if (cancelled) return
      console.error('ENS resolution failed:', error)
    } finally {
      if (cancelled) return
      cancelFn.current?.()
      setIsResolving(false)
    }
  }

  const cancel = () => {
    cancelFn.current?.()
    setIsResolving(false)
  }

  return {
    cancel,
    isResolving,
    resolve,
  }
}

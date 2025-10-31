import { useState } from 'react'
import { erc20Abi, isAddress, parseUnits, type Address } from 'viem'
import { normalize } from 'viem/ens'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { Button, CopyButton, Input, Ui } from '@porto/ui'
import { chain, mainnetClient, usdcAddress } from './config'

export function App() {
  return (
    <Ui>
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
    </Ui>
  )
}

function Send() {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('5')
  const [isResolving, setIsResolving] = useState(false)
  const [resolvingName, setResolvingName] = useState('')

  const resolveEns = async (name: string) => {
    setIsResolving(true)
    setResolvingName(name)
    try {
      const address = await mainnetClient.getEnsAddress({
        name: normalize(name),
      })
      if (address) setRecipient(address)
    } catch (error) {
      console.error('ENS resolution failed:', error)
    } finally {
      setIsResolving(false)
      setResolvingName('')
    }
  }

  const cancelResolve = () => {
    setIsResolving(false)
    setResolvingName('')
  }

  const { data: hash, error, isPending, writeContract } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!recipient || !amount || !isAddress(recipient)) return

    writeContract({
      abi: erc20Abi,
      address: usdcAddress[chain.id],
      functionName: 'transfer',
      args: [recipient, parseUnits(amount, 6)],
    })
  }

  return (
    <div>
      <div
        style={{
          textAlign: 'left',
          marginBottom: 32,
        }}
      >
        <h1 style={{ fontSize: 24, marginBottom: 8, fontWeight: 600 }}>
          Porto Guest Mode
        </h1>
        <p
          style={{
            textAlign: 'left',
            color: '#666',
            marginBottom: 16,
            lineHeight: 1.5,
          }}
        >
          Transactions can be sent without a connected account, letting Porto
          handle the account connection for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              display: 'block',
              marginBottom: 8,
              fontSize: 14,
              fontWeight: 500,
              color: '#666',
            }}
          >
            Send a payment
          </label>
          <Input
            value={recipient}
            onChange={setRecipient}
            onFocus={cancelResolve}
            autoFocus
            onBlur={() => {
              if (recipient.endsWith('.eth')) {
                resolveEns(recipient)
              }
            }}
            placeholder="0x123… or example.eth"
            type="text"
            invalid={
              recipient !== '' &&
              !isAddress(recipient) &&
              !recipient.endsWith('.eth')
            }
            adornments={
              isResolving
                ? {
                    end: `resolving ${resolvingName}…`,
                  }
                : undefined
            }
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Input
                value={amount}
                onChange={setAmount}
                placeholder="5"
                type="number"
                adornments={{
                  start: { type: 'solid', label: '$' },
                }}
              />
            </div>
            <div style={{ flexShrink: 0 }}>
              <Button
                type="submit"
                disabled={
                  !recipient || !amount || !isAddress(recipient) || isPending
                }
                loading={isPending ? 'Paying…' : false}
                variant="primary"
                size="medium"
                style={{ minWidth: 100 }}
              >
                Pay
              </Button>
            </div>
          </div>
        </div>

        {hash && (
          <Info type="info">
            <a
              href={`https://${chain.id === 84532 ? 'sepolia.' : ''}basescan.org/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              title={hash}
              style={{ textDecoration: 'underline' }}
            >
              View transaction
            </a>
          </Info>
        )}
        {isConfirming && <Info type="info">Waiting for confirmation…</Info>}
        {isConfirmed && <Info type="info">Transaction confirmed!</Info>}
        {error && <Info type="error">{error.message}</Info>}
      </form>

      <CodePreview
        amount={amount}
        recipient={isAddress(recipient) ? recipient : null}
      />
    </div>
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
        marginTop: 16,
        padding: 12,
        background: isError ? '#fef2f2' : '#f0f9ff',
        borderWidth: 1,
        borderColor: isError ? '#fecaca' : '#bfdbfe',
        borderRadius: 8,
        fontSize: 14,
        color: isError ? '#dc2626' : '#0369a1',
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

  const code = `writeContract({
  abi: erc20Abi,
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
          fontSize: 14,
          fontWeight: 500,
          marginBottom: 8,
          display: 'block',
          color: '#666',
        }}
      >
        Using this code
      </label>
      <div style={{ position: 'relative' }}>
        <pre
          style={{
            background: '#f9f9f9',
            border: '1px solid #e0e0e0',
            borderRadius: 8,
            padding: 16,
            overflowX: 'auto',
            fontSize: 12,
            lineHeight: 1.6,
          }}
        >
          {code}
        </pre>
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            right: 12,
          }}
        >
          <CopyButton value={code} size="mini" variant="content" />
        </div>
      </div>
    </div>
  )
}

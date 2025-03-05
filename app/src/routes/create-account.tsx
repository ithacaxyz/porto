import { Link, Navigate, createFileRoute } from '@tanstack/react-router'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { useAccount, useConnectors } from 'wagmi'

import { Button } from '~/components/Button'
import { IndeterminateLoader } from '~/components/IndeterminateLoader'
import { config } from '~/lib/Wagmi'
import { cn, shuffleArray } from '~/utils'

export const Route = createFileRoute('/create-account')({
  component: RouteComponent,
})

const emojisArray = shuffleArray([
  '🍕',
  '🧁',
  '🦋',
  '❤️',
  '😈',
  '🌟',
  '🌀',
  '🌸',
  '🌈',
  '🚀',
  '🌊',
  '⚡',
  '🐰',
  '🐶',
  '🐱',
  '🐵',
  '🐸',
  '🐮',
  '🐔',
])

function RouteComponent() {
  const [label, setLabel] = React.useState('')
  const [emojis, setEmojis] = React.useState<string[]>(emojisArray)
  const [selectedEmoji, setSelectedEmoji] = React.useState<string>(
    emojis[Math.floor(emojis.length / 2)]!, // middle item
  )

  const account = useAccount()
  const connect = Hooks.useConnect({ config })
  const [connector] = useConnectors({ config })

  if (account.isConnected) return <Navigate to="/" />

  if (connect.isPending) {
    return (
      <div className="-mt-48 mx-auto flex h-screen w-screen items-center justify-center">
        <IndeterminateLoader title="Signing up…" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'mx-auto flex h-screen w-full max-w-[400px] flex-col content-between items-stretch space-y-6 rounded-xl bg-gray1 py-4 text-center',
        'sm:my-52 sm:h-[500px] sm:shadow-sm sm:outline sm:outline-gray4',
      )}
    >
      <div className="flex justify-between sm:px-5">
        <img src="/icons/wallet.svg" alt="Porto" className="my-auto size-11" />
        <Link
          to="/create-account"
          className="my-auto flex h-9 w-[110px] items-center justify-center rounded-2xl bg-gray3 font-medium"
        >
          <p className="my-auto">
            Support <span className="ml-1">→</span>
          </p>
        </Link>
      </div>

      <div className="mt-10 size-full px-5 sm:mt-1">
        <h1 className="font-medium text-2xl">Name your passkey</h1>
        <p className="mx-6 my-3 text-pretty text-primary">
          This will be a simple, memorable identifier for your Ithaca wallet.
        </p>
        <div className="relative pt-3 sm:mx-2">
          <input
            type="text"
            value={label}
            placeholder="Enter a name…"
            onChange={(event) => setLabel(event.target.value)}
            className="w-full rounded-lg border border-gray6 bg-gray1 px-3 py-2 text-gray12 text-lg focus:outline-none focus:ring-2 focus:ring-gray3"
          />
        </div>
      </div>

      <div className="">
        <p className="-mt-1 text-secondary">Add a memorable icon</p>

        <div
          className={cn(
            'scrollbar-none mt-3 mb-6 flex w-full select-none justify-center gap-2.5 overflow-hidden overflow-x-auto',
          )}
        >
          {emojis.map((emoji) => (
            <div
              key={emoji}
              className={cn(
                'my-2 flex items-center justify-center rounded-full text-2xl outline outline-white transition-colors',
                selectedEmoji === emoji
                  ? 'border-2 border-gray3 p-2'
                  : 'border-gray9 hover:border-gray10',
              )}
            >
              <button
                type="button"
                onClick={() => {
                  setSelectedEmoji(emoji)
                  const currentIndex = emojis.indexOf(emoji)
                  const newIndex = Math.floor(emojis.length / 2)
                  const newEmojis = emojis.toSpliced(
                    newIndex,
                    0,
                    emojis.splice(currentIndex, 1)[0]!,
                  )
                  setEmojis(newEmojis)

                  // `requestAnimationFrame` to ensure the DOM has updated before scrolling
                  requestAnimationFrame(() => {
                    const button = document.querySelector(
                      `button[data-emoji="${emoji}"]`,
                    )
                    const container = button?.closest('.scrollbar-none')
                    if (button && container) {
                      const containerRect = container.getBoundingClientRect()
                      const buttonRect = button.getBoundingClientRect()
                      const scrollLeft =
                        container.scrollLeft +
                        (buttonRect.left - containerRect.left) -
                        (containerRect.width - buttonRect.width) / 2
                      container.scrollTo({
                        left: scrollLeft,
                        behavior: 'smooth',
                      })
                    }
                  })
                }}
                data-emoji={emoji}
                className={cn(
                  'my-auto flex shrink-0 items-center justify-center rounded-full transition-colors',
                  selectedEmoji === emoji
                    ? 'size-16 bg-accent/20 text-4xl text-white'
                    : 'size-12 bg-gray3 text-2xl hover:bg-gray4',
                )}
              >
                {emoji}
              </button>
            </div>
          ))}
        </div>
        <div className="mb-2 sm:mb-1 sm:px-5">
          <Button
            onClick={() => {
              connect.mutate({
                connector: connector!,
                createAccount: {
                  label:
                    label.length > 0 ? `${selectedEmoji}-${label}` : undefined,
                },
              })
            }}
            variant="invert"
            className="w-full rounded-lg font-medium text-lg"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}

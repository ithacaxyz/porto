import { Link, Navigate, createFileRoute } from '@tanstack/react-router'
import { Hooks } from 'porto/wagmi'
import * as React from 'react'
import { useAccount, useConnectors } from 'wagmi'

import { cx } from 'cva'
import { Button } from '~/components/Button'
import { IndeterminateLoader } from '~/components/IndeterminateLoader'
import { useThemeMode } from '~/hooks/use-theme-mode'
import * as Constants from '~/lib/Constants'
import { config } from '~/lib/Wagmi'

export const Route = createFileRoute('/_manager/create-account/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { theme } = useThemeMode()

  const [label, setLabel] = React.useState('')
  const [emojis, setEmojis] = React.useState<string[]>(Constants.emojisArray)
  const [selectedEmoji, setSelectedEmoji] = React.useState<string>(
    emojis[Math.floor(emojis.length / 2)]!, // middle item
  )

  const account = useAccount()
  const connect = Hooks.useConnect()
  const [connector] = useConnectors({ config })

  if (account.isConnected) return <Navigate to="/" />

  if (connect.isPending) {
    return (
      <div className="-mt-68 mx-auto flex h-screen w-screen items-center justify-center">
        <IndeterminateLoader title="Signing up…" />
      </div>
    )
  }

  return (
    <main className="flex size-full max-h-[90%] max-w-full items-center justify-center">
      <div
        className={cx(
          'mx-auto flex size-full w-[85%] flex-col content-between items-stretch space-y-6 rounded-xl py-4 text-center sm:w-[420px] sm:bg-gray1',
          'sm:h-[550px] sm:shadow-sm sm:outline sm:outline-gray4',
        )}
      >
        <header className="mt-4 flex justify-between sm:mt-1 sm:px-5">
          <Link to="/" from="/create-account" className="">
            <img
              alt="Porto wallet icon"
              className="my-auto size-11"
              src={theme === 'light' ? '/icon-light.png' : '/icon-dark.png'}
            />
          </Link>
          <Link
            to="/create-account"
            className="my-auto flex h-9 w-[120px] items-center justify-center rounded-2xl bg-gray3 font-medium hover:bg-gray4"
          >
            <p className="my-auto">
              Support <span className="ml-1">→</span>
            </p>
          </Link>
        </header>

        <div className="mt-10 size-full sm:mt-1 sm:px-4">
          <h1 className="font-medium text-2xl">Name your passkey</h1>
          <p className="mx-6 my-3 text-pretty text-gray10">
            This will be a simple, memorable identifier for your Ithaca wallet.
          </p>
          <div className="relative pt-3 sm:mx-2">
            <input
              type="text"
              value={label}
              maxLength={32}
              spellCheck={false}
              autoCorrect="off"
              autoComplete="off"
              autoCapitalize="off"
              placeholder="Enter a name…"
              onChange={(event) => setLabel(event.target.value)}
              className="h-12.5 w-full rounded-2xl border border-gray6 bg-gray1 px-4 py-2 text-gray12 text-lg focus:outline-none focus:ring-2 focus:ring-blue3"
            />
          </div>
        </div>

        <div className="">
          <p className="-mt-1 text-gray10">Add a memorable icon</p>

          <div
            className={cx(
              'scrollbar-none mt-3 mb-6 flex w-full select-none justify-center gap-2.5 overflow-hidden overflow-x-auto sm:gap-4',
            )}
          >
            {emojis.map((emoji) => (
              <div
                key={emoji}
                className={cx(
                  'my-2 flex items-center justify-center rounded-full text-2xl transition-colors',
                  selectedEmoji === emoji
                    ? 'border-2 border-blue9 p-2'
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
                  className={cx(
                    'my-auto flex shrink-0 items-center justify-center rounded-full transition-colors',
                    selectedEmoji === emoji
                      ? 'size-16 bg-blue9 text-4xl text-white'
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
                const selectedLabel =
                  label.length > 0 ? `!${selectedEmoji}-${label}` : undefined
                connect.mutate({
                  connector: connector as never,
                  createAccount: {
                    label,
                  },
                })
                if (selectedLabel) {
                  localStorage.setItem('_porto_account_label', label)
                  localStorage.setItem('_porto_account_emoji', selectedEmoji)
                }
              }}
              variant="accent"
              className="mb-2 h-12 w-full rounded-2xl font-medium text-xl"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}

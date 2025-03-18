import * as Ariakit from '@ariakit/react'
import { cx } from 'cva'
import * as React from 'react'
import { toast } from 'sonner'
import { useAccount } from 'wagmi'
import ReceiveIcon from '~icons/bitcoin-icons/receive-filled'
import ArrowRightIcon from '~icons/lucide/arrow-right'
import CheckIcon from '~icons/lucide/check'
import CopyIcon from '~icons/lucide/copy'
import XIcon from '~icons/lucide/x'

import { QrCode } from '~/components/QrCode'
import { StringFormatter } from '~/utils'

export function DepositDialog({
  className,
}: {
  className?: string
}) {
  const [isOpen, setIsOpen] = React.useState(false)

  const { address } = useAccount()

  const [isCopied, setIsCopied] = React.useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address ?? '')
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 1_500)
    } catch (error) {
      toast.error('Failed to copy text')
    }
  }
  return (
    <Ariakit.DialogProvider>
      <Ariakit.Button
        onClick={() => setIsOpen(true)}
        className={cx(
          className,
          'col-span-1 col-start-2',
          'sm:col-start-1 sm:row-span-1 sm:row-start-1',
          'w-[125px] text-center font-semibold text-lg sm:w-[135px] sm:text-md',
          'flex h-11 items-center justify-center gap-x-1 rounded-full bg-gray7 px-1 text-center hover:bg-gray6 sm:h-11.5',
        )}
      >
        <ReceiveIcon className="size-6" />
        <span>Receive</span>
      </Ariakit.Button>
      <Ariakit.Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className={cx(
          'dialog bg-transparent! shadow-none!',
          'w-full sm:max-w-[420px]',
          'bottom-0! mt-auto! mb-4! sm:bottom-auto! sm:mt-35! sm:mb-0!',
          'w-full max-w-[90%] rounded-xl border-0 px-0 py-5 shadow-xl',
        )}
        backdrop={<div className="bg-gray12/40 backdrop-blur-xs" />}
      >
        <div
          className={cx(
            'bottom-0! mt-auto!',
            'sm:bottom-auto sm:mt-0',
            'mx-auto max-w-[450px]',
            'flex h-min max-h-min flex-col gap-y-5 border-transparent bg-transparent',
          )}
        >
          <Ariakit.DialogHeading className="h-[325px] rounded-2xl bg-gray1 p-4">
            <Ariakit.DialogDescription className="flex items-center justify-between text-left">
              <span className="font-semibold text-primary text-xl">
                Receive
              </span>

              <Ariakit.DialogDismiss className="text-secondary/50">
                <XIcon className="size-4" />
              </Ariakit.DialogDismiss>
            </Ariakit.DialogDescription>
            <div className="h-full text-left">
              <div className="flex h-full flex-col">
                <span className="text-secondary text-sm">
                  Fund your wallet with crypto.
                </span>

                <div
                  className={cx(
                    'mt-2 grid h-full max-h-[230px] grid-cols-3 grid-rows-2 rounded-xl p-5 text-white',

                    'bg-linear-to-b from-[#0090FF] via-[#0588F0] to-[#0D74CE]',
                  )}
                >
                  <span className="col-span-1 col-start-1 flex gap-x-1 place-self-start self-start text-lg">
                    <img
                      alt="Porto logo"
                      className="size-8"
                      src="/icon-dark.png"
                    />
                    <span className="mt-0.5 mb-auto">Porto</span>
                  </span>
                  <div className="col-span-1 col-start-3 row-span-1 row-start-1 flex size-full h-[85px] w-[85px] items-center justify-center place-self-end pt-5 text-white normal-case">
                    <QrCode key={address} contents={address} />
                  </div>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className={cx(
                      'col-span-3 col-start-1 row-span-1 row-start-2 mt-auto mb-2.5 flex h-[10px] items-center gap-x-2.5 text-md sm:col-span-2',
                    )}
                  >
                    <span className="my-auto mt-0.5 text-md">
                      {StringFormatter.truncate(address ?? '', {
                        start: 8,
                        end: 6,
                      })}
                    </span>
                    <span className="mt-auto flex size-6 items-center justify-center rounded-full bg-[#3C92DD]">
                      {isCopied ? (
                        <CheckIcon className="m-auto size-3" />
                      ) : (
                        <CopyIcon className="m-auto size-3" />
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </Ariakit.DialogHeading>

          <Ariakit.DialogHeading className="gap-y-2 rounded-2xl bg-gray1 p-4">
            <Ariakit.DialogDescription className="flex items-center gap-x-2">
              <img src="/icons/usdc-eth.png" alt="." />
              <span className="text-md text-primary">Supported assets</span>
            </Ariakit.DialogDescription>
            <div className="text-gray12">
              <span>
                You can deposit any ERC20 asset, but we recommend ETH or USDC.{' '}
                <span className="text-secondary">
                  Please do not send non-EVM assets.
                </span>
              </span>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-x-1 font-medium text-accent`"
              >
                <span className="mb-0.5">Learn more</span>
                <ArrowRightIcon className="size-3.5" />
              </a>
            </div>
          </Ariakit.DialogHeading>
        </div>
      </Ariakit.Dialog>
    </Ariakit.DialogProvider>
  )
}

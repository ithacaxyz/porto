import * as React from 'react'
import { useAccount } from 'wagmi'
import ReceiveIcon from '~icons/bitcoin-icons/receive-filled'
import ArrowRightIcon from '~icons/lucide/arrow-right'
import CheckIcon from '~icons/lucide/check'
import CopyIcon from '~icons/lucide/copy'
import XIcon from '~icons/lucide/x'

import { QrCode } from '~/components/QrCode'
import { Dialog } from '~/components/ui/dialog'
import { StringFormatter, cn } from '~/utils'

export function DepositDialog() {
  const { address } = useAccount()

  const [isCopied, setIsCopied] = React.useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address ?? '')
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 1_500)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }
  return (
    <Dialog>
      <Dialog.Trigger
        className={cn(
          'col-span-1 col-start-2',
          'sm:col-start-1 sm:row-span-1 sm:row-start-1',
          'w-[110px] text-center font-semibold text-lg sm:w-[120px] sm:text-md',
          'flex h-11! items-center justify-center gap-x-1 rounded-default bg-gray7 px-3.5 text-center outline hover:bg-gray6 sm:h-10',
        )}
      >
        <ReceiveIcon className="size-6" />
        <span>Receive</span>
      </Dialog.Trigger>
      <Dialog.Content
        className={cn(
          'max-w-[450px]',
          'm flex h-min max-h-min flex-col gap-y-5 border-transparent bg-transparent',
          'sm:-translate-y-1/2 -translate-y-1/5',
        )}
      >
        <Dialog.Header className="rounded-2xl bg-secondary p-4">
          <Dialog.Title className="flex items-center justify-between text-left">
            <span>Receive</span>

            <Dialog.Close className="text-secondary/50">
              <XIcon className="size-4" />
            </Dialog.Close>
          </Dialog.Title>
          <Dialog.Description className="text-left" asChild>
            <div>
              <span className="text-sm">Fund your wallet with crypto.</span>

              <div className="mt-2 grid h-[180px] grid-cols-3 grid-rows-2 rounded-xl bg-[#097EDF] p-5 text-white">
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
                  className={cn(
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
                      <CheckIcon className="m-auto size-3.5" />
                    ) : (
                      <CopyIcon className="m-auto size-3.5" />
                    )}
                  </span>
                </button>
              </div>
            </div>
          </Dialog.Description>
        </Dialog.Header>

        <Dialog.Header className="gap-y-2 rounded-2xl bg-secondary p-4">
          <Dialog.Title className="flex items-center gap-x-2">
            <img src="/icons/usdc-eth.png" alt="." />
            <span className="">Supported assets</span>
          </Dialog.Title>
          <Dialog.Description className="text-black">
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
          </Dialog.Description>
        </Dialog.Header>
      </Dialog.Content>
    </Dialog>
  )
}

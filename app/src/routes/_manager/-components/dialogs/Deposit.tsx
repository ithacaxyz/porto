import { useAccount } from 'wagmi'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { StringFormatter, cn } from '~/utils'
import ReceiveIcon from '~icons/bitcoin-icons/receive-filled'
import ArrowRightIcon from '~icons/lucide/arrow-right'
import CopyIcon from '~icons/lucide/copy'
import XIcon from '~icons/lucide/x'

export function DepositDialog() {
  const { address } = useAccount()

  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          'col-span-1 col-start-2',
          'sm:col-start-1 sm:row-span-1 sm:row-start-1',
          'w-[110px] text-center font-semibold text-lg sm:w-[120px] sm:text-md',
          'flex h-11! items-center justify-center gap-x-1 rounded-default bg-gray7 px-3.5 text-center hover:bg-gray6 sm:h-10',
        )}
      >
        <ReceiveIcon className="size-6" />
        <span>Receive</span>
      </DialogTrigger>
      <DialogContent className="mt-auto flex h-min max-h-min flex-col gap-y-5 border-transparent bg-transparent">
        <DialogHeader className="rounded-2xl bg-secondary p-4">
          <DialogTitle className="flex items-center justify-between text-left">
            <span>Receive</span>

            <DialogClose className="text-secondary/50">
              <XIcon className="size-4" />
            </DialogClose>
          </DialogTitle>
          <DialogDescription className="text-left">
            <span className="text-sm">Fund your wallet with crypto.</span>

            <div className="mt-2 grid h-[180px] grid-cols-3 grid-rows-2 rounded-xl bg-[#097EDF] p-5 text-white">
              <p className="col-span-1 col-start-1 flex gap-x-1 place-self-start self-start text-lg">
                <img alt="Porto logo" className="size-8" src="/icon-dark.png" />
                <span className="mt-0.5 mb-auto">Porto</span>
              </p>
              <div className="col-span-1 col-start-3 row-span-1 row-start-1 flex size-full h-[85px] w-[85px] items-center justify-center place-self-end pt-5 text-white normal-case">
                {/* <QrCode
                        key={'0xf4212614C7Fe0B3feef75057E88b2E77a7E23e83'}
                        contents={'0xf4212614C7Fe0B3feef75057E88b2E77a7E23e83'}
                      /> */}
                <img src="/icons/qr-code.png" alt="." className="" />
              </div>

              <button
                type="button"
                className={cn(
                  'col-span-3 col-start-1 row-span-1 row-start-2 mt-auto mb-2.5 flex h-[10px] items-center gap-x-2.5 text-md sm:col-span-2',
                )}
              >
                <p className="my-auto mt-0.5 text-md">
                  {StringFormatter.truncate(address ?? '', {
                    start: 8,
                    end: 6,
                  })}
                </p>
                <span className="mt-auto flex size-6 items-center justify-center rounded-full bg-[#3C92DD]">
                  <CopyIcon className="m-auto size-3.5" />
                </span>
              </button>
            </div>
          </DialogDescription>
        </DialogHeader>

        <DialogHeader className="gap-y-2 rounded-2xl bg-secondary p-4">
          <DialogTitle className="flex items-center gap-x-2">
            <img src="/icons/usdc-eth.png" alt="." />
            <span className="">Supported assets</span>
          </DialogTitle>
          <DialogDescription className="text-black">
            <p>
              You can deposit any ERC20 asset, but we recommend ETH or USDC.{' '}
              <span className="text-secondary">
                Please do not send non-EVM assets.
              </span>
            </p>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-x-1 font-medium text-accent`"
            >
              <span className="mb-0.5">Learn more</span>
              <ArrowRightIcon className="size-3.5" />
            </a>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

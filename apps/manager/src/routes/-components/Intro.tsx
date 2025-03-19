import { cx } from 'cva'
import { useAccount } from 'wagmi'

import { IthacaIcon } from '~/components/Ithaca'

export function Intro() {
  const account = useAccount()

  return (
    <section
      className={cx(
        account.isConnected && 'hidden',
        'shadow-[0px_4px_34px_0px_rgba(0,0,0,0.10)]',
        'flex-col items-start justify-between bg-[#0D74CE] py-6 text-white md:ml-5',
        'md:flex md:min-h-full md:rounded-2xl md:py-16',
        'relative',
      )}
    >
      <div className="pointer-events-none absolute inset-0 my-auto ml-auto hidden max-h-[750px] w-[400px] bg-[url(/porto.svg)] bg-contain bg-right-bottom bg-no-repeat md:block" />
      <p
        className={cx(
          'ml-8 flex gap-x-2 font-medium text-sm leading-[22px] sm:ml-12',
        )}
      >
        Built by
        <a
          className="my-auto flex font-mono"
          href="https://ithaca.xyz"
          rel="noreferrer"
          target="_blank"
        >
          <IthacaIcon className="mr-2 size-5" />
          Ithaca
        </a>
      </p>
      <div className="mt-auto ml-8 py-8 text-white sm:ml-12">
        <h1 className="mt-auto font-medium text-4xl">Porto</h1>
        <p className="font-normal text-lg">
          A home for your digital assets,
          <br />
          powered by Ithaca.
        </p>
      </div>
      <ul className="ml-8 flex gap-x-8 font-medium text-gray-300 text-xs sm:ml-12">
        <li>
          <a href="https://porto.sh" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </li>
        <li>
          <a href="/">Terms</a>
        </li>
        <li>
          <a href="/">Privacy</a>
        </li>
        <li>
          <a href="/">Support</a>
        </li>
      </ul>
    </section>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { cx } from 'cva'
import { useAccount } from 'wagmi'

import { DevOnly } from '~/components/DevOnly'
import { IthacaIcon } from '~/components/Ithaca'
import { Dashboard } from './-components/Dashboard'
import { Landing } from './-components/Landing'

export const Route = createFileRoute('/_manager/')({
  component: RouteComponent,
})

function RouteComponent() {
  const account = useAccount()

  return (
    <main
      className={cx(
        'font-["SF_Pro_Text"]',
        'mx-auto flex size-full max-w-[1400px] flex-col md:flex-row md:py-6 md:*:w-1/2',
      )}
    >
      <DevOnly />

      <Intro />
      {account.isConnected ? <Dashboard /> : <Landing />}
    </main>
  )
}

function Intro() {
  const account = useAccount()

  return (
    <section
      className={cx(
        account.isConnected && 'hidden',
        'shadow-[0px_4px_34px_0px_rgba(0,0,0,0.10)]',
        'flex-col items-start justify-between bg-blue11 px-0 py-6 text-white md:ml-5',
        'md:flex md:min-h-full md:rounded-2xl md:px-0 md:py-16',
      )}
    >
      <p
        className={cx('ml-12 flex gap-x-2 font-medium text-sm leading-[22px]')}
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
      <div className="mt-auto ml-12 py-8 text-white">
        <h1 className="mt-auto font-medium text-4xl">Porto</h1>
        <p className="font-normal text-lg">
          A home for your digital assets,
          <br />
          powered by Ithaca.
        </p>
      </div>
      <ul className="ml-12 flex gap-x-8 font-medium text-gray5 text-xs">
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

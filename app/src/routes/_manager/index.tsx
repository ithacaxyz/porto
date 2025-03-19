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
        'flex-col items-start justify-between bg-blue11 py-6 text-white md:ml-5',
        'md:flex md:min-h-full md:rounded-2xl md:py-16',
      )}
    >
      <div className="fixed left-0 mt-12 size-full">
        <svg
          width={499}
          height={941}
          viewBox="0 0 499 941"
          fill="none"
          className="size-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Ithaca</title>
          <g opacity={0.23}>
            <path
              d="M776.938 51.9731C776.938 23.2691 753.706 0 725.047 0H79.2801C50.6221 0 27.3881 23.2691 27.3881 51.9729V589.027C27.3881 604.974 40.2961 617.9 56.2181 617.9H748.11C764.031 617.9 776.938 604.974 776.938 589.027V51.9731Z"
              fill="white"
              fillOpacity={0.2}
            />
            <path
              d="M776.937 288.738C776.937 272.791 764.03 259.865 748.108 259.865H56.2159C40.2939 259.865 27.388 272.791 27.388 288.738V589.027C27.388 604.974 40.2939 617.9 56.2159 617.9H748.108C764.03 617.9 776.937 604.974 776.937 589.027V288.738Z"
              fill="white"
              fillOpacity={0.2}
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M748.108 236.765H56.2159C27.5579 236.765 4.32397 260.036 4.32397 288.738V589.027C4.32397 617.732 27.5579 641 56.2159 641H748.108C776.767 641 800 617.732 800 589.027V288.738C800 260.036 776.767 236.765 748.108 236.765ZM748.108 259.865C764.03 259.865 776.937 272.792 776.937 288.738V589.027C776.937 604.974 764.03 617.9 748.108 617.9H56.2159C40.2939 617.9 27.3879 604.974 27.3879 589.027V288.738C27.3879 272.792 40.2939 259.865 56.2159 259.865H748.108Z"
              fill="#0D74CE"
            />
            <path
              d="M776.937 410.01C776.937 394.063 764.03 381.135 748.108 381.135H56.2159C40.2939 381.135 27.388 394.063 27.388 410.01V589.027C27.388 604.974 40.2939 617.9 56.2159 617.9H748.108C764.03 617.9 776.937 604.974 776.937 589.027V410.01Z"
              fill="white"
              fillOpacity={0.4}
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M748.108 358.037H56.2159C27.5579 358.037 4.32397 381.305 4.32397 410.01V589.027C4.32397 617.732 27.5579 641 56.2159 641H748.108C776.767 641 800 617.732 800 589.027V410.01C800 381.305 776.767 358.037 748.108 358.037ZM748.108 381.135C764.03 381.135 776.937 394.063 776.937 410.01V589.027C776.937 604.974 764.03 617.9 748.108 617.9H56.2159C40.2939 617.9 27.3879 604.974 27.3879 589.027V410.01C27.3879 394.063 40.2939 381.135 56.2159 381.135H748.108Z"
              fill="#0D74CE"
            />
            <path
              d="M776.937 531.279C776.937 515.332 764.03 502.406 748.108 502.406H56.2159C40.2939 502.406 27.388 515.332 27.388 531.279V589.027C27.388 604.974 40.2939 617.9 56.2159 617.9H748.108C764.03 617.9 776.937 604.974 776.937 589.027V531.279Z"
              fill="white"
              fillOpacity={0.5}
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M748.108 479.306H56.2159C27.5579 479.306 4.32397 502.576 4.32397 531.279V589.027C4.32397 617.732 27.5579 641 56.2159 641H748.108C776.767 641 800 617.732 800 589.027V531.279C800 502.576 776.767 479.306 748.108 479.306ZM748.108 502.406C764.03 502.406 776.937 515.332 776.937 531.279V589.027C776.937 604.974 764.03 617.9 748.108 617.9H56.2159C40.2939 617.9 27.3879 604.974 27.3879 589.027V531.279C27.3879 515.332 40.2939 502.406 56.2159 502.406H748.108Z"
              fill="#0D74CE"
            />
            <path
              d="M151.352 51.9729H157.118C196.922 51.9729 229.19 84.2911 229.19 124.158V124.158C229.19 164.024 196.922 196.342 157.118 196.342H151.352C111.548 196.342 79.28 164.024 79.28 124.158V124.158C79.28 84.2911 111.548 51.9729 151.352 51.9729Z"
              fill="white"
            />
          </g>
        </svg>
      </div>
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
      <ul className="ml-8 flex gap-x-8 font-medium text-gray5 text-xs sm:ml-12">
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

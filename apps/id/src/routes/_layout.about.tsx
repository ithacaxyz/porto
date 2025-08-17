import { Button } from '@porto/apps/components'
import { createFileRoute, Link } from '@tanstack/react-router'
import LucideX from '~icons/lucide/x'

import { Layout } from './-components/Layout'

export const Route = createFileRoute('/_layout/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Layout.Header
        left="About Porto"
        leftClassName="min-[460px]:hidden ml-4"
        right={
          <Button render={<Link to=".." />} size="square" variant="outline">
            <LucideX className="size-5 text-gray10" />
          </Button>
        }
      />

      <div className="mx-auto flex h-full max-w-[38ch] flex-col justify-center space-y-4 px-4 py-10 align-center max-lg:justify-start max-[460px]:py-4 sm:px-0">
        <h1 className="font-medium text-2xl tracking-[-2.8%] max-[460px]:hidden">
          About Porto
        </h1>

        <p className="text-pretty text-base leading-normal tracking-wide">
          Our goal is to make web3 apps as easy to use as possible. We built a
          home for your digital assets which works instantly with apps, and can
          be created & used within seconds.
        </p>

        <p className="text-pretty text-base leading-normal tracking-wide">
          Our story starts with{' '}
          <a
            className="text-accent"
            href="https://github.com/ithacaxyz"
            rel="noreferrer"
            target="_blank"
          >
            open source infrastructure
          </a>
          , but brings us today to user experience. Under the hood, we are
          leveraging emergent EIPs, Passkeys, iFrames, and more.
        </p>

        <p className="text-pretty text-base leading-normal tracking-wide">
          If you have feedback on Porto, please share below. If you’d like to
          contribute, please visit our{' '}
          <a
            className="text-accent"
            href="https://github.com/ithacaxyz"
            rel="noreferrer"
            target="_blank"
          >
            GitHub.
          </a>
        </p>

        <p className="flex items-center gap-2 pt-5 font-medium text-base leading-[22px]">
          <span className="text-gray10 dark:text-white/50">Built by</span>
          <a
            className="h-[16px]"
            href="https://ithaca.xyz"
            rel="noreferrer"
            target="_blank"
          >
            <img alt="Ithaca" className="h-3.5" src="/ithaca.svg" />
          </a>
        </p>

        <br />

        <div className="flex w-full flex-col gap-4 *:mx-auto *:h-12 *:w-full *:max-w-full *:font-medium *:text-lg sm:flex-row sm:*:max-w-[90%]">
          <Button
            className="flex-grow"
            // biome-ignore lint/a11y/useAnchorContent: _
            render={<a href="https://github.com/ithacaxyz/porto/issues/new" />}
          >
            Share feedback
          </Button>
          <Button
            className="flex-grow"
            render={
              <a href="https://porto.sh" rel="noreferrer" target="_blank">
                Integrate now
              </a>
            }
            variant="invert"
          />
        </div>
      </div>

      <Layout.IntegrateFooter />
    </>
  )
}

import { Button } from '@porto/apps/components'
import { Link, createFileRoute } from '@tanstack/react-router'

import LucideX from '~icons/lucide/x'
import { Layout } from './-components/Layout'

export const Route = createFileRoute('/_layout/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Layout.Header
        title="About Porto"
        titleClassName="min-[460px]:hidden"
        action={
          <Button render={<Link to=".." />} variant="outline" size="square">
            <LucideX className="size-5 text-gray10" />
          </Button>
        }
      />

      <div className="mx-auto flex h-full max-w-[38ch] flex-col justify-center space-y-4 py-10 align-center max-lg:justify-start max-[460px]:py-4">
        <h1 className="font-[500] text-[27px] tracking-[-2.8%] max-[460px]:hidden">
          About Porto
        </h1>

        <p className="text-[17px] leading-[24px] tracking-[-2.8%]">
          Our goal is to make web3 apps as easy to use as possible. We built a
          home for your digital assets which works instantly with apps, and can
          be created & used within seconds.
        </p>

        <p className="text-[17px] leading-[24px] tracking-[-2.8%]">
          Our story starts with{' '}
          <a
            className="text-accent"
            href="https://github.com/ithacaxyz"
            target="_blank"
            rel="noreferrer"
          >
            open source infrastructure
          </a>
          , but brings us today to user experience. Under the hood, we are
          leveraging emergent EIPs, Passkeys, iFrames, and more.
        </p>

        <p className="text-[17px] leading-[24px] tracking-[-2.8%]">
          If you have feedback on Porto, please share below. If you’d like to
          contribute, please visit our{' '}
          <a
            className="text-accent"
            href="https://github.com/ithacaxyz"
            target="_blank"
            rel="noreferrer"
          >
            GitHub.
          </a>
        </p>

        <div />

        <div className="flex w-full gap-x-2">
          <Button
            className="flex-grow"
            // biome-ignore lint/a11y/useAnchorContent: <explanation>
            render={<a href="https://github.com/ithacaxyz/porto/issues/new" />}
          >
            Share feedback
          </Button>
          <Button
            className="flex-grow"
            render={
              // biome-ignore lint/a11y/useAnchorContent: <explanation>
              <a href="https://porto.sh" target="_blank" rel="noreferrer" />
            }
            variant="invert"
          >
            Integrate now
          </Button>
        </div>
      </div>

      <Layout.IntegrateFooter />
    </>
  )
}

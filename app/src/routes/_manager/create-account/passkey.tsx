import { Link, createFileRoute } from '@tanstack/react-router'
import { cx } from 'cva'
import { Button } from '~/components/Button'
import FingerprintIcon from '~icons/material-symbols/fingerprint-outline'

export const Route = createFileRoute('/_manager/create-account/passkey')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex size-full max-w-full items-center justify-center">
      <div
        className={cx(
          'mx-auto flex w-[85%] flex-col content-between items-stretch space-y-6 rounded-2xl sm:w-[450px] sm:bg-gray2',
          'sm:shadow-sm sm:outline sm:outline-gray4',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5">
          <Link to="/">
            <img src="/icon-light.png" alt="Logo" className="h-10 w-auto" />
          </Link>

          <Link
            to="/"
            className="flex items-center gap-1 rounded-full bg-gray3 px-4 py-2"
          >
            <span className="font-medium">Support</span>
            <span className="text-lg">→</span>
          </Link>
        </div>

        {/* Form illustration */}
        <div className="flex items-center justify-center gap-4 px-5">
          <div className="flex flex-col gap-2">
            <div className="flex h-8 w-36 items-center rounded-full bg-gray5 px-2">
              <div className="h-6 w-6 rounded-full bg-gray10" />
              <div className="mx-1 h-4 w-4 text-gray9">@</div>
              <div className="h-4 w-12 rounded-full bg-gray10" />
              <div className="ml-1 h-4 w-4 rounded-full bg-gray10" />
            </div>
            <div className="flex h-8 w-36 items-center justify-center rounded-full bg-gray5">
              <div className="flex h-1 w-24 items-center bg-gray7">
                <div className="mx-1 h-1 w-1 rounded-full bg-gray9" />
                <div className="mx-1 h-1 w-1 rounded-full bg-gray9" />
                <div className="mx-1 h-1 w-1 rounded-full bg-gray9" />
                <div className="mx-1 h-1 w-1 rounded-full bg-gray9" />
                <div className="mx-1 h-1 w-1 rounded-full bg-gray9" />
                <div className="mx-1 h-1 w-1 rounded-full bg-gray9" />
                <div className="mx-1 h-1 w-1 rounded-full bg-gray9" />
                <div className="mx-1 h-1 w-1 rounded-full bg-gray9" />
              </div>
            </div>
            <div className="flex h-8 w-36 items-center justify-center rounded-full bg-gray5">
              <span className="text-gray9 text-sm">Sign in</span>
            </div>
          </div>
          <div className="text-3xl">→</div>
          <div className="flex h-24 w-36 flex-col rounded-lg bg-gray3 p-2 outline outline-gray7">
            <div className="mb-2 h-3 w-3/5 rounded-full bg-gray5" />
            <div className="mb-4 h-3 w-4/5 rounded-full bg-gray5" />
            <div className="flex justify-end">
              <div className="flex items-center rounded-full bg-green9 px-3 py-1 text-white text-xs">
                <span>Sign in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 px-5">
          <h1 className="mt-2 mb-2 text-center font-bold text-3xl">
            Save passkey
          </h1>
          <p className="mb-4 text-center text-lg">
            Passkeys let you sign in within seconds.
          </p>

          <p className="mb-6 text-center text-gray9 text-md">
            Your passkeys are protected by your device, browser, or password
            manager like 1Password.
          </p>

          {/* 1Password recommendation */}
          <div className="mb-6 rounded-lg bg-gray4 p-4">
            <div className="mb-2 flex items-center gap-2">
              <img
                src="/icons/1password.svg"
                alt="1Password logo"
                className="size-7"
              />
              <span className="font-semibold">Get 1Password</span>
            </div>
            <p className="mb-1 text-sm">
              We recommend using 1Password for managing your Passkeys.
            </p>
            <p className="mb-3 text-gray9 text-sm">
              It's available on several platforms.
            </p>
            <div className="flex justify-between *:w-[47.5%]">
              <Button asChild variant="default2" className="bg-gray8!">
                <a
                  href="https://1password.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Learn more
                </a>
              </Button>
              <Button asChild variant="accent">
                <a
                  href="https://1password.com/downloads"
                  target="_blank"
                  rel="noreferrer"
                >
                  Download
                </a>
              </Button>
            </div>
          </div>

          {/* Save passkey button */}
          <Button
            size="lg"
            variant="accent"
            className="mb-6 w-full rounded-2xl! py-3 font-medium text-lg text-white"
          >
            <FingerprintIcon className="mr-2 text-xl" /> Save passkey
          </Button>
        </div>
      </div>
    </main>
  )
}

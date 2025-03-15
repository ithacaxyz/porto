import { useNavigate } from '@tanstack/react-router'
import { Hooks } from 'porto/wagmi'
import { useConnectors } from 'wagmi'

import { Button } from '~/components/Button'
import { IndeterminateLoader } from '~/components/IndeterminateLoader'
import { IthacaMark } from '~/components/IthacaMark'
import { useThemeMode } from '~/hooks/use-theme-mode'
import { config } from '~/lib/Wagmi'

export function Landing() {
  const { theme } = useThemeMode()
  const navigate = useNavigate()

  const connect = Hooks.useConnect()
  const [connector] = useConnectors({ config })

  return (
    <main className="mx-auto flex size-full max-w-[768px] flex-col p-6 sm:ml-34">
      <nav className="flex gap-6 pt-5 font-medium text-gray10">
        <a href="https://ithaca.xyz">Home ↗</a>
        <a href="https://ithaca.xyz/contact">Careers ↗</a>
      </nav>

      <div className="mt-auto w-full flex-grow content-end space-y-6 px-4 pb-10 sm:max-w-[350px] sm:justify-center sm:pb-[18dvh]">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <img
              alt="Porto"
              className="size-9"
              src={theme === 'light' ? '/icon-light.png' : '/icon-dark.png'}
            />
            <p className="font-medium text-[34px] leading-[24px]">Porto</p>
          </div>
          <p className="font-normal text-[19px] text-gray10 leading-[22px]">
            A home for your digital assets,
            <br />
            powered by{' '}
            <a
              className="text-blue9"
              href="https://ithaca.xyz"
              rel="noreferrer"
              target="_blank"
            >
              Ithaca
            </a>
            .
          </p>
        </div>
        <div className="h-[100px]">
          {connect.isPending ? (
            <div>
              <IndeterminateLoader
                title={'Signing in...'}
                description=""
                hint=""
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-4 sm:gap-2">
                <Button
                  onClick={() => navigate({ to: '/create-account' })}
                  className="flex-grow rounded-2xl"
                  variant="accent"
                >
                  Create wallet
                </Button>
                <Button
                  onClick={() =>
                    connect.mutate({ connector: connector as never })
                  }
                  className="flex-grow bg-gray6!"
                  variant="default2"
                >
                  Sign in
                </Button>
              </div>
              <Button asChild className="w-full bg-gray6!" variant="default">
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://ithaca.xyz/updates/introducing-ithaca"
                >
                  Learn more
                </a>
              </Button>
              <a
                target="_blank"
                rel="noreferrer"
                className="mx-1 text-gray10"
                href="https://ithaca.xyz/recover"
              >
                Recover my account →
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="-z-50 fixed right-0 mt-3 hidden size-full h-[80dvh] max-w-[868px] max-[568px]:hidden max-[1024px]:h-[70dvh] sm:block">
        <IthacaMark className="text-black" />
      </div>
    </main>
  )
}

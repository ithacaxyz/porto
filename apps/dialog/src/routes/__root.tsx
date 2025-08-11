import { Env, UserAgent } from '@porto/apps'
import { Button } from '@porto/apps/components'
import { Frame } from '@porto/ui'
import {
  useLocation,
  createRootRoute,
  HeadContent,
  Outlet,
} from '@tanstack/react-router'
import { Actions, Hooks } from 'porto/remote'
import * as React from 'react'
import * as Dialog from '~/lib/Dialog'
import { porto } from '~/lib/Porto'
import * as Referrer from '~/lib/Referrer'
import LucideCircleAlert from '~icons/lucide/circle-alert'
import { Layout } from './-components/Layout'
import { UpdateAccount } from './-components/UpdateAccount'

export const Route = createRootRoute({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        content: __APP_VERSION__,
        name: 'x-app-version',
      },
    ],
  }),
})

const env = (
  {
    anvil: 'anvil',
    dev: 'development',
    prod: undefined,
    stg: 'staging',
  } satisfies Record<Env.Env, string | undefined>
)[Env.get()]

function RouteComponent() {
  React.useEffect(() => {
    // Note: we already call `porto.ready()` optimistically in `main.tsx`, but
    // we should call it here incase it didn't resolve due to a race condition.
    porto.ready()
  }, [])

  // Optimistically fetch account version (populate cache).
  UpdateAccount.useAccountVersion()

  const mode = Dialog.useStore((state) => state.mode)
  const referrer = Dialog.useStore((state) => state.referrer)
  const customTheme = Dialog.useStore((state) => state.customTheme)
  const display = Dialog.useStore((state) => state.display)
  const search = Route.useSearch() as {
    requireUpdatedAccount?: boolean | undefined
  }
  const verifyStatus = Referrer.useVerify()

  const { domain, subdomain, icon, url } = React.useMemo(() => {
    const hostnameParts = referrer?.url?.hostname.split('.').slice(-3)
    const domain = hostnameParts?.slice(-2).join('.')
    const subdomain = hostnameParts?.at(-3)
    return {
      domain,
      icon: referrer?.icon,
      subdomain,
      url: referrer?.url?.toString(),
    }
  }, [referrer])

  const location = useLocation()
  const request = Hooks.useRequest(porto)

  return (
    <>
      <HeadContent />
      <style>{customTheme?.tailwindCss}</style>

      <Frame
        // the color scheme is set from here rather than at the :root level,
        // this is because a mismatch between the color scheme of an iframe
        // and its parent would make the iframe opaque [1][2]. So the strategy
        // is to set the same color scheme at the :root level than outside the
        // iframe, and then restoring the color scheme we actually want here.
        // [1] https://fvsch.com/transparent-iframes#toc-3
        // [2] https://github.com/w3c/csswg-drafts/issues/4772
        colorScheme={customTheme?.colorScheme}
        screenKey={`${location.pathname}${request?.id}`}
        loading={!request}
        mode={
          display === 'full'
            ? 'full'
            : {
                mode: 'dialog',
                variant: display === 'drawer' ? 'drawer' : 'normal',
              }
        }
        onClose={
          mode === 'inline-iframe' || mode === 'popup-standalone'
            ? null
            : () => Actions.rejectAll(porto)
        }
        onHeight={(height) => {
          if (mode === 'inline-iframe' || mode === 'popup-standalone') return
          porto.messenger.send('__internal', {
            type: 'resize',
            height,
          })
        }}
        site={{
          icon: typeof icon === 'object' ? [icon.light, icon.dark] : icon,
          label: (
            <div className="mr-auto flex shrink items-center gap-1 overflow-hidden whitespace-nowrap font-normal text-[14px] text-th_frame leading-[22px]">
              {url?.startsWith('cli') ? (
                referrer?.title
              ) : url ? (
                <div className="flex overflow-hidden" title={url}>
                  {subdomain && (
                    <>
                      <div className="truncate">{subdomain}</div>
                      <div>.</div>
                    </>
                  )}
                  <div>{domain}</div>
                </div>
              ) : (
                'Porto'
              )}
            </div>
          ),
          tag: env,
          verified: verifyStatus.data?.status === 'whitelisted',
        }}
      >
        <CheckError>
          <CheckUnsupportedBrowser>
            <CheckReferrer>
              {search.requireUpdatedAccount ? (
                <UpdateAccount.CheckUpdate>
                  <Outlet />
                </UpdateAccount.CheckUpdate>
              ) : (
                <Outlet />
              )}
            </CheckReferrer>
          </CheckUnsupportedBrowser>
        </CheckError>
      </Frame>

      <React.Suspense>
        <TanStackRouterDevtools position="bottom-right" />
        <TanStackQueryDevtools
          buttonPosition="bottom-left"
          initialIsOpen={false}
          position="left"
        />
      </React.Suspense>
    </>
  )
}

function CheckError(props: CheckError.Props) {
  const { children } = props

  const error = Dialog.useStore((state) => state.error)

  if (!error) return children

  const mainAction =
    error.action === 'retry-in-popup'
      ? {
          label: 'Try in popup',
          onClick: () => {
            // clear error state and switch to popup mode
            Dialog.store.setState({ error: null })
            porto.messenger.send('__internal', {
              mode: 'popup',
              type: 'switch',
            })
          },
        }
      : {
          label: 'Close',
          onClick: () => Actions.rejectAll(porto),
        }

  const secondaryAction = error.action !== 'close' && {
    label: 'Cancel',
    onClick: () => Actions.rejectAll(porto),
  }

  return (
    <Layout>
      <Layout.Header className="flex-grow">
        <Layout.Header.Default
          content={
            <div className="space-y-2">
              <div>{error.message}</div>
              {error.secondaryMessage && (
                <div className="text-th_base-secondary">
                  {error.secondaryMessage}
                </div>
              )}
            </div>
          }
          icon={LucideCircleAlert}
          title={error.title}
          variant="warning"
        />
      </Layout.Header>
      <Layout.Footer>
        <Layout.Footer.Actions>
          {secondaryAction && (
            <Button
              data-testid="secondary-action"
              onClick={secondaryAction.onClick}
              type="button"
            >
              {secondaryAction.label}
            </Button>
          )}
          <Button
            className="flex-grow"
            data-testid="primary-action"
            onClick={mainAction.onClick}
            type="button"
            variant="primary"
          >
            {mainAction.label}
          </Button>
        </Layout.Footer.Actions>
      </Layout.Footer>
    </Layout>
  )
}

declare namespace CheckError {
  type Props = {
    children: React.ReactNode
  }
}

function CheckReferrer(props: CheckReferrer.Props) {
  const { children } = props

  const [proceed, setProceed] = React.useState(false)

  const hostname = Dialog.useStore((state) => state.referrer?.url?.hostname)
  const verifyStatus = Referrer.useVerify()

  if (proceed) return children
  if (verifyStatus.data?.status !== 'blacklisted') return children
  return (
    <Layout>
      <Layout.Header>
        <Layout.Header.Default
          content={
            <>
              <span className="font-medium">{hostname}</span> has been flagged
              as potentially malicious, and may trick you into signing actions
              that may take all your assets.
            </>
          }
          icon={LucideCircleAlert}
          title="Malicious website detected"
          variant="destructive"
        />
      </Layout.Header>

      <Layout.Footer>
        <Layout.Footer.Actions>
          <Button
            className="flex-1"
            onClick={() => setProceed(true)}
            variant="destructive"
          >
            Proceed anyway
          </Button>
          <Button className="flex-1" onClick={() => Actions.rejectAll(porto)}>
            Close
          </Button>
        </Layout.Footer.Actions>
      </Layout.Footer>
    </Layout>
  )
}

declare namespace CheckReferrer {
  type Props = {
    children: React.ReactNode
  }
}

const isInAppBrowser = UserAgent.isInAppBrowser()
const isUnsupportedBrowser = UserAgent.isUnsupportedBrowser()
const isUnsupportedCliBrowser = UserAgent.isUnsupportedCliBrowser()

function CheckUnsupportedBrowser(props: CheckUnsupportedBrowser.Props) {
  const { children } = props

  const cli = Dialog.useStore((state) =>
    state.referrer?.url?.toString().startsWith('cli'),
  )

  const [proceed, setProceed] = React.useState(false)

  if (
    (!cli || !isUnsupportedCliBrowser) &&
    !isInAppBrowser &&
    !isUnsupportedBrowser
  )
    return children

  if (proceed) return children

  const type = React.useMemo(() => {
    if (cli) return 'cli'
    if (isInAppBrowser) return 'in-app'
    return 'browser'
  }, [cli])

  const browserName = UserAgent.getInAppBrowserName()
  const message = (
    <>
      {browserName ? (
        <>
          <span className="font-medium">{browserName}</span>'s in-app
        </>
      ) : (
        'In-app'
      )}
    </>
  )

  const action = (
    <p>
      Please switch to a{' '}
      <a
        className="text-th_base underline"
        href="https://porto.sh/sdk/faq#which-browsers-are-supported"
        rel="noreferrer"
        target="_blank"
      >
        supported browser
      </a>
      .
    </p>
  )
  const content = React.useMemo(() => {
    if (type === 'cli')
      return (
        <>
          Support for the Porto CLI in this browser is coming soon. <br />
          For now, please open this page in{' '}
          <span className="font-medium">Chrome</span>,{' '}
          <span className="font-medium">Firefox</span>, or{' '}
          <span className="font-medium">Edge</span> to continue.
        </>
      )
    if (type === 'in-app')
      return (
        <>
          {message} browser does not support Porto. Please open this page in
          your device's browser.
          <br />
          {action}
        </>
      )
    if (type === 'browser')
      return (
        <>
          This browser does not support Porto. Please switch to a supported
          browser.
          <br />
          {action}
        </>
      )
  }, [message, type])

  return (
    <Layout>
      <Layout.Header>
        <Layout.Header.Default
          content={content}
          icon={LucideCircleAlert}
          title="Unsupported browser"
          variant="destructive"
        />
      </Layout.Header>

      {type === 'cli' && (
        <Layout.Footer>
          <Layout.Footer.Actions>
            <Button
              className="flex-1"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href)
              }}
            >
              Copy page link
            </Button>
          </Layout.Footer.Actions>
        </Layout.Footer>
      )}

      {type !== 'cli' && (
        <Layout.Footer>
          <Layout.Footer.Actions>
            <Button
              className="flex-1"
              onClick={() => setProceed(true)}
              variant="destructive"
            >
              Proceed anyway
            </Button>
            <Button className="flex-1" onClick={() => Actions.rejectAll(porto)}>
              Close
            </Button>
          </Layout.Footer.Actions>
        </Layout.Footer>
      )}
    </Layout>
  )
}

declare namespace CheckUnsupportedBrowser {
  type Props = {
    children: React.ReactNode
  }
}

const TanStackRouterDevtools =
  import.meta.env.PROD || window !== window.parent || Boolean(window.opener)
    ? () => null
    : React.lazy(() =>
        import('@tanstack/react-router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        })),
      )

const TanStackQueryDevtools =
  import.meta.env.PROD || window !== window.parent || Boolean(window.opener)
    ? () => null
    : React.lazy(() =>
        import('@tanstack/react-query-devtools').then((res) => ({
          default: res.ReactQueryDevtools,
        })),
      )

import { UserAgent } from '@porto/apps'
import { Button } from '@porto/apps/components'
import { createRootRoute, HeadContent, Outlet } from '@tanstack/react-router'
import { Actions, Hooks } from 'porto/remote'
import * as React from 'react'
import { useAccount } from 'wagmi'
import * as Dialog from '~/lib/Dialog'
import { porto } from '~/lib/Porto'
import * as Referrer from '~/lib/Referrer'
import LucideCircleAlert from '~icons/lucide/circle-alert'
import { Layout } from './-components/Layout'
import { TitleBar } from './-components/TitleBar'
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

function RouteComponent() {
  React.useEffect(() => {
    // Note: we already call `porto.ready()` optimistically in `main.tsx`, but
    // we should call it here incase it didn't resolve due to a race condition.
    porto.ready()
  }, [])

  // Optimistically fetch account version (populate cache).
  UpdateAccount.useAccountVersion()

  const { status } = useAccount()
  const mode = Dialog.useStore((state) => state.mode)
  const referrer = Dialog.useStore((state) => state.referrer)
  const request = Hooks.useRequest(porto)
  const search = Route.useSearch() as {
    requireUpdatedAccount?: boolean | undefined
  }
  const verifyStatus = Referrer.useVerify()

  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const titlebarRef = React.useRef<HTMLDivElement | null>(null)

  React.useLayoutEffect(() => {
    const element = contentRef.current
    if (!element) return

    let frameId: number
    let lastHeight: number | undefined

    const resizeObserver = new ResizeObserver((entries) => {
      // cancel any pending animation frame before requesting a new one
      cancelAnimationFrame(frameId)

      frameId = requestAnimationFrame(() => {
        for (const entry of entries) {
          if (!entry) return

          const { height, width } = entry.contentRect
          // Only send resize if height actually changed
          if (height === lastHeight) return

          const titlebarHeight = titlebarRef.current?.clientHeight ?? 0
          const modeHeight =
            mode === 'popup'
              ? UserAgent.isSafari()
                ? 28 // safari: 27px title bar, 1px in borders
                : UserAgent.isFirefox()
                  ? 63 // firefox: 27px title bar, 34px address bar, 2px in borders
                  : 63 // chrome: 27px title bar, 34px address bar, 2px in borders
              : 2
          const totalHeight = height + titlebarHeight + modeHeight
          lastHeight = height

          if (mode === 'popup') window.resizeTo(width, totalHeight)
          else if (mode === 'iframe' || mode === 'inline-iframe')
            porto.messenger.send('__internal', {
              height: Math.round(totalHeight),
              type: 'resize',
            })
        }
      })
    })

    resizeObserver.observe(element)
    return () => {
      // cancel any pending animation frame before disconnecting the observer
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
    }
  }, [mode])

  return (
    <>
      <HeadContent />

      <div
        data-dialog
        {...{ [`data-${mode === 'inline-iframe' ? 'iframe' : mode}`]: '' }} // for conditional styling based on dialog mode ("in-data-iframe:..." or "in-data-popup:...")
        className="border-primary contain-content data-iframe:rounded-[14px] data-iframe:border"
      >
        <TitleBar
          mode={mode}
          ref={titlebarRef}
          referrer={referrer}
          verifyStatus={verifyStatus.data?.status}
        />

        <div
          className="flex not-in-data-popup-standalone:h-fit in-data-popup-standalone:min-h-dvh flex-col overflow-hidden bg-primary pt-titlebar"
          ref={contentRef}
        >
          <div
            className="flex flex-grow *:w-full"
            key={request?.id ? request.id.toString() : '-1'} // rehydrate on id changes
          >
            <CheckUnsupportedBrowser>
              <CheckReferrer>
                {status === 'connecting' || status === 'reconnecting' ? (
                  <Layout loading loadingTitle="Loading...">
                    <div />
                  </Layout>
                ) : search.requireUpdatedAccount ? (
                  <UpdateAccount.CheckUpdate>
                    <Outlet />
                  </UpdateAccount.CheckUpdate>
                ) : (
                  <Outlet />
                )}
              </CheckReferrer>
            </CheckUnsupportedBrowser>
          </div>
        </div>
      </div>

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

function CheckUnsupportedBrowser(props: CheckUnsupportedBrowser.Props) {
  const { children } = props

  const [proceed, setProceed] = React.useState(false)

  if (!isInAppBrowser && !isUnsupportedBrowser) return children
  if (proceed) return children

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
        className="text-primary underline"
        href="https://porto.sh/sdk/faq#which-browsers-are-supported"
        rel="noreferrer"
        target="_blank"
      >
        supported browser
      </a>
      .
    </p>
  )
  return (
    <Layout>
      <Layout.Header>
        <Layout.Header.Default
          content={
            isUnsupportedBrowser ? (
              <>
                This browser does not support Porto. Please switch to a
                supported browser.
                <br />
                {action}
              </>
            ) : (
              <>
                {message} browser does not support Porto. Please open this page
                in your device's browser.
                <br />
                {action}
              </>
            )
          }
          icon={LucideCircleAlert}
          title="Unsupported browser"
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

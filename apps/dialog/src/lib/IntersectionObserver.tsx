import { Button } from '@porto/ui'
import { cx } from 'cva'
import * as IntersectionObserver from 'porto/core/internal/intersectionObserver'
import * as React from 'react'
import { useInView } from 'react-intersection-observer'
import { porto } from '~/lib/Porto'
import LucideCircleAlert from '~icons/lucide/circle-alert'
import { Layout } from '../routes/-components/Layout'
import * as Dialog from './Dialog'

export function EnsureVisibility(props: {
  children: React.ReactNode
  enabled: boolean
}) {
  const { children, enabled } = props

  const referrer = Dialog.useStore((state) => state.referrer)
  const { ref, visible } = useEnsureVisibility({ enabled })

  const showChildren = React.useMemo(
    () => !enabled || IntersectionObserver.supported(),
    [enabled],
  )
  const disableInteractions = enabled && !visible && showChildren

  if (import.meta.env.MODE === 'test') return children
  return (
    <div
      className={cx(
        'flex h-full w-full flex-col',
        disableInteractions && 'pointer-events-none',
      )}
      ref={ref}
    >
      {showChildren ? (
        children
      ) : (
        <Layout>
          <Layout.Header>
            <Layout.Header.Default
              content={
                <div className="space-y-2">
                  <p>
                    The Porto dialog may be occluded in this context. The
                    request will be opened in a new window.
                  </p>
                  <p className="text-sm text-th_base-secondary">
                    {IntersectionObserver.supported() ? (
                      'To avoid this message, please contact the webmaster to ensure no website content is overlaying Porto.'
                    ) : (
                      <>
                        To avoid this message, please contact the webmaster to
                        add "{referrer?.url?.hostname}" as a trusted host to:{' '}
                        <a
                          className="break-all underline"
                          href="https://github.com/ithacaxyz/porto/edit/main/src/trusted-hosts.ts"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          github.com/ithacaxyz/porto/edit/main/src/trusted-hosts.ts
                        </a>
                      </>
                    )}
                  </p>
                </div>
              }
              icon={LucideCircleAlert}
              title="Continue in new window"
              variant="default"
            />
          </Layout.Header>

          <Layout.Footer>
            <Layout.Footer.Actions>
              <Button
                className="flex-grow!"
                onClick={() => {
                  porto.messenger.send('__internal', {
                    mode: 'popup',
                    type: 'switch',
                  })
                }}
                variant="primary"
              >
                Continue
              </Button>
            </Layout.Footer.Actions>
          </Layout.Footer>
        </Layout>
      )}
    </div>
  )
}

export function useEnsureVisibility(props: { enabled: boolean }) {
  const { ref, entry } = useInView({
    delay: 100,
    threshold: [0.99],
    trackVisibility: true,
  })
  const [visible, setVisible] = React.useState(true)

  React.useEffect(() => {
    // Do not check if we are disabled.
    if (!props.enabled) return
    // Do not check if there is not an element to check.
    if (!entry) return

    if (!IntersectionObserver.supported()) {
      setVisible(false)
      return
    }

    // Check if we are actually visible after delay
    const timeout = setTimeout(() => {
      const isVisible =
        (entry as unknown as { isVisible: boolean | undefined }).isVisible ||
        false
      setVisible(isVisible)
    }, 500)
    return () => clearTimeout(timeout)
  }, [entry, props.enabled])

  return { ref, visible }
}

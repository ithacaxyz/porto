import { cx } from 'cva'
import * as IntersectionObserver from 'porto/core/internal/intersectionObserver'
import * as React from 'react'
import { useInView } from 'react-intersection-observer'
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
    () => IntersectionObserver.supported() || !enabled,
    [enabled],
  )
  const disableInteractions = enabled && !visible && showChildren

  return (
    <div
      className={cx(
        'h-full w-full',
        disableInteractions && 'pointer-events-none',
      )}
      ref={ref}
    >
      {showChildren ? (
        children
      ) : (
        <Layout>
          <div className="p-3 text-sm text-th_base-secondary">
            Unable to determine if Porto is visible. Ensure that the page has no
            overlaying elements, or contact the webmaster to add "
            {referrer?.url?.hostname}" to:{' '}
            <a
              className="break-all"
              href="https://github.com/ithacaxyz/porto/edit/main/src/trusted-hosts.ts"
              rel="noopener noreferrer"
              target="_blank"
            >
              https://github.com/ithacaxyz/porto/edit/main/src/trusted-hosts.ts
            </a>
            .
          </div>
        </Layout>
      )}
    </div>
  )
}

export function useEnsureVisibility(props: { enabled: boolean }) {
  const { ref, entry } = useInView({
    delay: 100,
    threshold: [1.0],
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

import { Button } from '@porto/ui'
import { createFileRoute } from '@tanstack/react-router'
import type { ComponentProps } from 'react'
import { useEffect, useState } from 'react'
import { ComponentScreen } from '~/components/ComponentScreen/ComponentScreen'
import LucideLogIn from '~icons/lucide/log-in'
import LucideMoreHorizontal from '~icons/lucide/more-horizontal'
import LucidePlus from '~icons/lucide/plus'
import LucideScanFace from '~icons/lucide/scan-face'
import LucideX from '~icons/lucide/x'

export const Route = createFileRoute('/Button')({
  component: ButtonComponent,
})

function ButtonComponent() {
  return (
    <ComponentScreen title="Button">
      <ComponentScreen.Section title="Variants">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary">Secondary</Button>
            <Button variant="primary">Primary</Button>
            <Button variant="content">Content</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="strong">Strong</Button>
            <Button variant="distinct">Distinct</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="negative">Negative</Button>
            <Button variant="negative-secondary">Negative Secondary</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="positive">Positive</Button>
          </div>
        </div>
      </ComponentScreen.Section>
      <ComponentScreen.Section title="Sizes">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="small">Small</Button>
            <Button size="medium">Medium</Button>
            <Button size="large">Large</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button icon={<LucideLogIn />} size="small">
              Small
            </Button>
            <Button icon={<LucideLogIn />} size="medium">
              Medium
            </Button>
            <Button icon={<LucideLogIn />} size="large">
              Large
            </Button>
          </div>
        </div>
      </ComponentScreen.Section>
      <ComponentScreen.Section title="States">
        <div className="flex flex-wrap items-center gap-2">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
        </div>
      </ComponentScreen.Section>
      <ComponentScreen.Section title="Icon">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button icon={<LucideLogIn />} variant="primary">
              Start
            </Button>
            <Button icon={<LucideScanFace />} variant="secondary">
              Sign in
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              icon={<LucideLogIn />}
              size="small"
              variant="negative-secondary"
            >
              Start
            </Button>
            <Button icon={<LucideScanFace />} size="small" variant="positive">
              Sign in
            </Button>
          </div>
        </div>
      </ComponentScreen.Section>
      <ComponentScreen.Section title="Loading">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <LoadingButton label="Small" size="small" />
            <LoadingButton label="Medium" size="medium" />
            <LoadingButton label="Large" size="large" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <LoadingButton label="Default" />
            <LoadingButton
              label="Custom label"
              loadingLabel="Custom loading label…"
            />
            <LoadingButton icon={true} label="With icon" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <LoadingButton label="Full width" width="full" />
          </div>
        </div>
      </ComponentScreen.Section>
      <ComponentScreen.Section title="Square mode">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button shape="square" size="small">
              <LucidePlus />
            </Button>
            <Button shape="square" size="medium">
              <LucidePlus />
            </Button>
            <Button shape="square" size="large">
              <LucidePlus />
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button shape="square" size="small" variant="secondary">
              <LucideMoreHorizontal />
            </Button>
            <Button shape="square" size="medium" variant="negative">
              <LucideX />
            </Button>
            <Button shape="square" size="large" variant="strong">
              <LucidePlus />
            </Button>
          </div>
        </div>
      </ComponentScreen.Section>
      <ComponentScreen.Section title="Full width">
        <div className="flex max-w-1xl flex-col items-center gap-2">
          <Button size="small" width="full">
            Small
          </Button>
          <Button size="medium" width="full">
            Medium
          </Button>
          <Button size="large" width="full">
            Large
          </Button>
        </div>
      </ComponentScreen.Section>
    </ComponentScreen>
  )
}

function LoadingButton({
  icon,
  label,
  loadingLabel,
  size,
  width,
}: {
  icon?: boolean
  label?: string
  loadingLabel?: string
  size?: ComponentProps<typeof Button>['size']
  width?: ComponentProps<typeof Button>['width']
}) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!loading) return
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [loading])

  return (
    <Button
      icon={icon ? <LucideLogIn /> : undefined}
      loading={loading && (loadingLabel ?? true)}
      onClick={() => setLoading(true)}
      size={size}
      variant="primary"
      width={width}
    >
      {label ?? 'Click'}
    </Button>
  )
}

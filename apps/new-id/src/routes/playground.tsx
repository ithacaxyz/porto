import { Button, IndeterminateLoader } from '@porto/apps/components'
import { createFileRoute } from '@tanstack/react-router'
import LucideBone from '~icons/lucide/bone'

export const Route = createFileRoute('/playground')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2 text-xs">
        <h1 className="font-bold text-2xl">Semantic Colors</h1>
        <h2 className="font-medium text-lg">Background</h2>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center justify-center whitespace-nowrap bg-primary p-2">
            bg-primary
          </div>
          <div className="flex items-center justify-center whitespace-nowrap bg-secondary p-2">
            bg-secondary
          </div>
          <div className="flex items-center justify-center whitespace-nowrap bg-surface p-2">
            bg-surface
          </div>
          <div className="flex items-center justify-center bg-invert p-2 text-invert">
            bg-invert
          </div>
          <div className="flex items-center justify-center whitespace-nowrap bg-accent p-2">
            bg-accent
          </div>
          <div className="flex items-center justify-center whitespace-nowrap bg-accentHover p-2">
            bg-accentHover
          </div>
          <div className="flex items-center justify-center whitespace-nowrap bg-accentTint p-2">
            bg-accentTint
          </div>
          <div className="flex items-center justify-center bg-destructive p-2">
            bg-destructive
          </div>
          <div className="flex items-center justify-center whitespace-nowrap bg-destructiveHover p-2">
            bg-destructiveHover
          </div>
          <div className="flex items-center justify-center whitespace-nowrap bg-destructiveTint p-2">
            bg-destructiveTint
          </div>
          <div className="flex items-center justify-center bg-success p-2">
            bg-success
          </div>
          <div className="flex items-center justify-center whitespace-nowrap bg-successHover p-2">
            bg-successHover
          </div>
          <div className="flex items-center justify-center whitespace-nowrap bg-successTint p-2">
            bg-successTint
          </div>
          <div className="flex items-center justify-center bg-warning p-2">
            bg-warning
          </div>
          <div className="flex items-center justify-center whitespace-nowrap bg-warningHover p-2">
            bg-warningHover
          </div>
          <div className="flex items-center justify-center whitespace-nowrap bg-warningTint p-2">
            bg-warningTint
          </div>
        </div>
        <h2 className="font-medium text-lg">Border</h2>
        <div className="flex gap-2">
          <div className="flex items-center justify-center whitespace-nowrap border border-primary p-2">
            border-primary
          </div>
          <div className="flex items-center justify-center whitespace-nowrap border border-surface p-2">
            border-surface
          </div>
        </div>
        <h2 className="font-medium text-lg">Text</h2>
        <div className="flex gap-2">
          <div className="flex items-center justify-center whitespace-nowrap p-2 text-primary">
            text-primary
          </div>
          <div className="flex items-center justify-center whitespace-nowrap p-2 text-secondary">
            text-secondary
          </div>
          <div className="flex items-center justify-center whitespace-nowrap bg-invert p-2 text-invert">
            text-invert
          </div>
          <div className="flex items-center justify-center whitespace-nowrap p-2 text-accent">
            text-accent
          </div>
          <div className="flex items-center justify-center whitespace-nowrap p-2 text-destructive">
            text-destructive
          </div>
          <div className="flex items-center justify-center whitespace-nowrap p-2 text-success">
            text-success
          </div>
          <div className="flex items-center justify-center whitespace-nowrap p-2 text-warning">
            text-warning
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="font-bold text-2xl">Buttons</h1>
        <div className="flex gap-2">
          <Button>Default</Button>
          <Button variant="invert">Invert</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
        </div>
        <div className="flex gap-2">
          <Button size="square">
            <LucideBone />
          </Button>
          <Button size="small">Help</Button>
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="font-bold text-2xl">Indeterminate Loader</h1>
        <div className="flex gap-2">
          <div className="flex items-center rounded-xl bg-gray3 p-6">
            <IndeterminateLoader title="Loading…" />
          </div>
          <div className="flex items-center rounded-xl bg-gray3 p-6">
            <IndeterminateLoader align="vertical" title="Loading…" />
          </div>
        </div>
      </div>
    </div>
  )
}

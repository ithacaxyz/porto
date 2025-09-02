import { Ui } from '@porto/ui'
import { cx } from 'cva'
import type { ReactNode } from 'react'

export function ComponentScreen({
  children,
  title,
}: {
  children: ReactNode
  title: ReactNode
}) {
  return (
    <Ui>
      <div className="flex max-w-2xl flex-col gap-4 py-4">
        <h1 className="mb-4 text-2xl text-th_base">{title}</h1>
        <div className="w-full space-y-6">{children}</div>
      </div>
    </Ui>
  )
}

function ComponentScreenSection({
  title,
  children,
  surface = 'plane',
}: {
  title?: string
  children: ReactNode
  surface?: 'base' | 'base-alt' | 'plane'
}) {
  return (
    <section className="w-full">
      {title && <h1 className="mb-3 text-lg text-th_base">{title}</h1>}
      <div
        className={cx(
          'w-full',
          (surface === 'base' || surface === 'base-alt') &&
            'rounded-th_medium border border-th_base p-4',
          surface === 'base' && 'bg-th_base',
          surface === 'base-alt' && 'bg-th_base-alt',
        )}
      >
        {children}
      </div>
    </section>
  )
}

ComponentScreen.Section = ComponentScreenSection

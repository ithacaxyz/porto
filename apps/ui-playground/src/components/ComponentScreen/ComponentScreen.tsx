import type { ReactNode } from 'react'

export function ComponentScreen({
  children,
  title,
}: {
  children: ReactNode
  title: ReactNode
}) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-4 text-2xl text-th_base">{title}</h1>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  )
}

function ComponentScreenSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section>
      <h1 className="mb-3 text-lg text-th_base">{title}</h1>
      <div>{children}</div>
    </section>
  )
}

ComponentScreen.Section = ComponentScreenSection

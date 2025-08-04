import type { ReactNode } from 'react'

export function ComponentScreen({
  children,
  title,
}: {
  children: ReactNode
  title: ReactNode
}) {
  return (
    <div className="flex max-w-2xl flex-col gap-4 py-4">
      <h1 className="mb-4 text-2xl text-th_base">{title}</h1>
      <div className="w-full space-y-6">{children}</div>
    </div>
  )
}

function ComponentScreenSection({
  title,
  children,
}: {
  title?: string
  children: ReactNode
}) {
  return (
    <section className="w-full">
      {title && <h1 className="mb-3 text-lg text-th_base">{title}</h1>}
      <div className="w-full">{children}</div>
    </section>
  )
}

ComponentScreen.Section = ComponentScreenSection

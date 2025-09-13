import { ThemeSwitch } from '@porto/ui'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { useColorScheme } from '~/ColorScheme'
import { sections } from '~/constants'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="grid h-screen min-w-200 select-none grid-cols-[220px_1fr] overflow-hidden bg-th_base-plane text-th_base">
      <Sidebar />
      <div className="focus-visible:-outline-offset-2 overflow-y-auto px-16 py-12 focus-visible:outline-2 focus-visible:outline-th_focus">
        <Outlet />
      </div>
    </div>
  )
}

function Sidebar() {
  const { colorScheme, setColorScheme } = useColorScheme()
  return (
    <div className="flex flex-col gap-12 overflow-y-auto border-th_frame border-r bg-th_frame px-8 py-6 text-sm">
      <div className="flex items-center justify-between">
        <Link
          className="-ml-2 flex h-full items-center whitespace-nowrap rounded-[2px] pr-2 pl-2 text-th_base outline-offset-2 focus-visible:outline-2 focus-visible:outline-th_focus"
          to="/"
        >
          <h1>@porto/ui</h1>
        </Link>

        <ThemeSwitch colorScheme={colorScheme} onChange={setColorScheme} />
      </div>
      <nav className="flex flex-col gap-4">
        {sections.map(({ title, screens }) => (
          <section className="flex flex-col gap-2" key={title}>
            <h1 className="text-th_base">{title}</h1>
            <ul>
              {screens.map((screen) => (
                <li className="-mx-2" key={screen}>
                  <Link
                    activeProps={{
                      className: 'text-th_accent!',
                    }}
                    className="block rounded-[2px] px-2 py-1 text-th_base-secondary outline-offset-2 focus-visible:outline-2 focus-visible:outline-th_focus active:translate-y-[1px]"
                    key={screen}
                    to={`/${screen}` as const}
                  >
                    {screen}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>
    </div>
  )
}

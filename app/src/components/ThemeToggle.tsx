import ThemeLoopIcon from '~icons/line-md/light-dark-loop'
import ThemeIcon from '~icons/mdi/theme-light-dark'

import { cx } from 'cva'
import { useThemeMode } from '~/hooks/use-theme-mode'

export function ThemeToggle({
  className,
}: {
  className?: string
}) {
  const { theme, setTheme } = useThemeMode()

  return (
    <div className={cx(className, 'fixed bottom-0 left-0')}>
      <button
        type="button"
        className="group relative rounded-full p-3 text-gray10 *:size-4 sm:*:size-6.5"
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        <ThemeIcon className="block group-hover:hidden" />
        <ThemeLoopIcon className="hidden group-hover:block" />
      </button>
    </div>
  )
}

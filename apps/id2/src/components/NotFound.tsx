import * as Ui from '@porto/ui'
import { Link } from '@tanstack/react-router'

export function NotFound({ children }: { children?: any }) {
  return (
    <div className="space-y-2 p-2">
      <div className="text-gray-600 dark:text-gray-400">
        {children || <p>The page you are looking for does not exist.</p>}
      </div>
      <p className="flex flex-wrap items-center gap-2">
        <Ui.Button
          onClick={() => window.history.back()}
          type="button"
          variant="primary"
        >
          Go back
        </Ui.Button>
        <Ui.Button variant="secondary">
          <Link to="/">Start Over</Link>
        </Ui.Button>
      </p>
    </div>
  )
}

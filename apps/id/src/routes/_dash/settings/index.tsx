import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_dash/settings/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <p>Hello "/_dash/settings/"!</p>
      <ul>
        <li>
          <Link to="/settings/recovery">Recovery</Link>
        </li>
        <li>
          <Link to="/settings/permissions">Permissions</Link>
        </li>
      </ul>
    </div>
  )
}

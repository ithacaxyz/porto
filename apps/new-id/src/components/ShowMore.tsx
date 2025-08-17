import * as Ariakit from '@ariakit/react'
import { cx } from 'cva'

export function ShowMore({
  text,
  className,
  onChange,
}: {
  text: string
  className?: string
  onChange: React.ChangeEventHandler<HTMLInputElement>
}) {
  const checkbox = Ariakit.useCheckboxStore()
  const label = Ariakit.useStoreState(checkbox, (state) =>
    state.value ? 'Show less' : text,
  )

  return (
    <Ariakit.Checkbox
      className={cx(className, '')}
      onChange={onChange}
      render={<p />}
      store={checkbox}
    >
      {label}
    </Ariakit.Checkbox>
  )
}

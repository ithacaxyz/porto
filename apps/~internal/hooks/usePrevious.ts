import * as React from 'react'

export function usePrevious<T>(props: usePrevious.Props<T>): T | undefined {
  const ref = React.useRef<T | undefined>(undefined)
  React.useEffect(() => {
    ref.current = props.value
  }, [props.value])
  return ref.current
}

export declare namespace usePrevious {
  export type Props<T> = {
    value: T
  }
}

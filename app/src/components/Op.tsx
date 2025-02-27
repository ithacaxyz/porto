import type * as React from 'react'

export const OpIcon = (
  props: React.PropsWithChildren<React.ImgHTMLAttributes<HTMLImageElement>>,
) => <img src="/icons/op.svg" {...props} alt="Optimism OP token" />

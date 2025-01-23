import { type VariantProps, cva } from 'cva'
import type * as React from 'react'

export function Header(props: Header.Props) {
  const { icon: Icon, title, content, variant } = props
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className={Header.className({ variant })}>
          <Icon className="size-4 text-current" />
        </div>
        <div className="font-medium text-[18px] text-gray12">{title}</div>
      </div>

      <div className="mt-1.5 text-[15px] text-gray12 leading-[22px]">
        {content}
      </div>
    </div>
  )
}

export namespace Header {
  export interface Props extends VariantProps<typeof className> {
    icon: React.FC<React.SVGProps<SVGSVGElement>>
    title: string
    content: React.ReactNode
  }

  export const className = cva(
    'flex size-8 items-center justify-center rounded-full',
    {
      variants: {
        variant: {
          default: 'bg-blueA3 text-blue10',
          primary: 'bg-blueA3 text-blue10',
          warning: 'bg-amberA2 text-amber8',
        },
      },
      defaultVariants: {
        variant: 'default',
      },
    },
  )
}

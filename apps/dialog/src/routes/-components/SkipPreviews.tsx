import { Checkbox } from '@ariakit/react'
import type * as React from 'react'

export function SkipPreviews(props: SkipPreviews.Props) {
  const { ref } = props
  return (
    <label htmlFor="skip-previews">
      <div className="relative rounded-[10px] border border-gray4 bg-gray3 p-3">
        <div className="flex items-center gap-1.5">
          <Checkbox id="skip-previews" ref={ref} />
          <span className="font-medium text-[15px] text-gray12">
            Skip previews
          </span>
        </div>
        <div className="h-1" />
        <p className="text-[14px] text-gray10">
          Move faster through apps by skipping transaction previews &
          confirmations
        </p>
        <Illustration className="absolute top-[12px] right-0 h-[calc(100%-(24px))]" />
      </div>
    </label>
  )
}

export declare namespace SkipPreviews {
  export type Props = {
    ref: React.RefObject<HTMLInputElement | null>
  }
}

export function Illustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 61 51"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Skip previews illustration</title>
      <path
        className="fill-gray5 dark:fill-gray2"
        d="M6 9C6 4.02944 10.0294 0 15 0H61V51H15C10.0294 51 6 46.9706 6 42V9Z"
      />
      <rect
        className="fill-white dark:fill-gray4"
        height="35.0435"
        rx="3"
        width="31"
        x="22"
        y="8.47803"
      />
      <rect
        className="fill-gray3"
        height="17.5217"
        rx="2"
        width="25.6087"
        x="24.6953"
        y="16.5654"
      />
      <rect
        className="fill-gray3"
        height="2.69565"
        rx="1.34783"
        width="13.4783"
        x="24.6953"
        y="11.1738"
      />
      <rect
        className="fill-red4"
        height="4.04348"
        rx="2.02174"
        width="12.1304"
        x="24.6953"
        y="36.7827"
      />
      <rect
        className="fill-green4"
        height="4.04348"
        rx="2.02174"
        width="12.1304"
        x="38.1738"
        y="36.7827"
      />
    </svg>
  )
}

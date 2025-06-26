import { useCopyToClipboard } from '@porto/apps/hooks'
import LucideCheck from '~icons/lucide/check'
import LucideCopy from '~icons/lucide/copy'
import LucideExternalLink from '~icons/lucide/external-link'

export function GuideDemoContainer(props: {
  children: React.ReactNode
  src?: string | undefined
}) {
  const { children, src } = props
  const [isCopied, copy] = useCopyToClipboard()
  return (
    <div className="relative rounded-xl bg-gray3/50">
      <div className="absolute top-0 right-0 left-0 flex justify-between p-4">
        <div className="font-[400] text-[14px] text-gray9 leading-none tracking-[-2.8%]">
          Demo
        </div>
      </div>
      <div className="flex h-[300px] items-center justify-center">
        <div>{children}</div>
      </div>
      <div className="h-4" />
      {src && (
        <div className="absolute right-0 bottom-0 left-0 flex justify-between p-4">
          {/** biome-ignore lint/a11y/noStaticElementInteractions: _ */}
          <div
            className="flex cursor-pointer items-center gap-[6px] rounded-lg bg-surface px-2 font-mono text-[12px] tracking-tight max-sm:hidden"
            onClick={() => copy(`pnpx gitpick ${src}`)}
            title="Copy to clipboard"
          >
            <div>
              <span className="text-gray10">pnpx gitpick</span> {src}
            </div>
            {isCopied ? (
              <LucideCheck className="text-gray10" />
            ) : (
              <LucideCopy className="text-gray10" />
            )}
          </div>
          <a
            className="flex items-center gap-1 font-[400] text-[14px] text-accent leading-none tracking-[-2.8%]"
            href={'https://github.com/' + src}
            rel="noreferrer"
            target="_blank"
          >
            Source <LucideExternalLink className="size-[12px]" />
          </a>
        </div>
      )}
    </div>
  )
}

import { Env } from '@porto/apps'
import { Actions } from 'porto/remote'
import * as React from 'react'
import { LightDarkImage } from '~/components/LightDarkImage'
import type { store } from '~/lib/Dialog'
import { porto } from '~/lib/Porto'
import type { useVerify } from '~/lib/Referrer'
import LucideBadgeCheck from '~icons/lucide/badge-check'
import LucideGlobe from '~icons/lucide/globe'
import LucideTerminal from '~icons/lucide/terminal'
import LucideX from '~icons/lucide/x'

const env = (
  {
    anvil: 'anvil',
    dev: 'development',
    prod: undefined,
    stg: 'staging',
  } satisfies Record<Env.Env, string | undefined>
)[Env.get()]

export function TitleBar(props: TitleBar.Props) {
  const { mode, ref, referrer, verifyStatus } = props

  const { domain, subdomain, icon, url } = React.useMemo(() => {
    const hostnameParts = referrer?.url?.hostname.split('.').slice(-3)
    const domain = hostnameParts?.slice(-2).join('.')
    const subdomain = hostnameParts?.at(-3)
    return {
      domain,
      icon: referrer?.icon,
      subdomain,
      url: referrer?.url?.toString(),
    }
  }, [referrer])

  const selfClose = mode !== 'inline-iframe' && mode !== 'popup-standalone'

  React.useEffect(() => {
    if (!selfClose) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') Actions.rejectAll(porto)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selfClose])

  return (
    <header
      className="fixed flex h-navbar w-full items-center justify-between gap-2 border-th_frame border-b bg-th_frame px-3 pt-2 pb-1.5"
      ref={ref}
    >
      <div className="flex size-5 min-w-5 items-center justify-center rounded-[5px] bg-th_badge-strong text-th_badge-strong">
        {url?.startsWith('cli') ? (
          <LucideTerminal className="size-3.5" />
        ) : icon && url?.startsWith('http') ? (
          <div className="size-full p-[3px]">
            {typeof icon === 'string' ? (
              <img alt="" className="size-full text-transparent" src={icon} />
            ) : (
              <LightDarkImage
                alt=""
                className="size-full text-transparent"
                dark={icon.dark}
                light={icon.light}
              />
            )}
          </div>
        ) : (
          <LucideGlobe className="size-3.5 text-th_base" />
        )}
      </div>

      <div className="mr-auto flex shrink items-center gap-1 overflow-hidden whitespace-nowrap font-normal text-[14px] text-th_frame leading-[22px]">
        {url?.startsWith('cli') ? (
          referrer?.title
        ) : url ? (
          <div className="flex overflow-hidden" title={url}>
            {subdomain && (
              <>
                <div className="truncate">{subdomain}</div>
                <div>.</div>
              </>
            )}
            <div>{domain}</div>
          </div>
        ) : (
          'Porto'
        )}

        {verifyStatus === 'whitelisted' && (
          <div className="flex items-center justify-center">
            <LucideBadgeCheck className="size-4 text-th_accent" />
          </div>
        )}

        {env && (
          <div className="flex h-5 items-center rounded-full bg-th_badge px-1.25 text-[11.5px] text-th_badge capitalize">
            {env}
          </div>
        )}
      </div>

      {selfClose && (
        <button
          onClick={() => Actions.rejectAll(porto)}
          title="Close Dialog"
          type="button"
        >
          <LucideX className="size-4.5 text-th_frame" />
        </button>
      )}
    </header>
  )
}

export declare namespace TitleBar {
  type Props = {
    mode: store.State['mode']
    ref: React.RefObject<HTMLDivElement | null>
    referrer: store.State['referrer']
    verifyStatus: useVerify.Data['status'] | undefined
  }
}

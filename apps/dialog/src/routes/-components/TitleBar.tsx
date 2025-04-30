import { Env } from '@porto/apps'
import { Actions } from 'porto/remote'
import * as React from 'react'
import { store } from '~/lib/Dialog'
import { porto } from '~/lib/Porto'
import { useVerify } from '~/lib/Referrer'
import LucideBadgeCheck from '~icons/lucide/badge-check'
import LucideGlobe from '~icons/lucide/globe'
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

  return (
    <header
      className="fixed flex h-navbar w-full items-center justify-between gap-2 border-primary border-b bg-secondary px-3 pt-2 pb-1.5"
      ref={ref}
    >
      <div className="flex size-5 min-w-5 items-center justify-center rounded-[5px] bg-gray6">
        {icon && url ? (
          <div className="p-[3px]">
            {typeof icon === 'string' ? (
              <img
                alt={url}
                className="size-full text-transparent"
                src={icon}
              />
            ) : (
              <picture>
                <source
                  media="(prefers-color-scheme: dark)"
                  srcSet={icon.dark}
                />
                <source
                  media="(prefers-color-scheme: light)"
                  srcSet={icon.light}
                />
                <img
                  alt={url}
                  className="size-full text-transparent"
                  src={icon.light}
                />
              </picture>
            )}
          </div>
        ) : (
          <LucideGlobe className="size-3.5 text-primary" />
        )}
      </div>

      <div className="mr-auto flex shrink items-center gap-1 overflow-hidden whitespace-nowrap font-normal text-[14px] text-secondary leading-[22px]">
        {url ? (
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
            <LucideBadgeCheck className="size-4 text-accent" />
          </div>
        )}

        {env && (
          <div className="flex h-5 items-center rounded-full bg-surfaceHover px-1.25 text-[11.5px] capitalize">
            {env}
          </div>
        )}
      </div>

      {mode !== 'inline-iframe' && (
        <button
          onClick={() => Actions.rejectAll(porto)}
          title="Close Dialog"
          type="button"
        >
          <LucideX className="size-4.5 text-secondary" />
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

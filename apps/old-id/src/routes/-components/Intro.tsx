import { IthacaMono } from '~/components/IthacaMono'

export function Intro() {
  return (
    <div className="relative flex min-h-full flex-col items-start justify-between rounded-2xl bg-[#0D74CE] px-14 py-10 text-white shadow-[0px_4px_34px_0px_rgba(0,0,0,0.10)] max-xl:w-full max-xl:flex-1">
      <div className="pointer-events-none absolute inset-0 my-auto ml-auto hidden max-h-[80%] w-[400px] bg-[url(/porto.svg)] bg-contain bg-right-bottom bg-no-repeat max-xl:my-20 max-xl:max-h-[70%] md:block" />
      <p className="flex items-center gap-2 pt-5 font-medium text-sm leading-[22px]">
        <span className="text-white/50">Built by</span>
        <a
          className="h-[16px] max-w-[75px]"
          href="https://ithaca.xyz"
          rel="noreferrer"
          target="_blank"
        >
          <IthacaMono />
        </a>
      </p>
      <div className="flex flex-col gap-y-10">
        <div className="mt-auto space-y-2">
          <h1 className="mt-auto font-medium text-4xl">Porto</h1>
          <p className="font-normal text-[19px] leading-[24px]">
            A home for your digital assets,
            <br />
            powered by <span className="font-semibold">Ithaca</span>.
          </p>
        </div>
        <ul className="flex gap-x-2 opacity-60">
          <li>
            <a
              className="font-[500] text-[13px]"
              href="https://porto.sh"
              rel="noreferrer"
              target="_blank"
            >
              Documentation
            </a>
          </li>
          <li>⋅</li>
          <li>
            <a
              className="font-[500] text-[13px]"
              href="https://t.me/porto_devs"
              rel="noreferrer"
              target="_blank"
            >
              Support
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

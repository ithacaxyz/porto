import type { PortoConfig } from '@porto/apps'

export type ChainId = Exclude<
  PortoConfig.ChainId,
  31337 | 31338 | 31339 | 80094 | 560048 | 747474
>

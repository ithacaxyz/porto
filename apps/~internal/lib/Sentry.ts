import * as Sentry from '@sentry/react'
import type { HttpTransportConfig } from 'viem'

export function httpTransportOptions(): HttpTransportConfig {
  return {
    async onFetchRequest(request, init) {
      Sentry.addBreadcrumb({
        category: 'network.request',
        data: {
          body: init.body,
          url: request.url,
        },
        level: 'info',
        message: 'RPC Request',
      })
    },
    async onFetchResponse(response) {
      const data = await response.clone().json()
      Sentry.addBreadcrumb({
        category: 'network.response',
        data: {
          data,
          url: response.url,
        },
        level: 'info',
        message: 'RPC Response',
      })
    },
  }
}

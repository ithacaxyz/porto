import { page } from '@vitest/browser/context'
import { Dialog, Mode, Porto } from '../src/index.js'

export function getIframe() {
  return page.frameLocator(page.getByTestId('porto'))
}

export const porto = Porto.create({
  mode: Mode.dialog({
    host: 'http://localhost:5174/dialog/',
    renderer: Dialog.iframe({
      skipProtocolCheck: true,
    }),
  }),
})

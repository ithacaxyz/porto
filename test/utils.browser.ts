import { type Locator, page } from '@vitest/browser/context'
import { Dialog, Mode, Porto } from '../src/index.js'

export const porto = Porto.create({
  mode: Mode.dialog({
    host: 'http://localhost:5175/dialog/',
    renderer: Dialog.iframe({
      skipProtocolCheck: true,
    }),
  }),
})

export async function run<returnType>(
  promise: Promise<returnType>,
  action: (iframe: Locator) => Promise<void>,
): Promise<returnType> {
  await action(page.frameLocator(page.getByTestId('porto')))
  return promise
}

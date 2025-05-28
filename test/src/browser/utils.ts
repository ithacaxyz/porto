import { type Locator, page } from '@vitest/browser/context'

export async function run<returnType>(
  promise: Promise<returnType>,
  action?: (iframe: Locator) => Promise<void>,
): Promise<returnType> {
  await action?.(page.frameLocator(page.getByTestId('porto')))
  return promise
}

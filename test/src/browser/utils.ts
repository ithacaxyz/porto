import { type Locator, page } from '@vitest/browser/context'

export async function interact<returnType>(
  promise: Promise<returnType>,
  action: (iframe: Locator) => Promise<void>,
): Promise<returnType> {
  await new Promise((resolve) => setTimeout(resolve, 500)) // average user reaction time
  await action?.(page.frameLocator(page.getByTestId('porto')))
  return promise
}

import { expect, test } from 'vitest'

import { anvil, porto } from '../../../test/src/config.js'

test('default', async () => {
  const code = await porto.provider.request({
    method: 'eth_getCode',
    params: [anvil.contracts.accountDelegation.address, 'latest'],
  })
  expect(code).toMatchSnapshot()
})

import { expect, test } from 'vitest'

import { delegation, porto } from '../../../test/src/porto.js'

test('default', async () => {
  const code = await porto.provider.request({
    method: 'eth_getCode',
    params: [delegation, 'latest'],
  })
  expect(code).toMatchSnapshot()
})

import { expect, test } from 'vitest'

import * as index from '../index.js'
import * as actions from './actions.js'
import * as query from './query.js'
import * as wagmi from './wagmi.js'

test('index', () => {
  expect(Object.keys(index)).toMatchInlineSnapshot(`
    [
      "Chains",
      "Porto",
    ]
  `)
})

test('actions', () => {
  expect(Object.keys(actions)).toMatchInlineSnapshot(`
    [
      "connect",
      "createAccount",
      "disconnect",
      "grantSession",
      "importAccount",
      "sessions",
      "A",
    ]
  `)
})

test('query', () => {
  expect(Object.keys(query)).toMatchInlineSnapshot(`
    [
      "sessionsQueryKey",
      "Q",
    ]
  `)
})

test('wagmi', () => {
  expect(Object.keys(wagmi)).toMatchInlineSnapshot(`
    [
      "useConnect",
      "useCreateAccount",
      "useDisconnect",
      "useGrantSession",
      "useImportAccount",
      "useSessions",
      "W",
    ]
  `)
})

#!/usr/bin/env node

import { Mode, Porto } from 'porto'
import { Dialog } from 'porto/cli'
import { WalletActions } from 'porto/viem'
import { createClient, custom } from 'viem'

const porto = Porto.create({
  mode: Mode.dialog({
    renderer: await Dialog.cli(),
  }),
})

const client = createClient({
  transport: custom(porto.provider),
})

const { accounts } = await WalletActions.connect(client)

Dialog.messenger.send('success', {
  content: 'You have successfully connected your account.',
  title: 'Account connected',
})

console.log('Address: ', accounts[0]!.address)

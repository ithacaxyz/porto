import * as process from 'node:child_process'

export default async function () {
  let process_dialog: process.ChildProcess | undefined
  await fetch('http://localhost:5175').catch(() => {
    return new Promise<void>((resolve) => {
      process_dialog = process.spawn(
        'pnpm',
        ['--filter', 'dialog', 'dev', '--mode', 'test'],
        {
          env: {
            ...(process as any).env,
            ...import.meta.env,
            ANVIL: (import.meta.env.VITE_LOCAL !== 'false').toString(),
          },
        },
      )
      process_dialog.stdout?.on('data', (data) => {
        if (data.toString().includes('ready')) resolve()
      })
    })
  })

  // TODO: use prool rpc server instance directly.
  let process_playground: process.ChildProcess | undefined
  if (import.meta.env.VITE_LOCAL !== 'false')
    await fetch('http://localhost:5173').catch(() => {
      return new Promise<void>((resolve) => {
        process_playground = process.spawn(
          'pnpm',
          ['--filter', 'playground', 'dev', '--mode', 'test'],
          {
            env: {
              ...(process as any).env,
              ...import.meta.env,
              ANVIL: 'true',
            },
          },
        )
        process_playground.stdout?.on('data', (data) => {
          if (data.toString().includes('ready')) resolve()
        })
      })
    })

  return () => {
    process_dialog?.kill()
    process_playground?.kill()
  }
}

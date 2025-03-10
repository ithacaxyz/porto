import { appendFile, glob, mkdir, readFile, rmdir } from 'node:fs/promises'
import { resolve } from 'node:path'

await rmdir(
  resolve(import.meta.dirname, '../src/core/internal/_generated/contracts'),
  { recursive: true },
)
await mkdir(
  resolve(import.meta.dirname, '../src/core/internal/_generated/contracts'),
  {
    recursive: true,
  },
)

const fileNames: string[] = []

for await (const file of glob(
  resolve(import.meta.dirname, '../contracts/out/**/*.json'),
)) {
  if (file.includes('build-info')) continue

  const fileName = file.split('/').pop()?.replace('.json', '')!
  if (fileNames.includes(fileName)) continue

  const { abi, bytecode } = JSON.parse(await readFile(file, 'utf-8'))
  fileNames.push(fileName)

  let code = ''
  code += `export const abi = ${JSON.stringify(abi, null, 2)} as const;\n\n`
  code += `export const code = ${JSON.stringify(
    bytecode.object,
    null,
    2,
  )} as const;\n\n`

  const out = resolve(
    import.meta.dirname,
    `../src/core/internal/_generated/contracts/${fileName}.ts`,
  )

  await appendFile(out, code)
}

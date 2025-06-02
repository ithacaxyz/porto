import * as fs from 'node:fs'
import * as path from 'node:path'
import { parse } from 'yaml'

const config = parse(
  fs.readFileSync(path.resolve(import.meta.dirname, './relay.yaml'), 'utf8'),
)

console.log(config)

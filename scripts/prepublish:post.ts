import * as fs from 'node:fs'
import * as path from 'node:path'

const packageJsonPath = path.join(process.cwd(), 'package.tmp.json')

fs.renameSync(packageJsonPath, packageJsonPath.replace('.tmp.json', '.json'))

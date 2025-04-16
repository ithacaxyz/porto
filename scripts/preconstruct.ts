import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'url';
import * as fs from 'node:fs';
import { getExports } from './utils/exports.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Setting up packages for development.');

const packagePath = resolve(__dirname, '../src/package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));

console.log(`${packageJson.name} — ${dirname(packagePath)}`);

const dir = resolve(dirname(packagePath));

// Empty dist directories
fs.rmSync(resolve(dir, '_dist'), { force: true, recursive: true });

const exports = getExports();

// Link exports to dist locations
for (const [key, distExports] of Object.entries(exports.dist ?? {})) {
  // Skip `package.json` exports
  if (/package\.json$/.test(key)) continue;

  let entries: any;
  if (typeof distExports === 'string') {
    entries = [
      ['default', distExports],
      ['types', distExports.replace('.js', '.d.ts')],
    ];
  } else entries = Object.entries(distExports as {});

  // Link exports to dist locations
  for (const [, value] of entries as [
    type: 'types' | 'default',
    value: string,
  ][]) {
    const srcFilePath = resolve(dir, exports.src[key]!);

    const distDir = resolve(dir, dirname(value));
    const distFileName = basename(value);
    const distFilePath = resolve(distDir, distFileName);

    fs.mkdirSync(distDir, { recursive: true });

    // Symlink src to dist file
    try {
      fs.symlinkSync(srcFilePath, distFilePath, 'file');
    } catch {}
  }
}

console.log('Done.');

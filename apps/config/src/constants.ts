import type { FontOption } from './types.js'

export const fontOptions = [
  { id: 'system', label: 'System font' },
  { id: 'sans-serif', label: 'Sans-serif' },
  { id: 'serif', label: 'Serif' },
] as const satisfies readonly FontOption[]

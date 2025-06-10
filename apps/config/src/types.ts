export type ConfigMode = 'general' | 'theming'

export type FontOption = {
  id: string
  label: string
}

export type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T][]

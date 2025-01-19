declare global {
  namespace App {}

  interface Window {
    EventEmitter: typeof EventEmitter
  }
}

export type {}

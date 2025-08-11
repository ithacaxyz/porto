declare namespace Cloudflare {
  interface Env {
    NONCE_STORE: KVNamespace
    JWT_SECRET: string
  }
}
interface Env extends Cloudflare.Env {}

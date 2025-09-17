# Service - A collection of Cloudflare Workers Route

Swiss Knife Worker for Porto Services

## Routes

- `/cors`
- `/verify`
- `/assets`

## Commands

### Development

```sh
cp .env.example .env

pnpm --filter service dev
```

> [!NOTE]
> To develop locally against remote R2 Buckets, you need to run with `remote: true`
> `remote: true` does not work with the Cloudflare Vite Plugin.
> So you need to run the development server directly with `wrangler`:
>
> ```sh
> node ./scripts/remote.ts
> ```

### Add a secret

```sh
echo <VALUE> | pnpm wrangler secret put <KEY> --name='service'
```

### Delete a secret

```sh
pnpm wrangler secret delete <KEY> --name='service'
```

### Remove a secret

```sh
pnpm wrangler secret delete <KEY> --name='service'
```

### Deploy

```sh
pnpm --filter service deploy
```

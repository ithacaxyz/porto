# Service - A collection of Cloudflare Workers Route

Swiss Knife Worker for Porto Services

## Routes

- `/cors`
- `/verify`

## Commands

### Development

```sh
pnpm --filter service dev
```

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

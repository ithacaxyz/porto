# Octopus

Swiss Knife Worker for Porto Services

## Routes

- `/onramp`
- `/faucet`
- `/verify`

## Commands

### Development

```sh
pnpm --filter octopus dev
```

### Add a secret

```sh
echo <VALUE> | pnpm wrangler secret put <KEY> --name='octopus'
```

### Delete a secret

```sh
pnpm wrangler secret delete <KEY> --name='octopus'
```

### Remove a secret

```sh
pnpm wrangler secret delete <KEY> --name='octopus'
```

### Deploy

```sh
pnpm --filter octopus deploy
```

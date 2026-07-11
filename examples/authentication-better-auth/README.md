> [!IMPORTANT]
> Porto is sunsetting. Please move any funds out before July 24, 2026. See the [sunsetting details](https://ithaca.xyz/updates/sunsetting-porto).

```sh
pnpx gitpick ithacaxyz/porto/tree/main/examples/authentication-better-auth porto-better-auth && cd porto-better-auth
pnpm i
cp .env.example .env
pnpm db:generate
pnpm dev
```

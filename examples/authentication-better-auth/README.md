```sh
pnpx gitpick ithacaxyz/porto/tree/main/examples/authentication-better-auth porto-better-auth && cd porto-better-auth
pnpm i
cp .dev.vars.example .dev.vars
pnpm db:generate
pnpm dev
```

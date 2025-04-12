# Porto Testnet Faucet

## Notes

- `.env` is used for running cli commands like `pnpm dlx wrangler@latest <command>`
- `.dev.vars` is used by wrangler to inject variables into the worker

## Deploying

### Generating a new faucet account (only if necessary)

If the faucet account needs to be updated, run the following command:

```bash
pnpm --filter faucet generate-account
```

### Fund the faucet account with EXP

Simply send some EXP to the address printed in the previous command.

### Deploying the faucet worker

#### (Option 1) Deploy from GitHub Action on github.com

- Go to the [Deploy Faucet workflow](https://github.com/ithacaxyz/porto/actions/workflows/deploy-faucet.yml)
- Click on `Run workflow`
- (Only if account update is needed) Fill in the `DRIP_PRIVATE_KEY` input with the private key of the new account
- (Only if account update is needed) Fill in the `DRIP_ADDRESS` input with the address of the new account
- Run the workflow

Done.

#### (Option 2) Deploy from local machine

```bash
# ask @portosdk for the token
export CLOUDFLARE_API_TOKEN=<your-token>

pnpm --filter faucet run deploy --var 'DRIP_ADDRESS:<address>'
```

Then update `DRIP_PRIVATE_KEY` on the deployed worker

```bash
# ask @portosdk for the token
export CLOUDFLARE_API_TOKEN=<your-token>

echo <private-key> | pnpm dlx wrangler@latest secret put DRIP_PRIVATE_KEY
```

Done.

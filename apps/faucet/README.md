# Porto Testnet Faucet

## Notes

- `.env` is used for running cli commands like `pnpm dlx wrangler@latest <command>`
- `.dev.vars` is used by wrangler to inject variables into the worker

## Deploying

Deployment happens on push to `main` and on `workflow_dispatch`.

To trigger a `workflow_dispatch` event (manual deployment):

- Go to the [Deploy Faucet workflow](https://github.com/ithacaxyz/porto/actions/workflows/deploy-faucet.yml)
- Click on `Run workflow`

Done.

> [!WARNING]
> To trigger a deployment from a local machine (not recommended), make sure you have:
>
> - the private key for the faucet account,
> - `CLOUDFLARE_API_TOKEN` set in your environment,
> - then run:
>
> ```bash
> /bin/bash ./scripts/deploy.sh <private_key>
> ```

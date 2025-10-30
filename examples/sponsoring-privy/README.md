# Merchant Sponsoring (Privy)

[Live Demo](https://sponsoring-privy-example.porto.workers.dev)

## 1. Setup

```sh
pnpx gitpick ithacaxyz/porto/tree/main/examples/sponsoring-privy porto-sponsoring-privy && cd porto-sponsoring-privy
```

## 2. Onboard Merchant (Sponsor) Account

Run the following command to onboard a new Porto Merchant (Sponsor) Account.

```sh
pnpx porto onboard --admin-key --testnet
```

Place the address and private key of the merchant account into the `.env` file.

```sh
MERCHANT_ADDRESS=0x...
MERCHANT_PRIVATE_KEY=0x...
```

## 3. Install & Start

Then, install dependencies and start the app.

```sh
pnpm i
pnpm dev
```

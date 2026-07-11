# Merchant Sponsoring (Express)

> [!IMPORTANT]
> Porto is sunsetting. Please move any funds out before July 24, 2026. See the [sunsetting details](https://ithaca.xyz/updates/sunsetting-porto).

## 1. Setup

```sh
pnpx gitpick ithacaxyz/porto/tree/main/examples/sponsoring-express porto-sponsoring && cd porto-sponsoring
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

# Merchant Sponsoring (Next.js)

## 1. Setup

```sh
pnpx gitpick ithacaxyz/porto/tree/main/examples/sponsoring-next.js porto-sponsoring && cd porto-sponsoring
```

## 2. Onboard Merchant (Sponsor) Account

Run the following command to onboard a new Porto Merchant (Sponsor) Account.

```sh
pnpx porto onboard -a
```

Place the address and private key of the merchant account into the `.env` file.

```sh
NEXT_PUBLIC_MERCHANT_ADDRESS=0x...
NEXT_PUBLIC_MERCHANT_PRIVATE_KEY=0x...
```

## 3. Install & Start

Then, install dependencies and start the app.

```sh
pnpm i
pnpm dev
```

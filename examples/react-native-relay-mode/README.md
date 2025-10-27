# React Native Relay Mode (with SIWE)

## 1. Setup

```sh
pnpx gitpick ithacaxyz/porto/tree/main/examples/react-native-relay-mode porto-react-native-relay-app && cd porto-react-native-relay-app

cp .env.example .env
```

## 2. Prerequisites

- XCode for iOS with iOS Simulator (I use [XCodesApp](https://github.com/XcodesOrg/XcodesApp))
- Android Studio for Android with Android Emulator (If targeting Android)
- Apple App Site Association (AASA) and Android Asset Links:
  - See [github.com/peterferguson/react-native-passkeys](https://github.com/peterferguson/react-native-passkeys/blob/main/README.md#ios-setup) on how to setup both for production
  - A server example is provided in the `server` directory

## 3. Install Dependencies

```sh
pnpm i
```

## 4. Run the app

### iOS

```sh
pnpm expo run:ios
```

### Web

```sh
pnpm start
```

### Server

The example uses the same server for SIWE auth and for `.well-known` files.

#### Development

Run in development mode with:

```sh
bun --watch --hot ./server/index.ts --env-file .env
```

#### Production

The example deployes the server to [Railway](https://railway.app) using the `server/railway.toml` and the following command:

```sh
cd server
RAILWAY_DOCKERFILE="./Dockerfile" railway up \
  --service="porto-relay-mode" \
  --environment='production'
```

You can deploy to any platform that supports Docker / containers runtime.

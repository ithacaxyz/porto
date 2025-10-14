# React Native Relay Mode

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

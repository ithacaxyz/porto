# React Native Mode

## 1. Setup

```sh
pnpx gitpick ithacaxyz/porto/tree/main/examples/react-native porto-react-native-app && cd porto-react-native-app
```

## 2. Prerequisites

- XCode for iOS with iOS Simulator (I use [XCodesApp](https://github.com/XcodesOrg/XcodesApp))
- Android Studio for Android with Android Emulator (If targeting Android)

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

## Development

```sh
pnpm expo start --dev-client --tunnel --clear
```

If you encounter any errors like `Unable to resolve "./crypto.js" from "src/react-native/register.ts"`, build Porto then try again:

```sh
pnpm --workspace-root build:dist
```

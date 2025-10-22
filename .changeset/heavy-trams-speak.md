---
"porto": patch
---

- Introduced [React Native](https://reactnative.dev/blog/2023/06/21/package-exports-support#the-new-react-native-condition) custom [exports conditions](https://nodejs.org/docs/latest-v19.x/api/packages.html#community-conditions-definitions) in `package.json#exports` to automatically apply crypto polyfill for Wagmi usage without requiring additional configuration in consumer codebases.
Checkout the [Porto/Wagmi React Native example](https://github.com/ithacaxyz/porto/tree/main/examples/react-native)
- Fixed chain id not syncing between dialog and React Native when for permissions requests

// Learn more https://docs.expo.io/guides/customizing-metro
/**
 * @typedef {import('expo/metro-config').MetroConfig} MetroConfig
 */
const { getDefaultConfig } = require('expo/metro-config')

const defaultConfiguration = getDefaultConfig(__dirname)

/** @type {MetroConfig} */
module.exports = {
  ...defaultConfiguration,
  resolver: {
    ...defaultConfiguration.resolver,
    resolveRequest: (context, moduleName, platform) => {
      /**
       * if `node:crypto`, replace it with `expo-crypto`
       */
      if (moduleName.startsWith('node:crypto'))
        return {
          filePath: require.resolve('expo-crypto'),
          type: 'sourceFile',
        }

      /**
       * Prefer CJS for `ox` to avoid `window.*` usage in ESM builds
       * TODO: fix this in `ox`
       */
      if (moduleName.startsWith('ox'))
        return {
          filePath: require.resolve(moduleName),
          type: 'sourceFile',
        }

      return context.resolveRequest(context, moduleName, platform)
    },
    unstable_conditionNames: [
      'react-native',
      ...(defaultConfiguration.resolver?.unstable_conditionNames || []),
      'import',
    ],
    unstable_enablePackageExports: true,
  },
  transformer: {
    ...defaultConfiguration.transformer,
  },
}

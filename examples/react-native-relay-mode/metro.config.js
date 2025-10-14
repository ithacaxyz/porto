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
       * if `node:crypto` or `crypto`, replace it with `expo-crypto`
       */
      if (
        (moduleName.startsWith('node:crypto') ||
          moduleName.startsWith('crypto')) &&
        platform !== 'web'
      )
        return {
          filePath: require.resolve('expo-crypto'),
          type: 'sourceFile',
        }

      /**
       * Prefer CJS for `ox` or `@noble/hashes` to avoid `window.*` usage in ESM builds
       * To see what's wrong, comment out this block and run `pnpm expo run:ios`
       * TODO: fix this in `ox`
       */
      if (moduleName.startsWith('ox') || moduleName.startsWith('@noble/hashes'))
        return {
          filePath: require.resolve(moduleName),
          type: 'sourceFile',
        }

      return context.resolveRequest(context, moduleName, platform)
    },
    unstable_conditionNames: [
      ...(defaultConfiguration.resolver?.unstable_conditionNames || []),
      'import',
    ],
  },
  transformer: {
    ...defaultConfiguration.transformer,
  },
}

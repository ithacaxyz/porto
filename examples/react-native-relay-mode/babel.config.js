/** @type {import('@babel/core').ConfigFunction} */
module.exports = (api) => {
  api.cache(true)
  return {
    plugins: [
      ['babel-plugin-react-compiler', { target: '19' }],
      'babel-plugin-transform-import-meta',
    ],
    presets: [
      [
        'babel-preset-expo',
        {
          unstable_transformImportMeta: true,
        },
      ],
    ],
  }
}

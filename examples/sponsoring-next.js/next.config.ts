import type { NextConfig } from 'next'

export default {
  experimental: {
    externalDir: true,
  },
  reactStrictMode: true,
  webpack(config) {
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts'],
    }
    return config
  },
} satisfies NextConfig

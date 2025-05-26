import type { NextConfig } from 'next'

export default {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts'],
    }
    return config
  },
} satisfies NextConfig

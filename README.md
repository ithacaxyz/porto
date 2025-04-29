![Porto](https://github.com/ithacaxyz/porto/blob/main/.github/banner.png)

# Porto

Experimental Next-gen Account for Ethereum.

<p>
  <a href="https://www.npmjs.com/package/porto">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/npm/v/porto?colorA=21262d&colorB=21262d&style=flat">
      <img src="https://img.shields.io/npm/v/porto?colorA=f6f8fa&colorB=f6f8fa&style=flat" alt="Version">
    </picture>
  </a>
  <a href="https://github.com/ithacaxyz/porto/blob/main/LICENSE-MIT">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/license-MIT-blue.svg?colorA=21262d&colorB=21262d&style=flat">
      <img src="https://img.shields.io/badge/license-MIT-blue.svg?colorA=f6f8fa&colorB=f6f8fa&style=flat" alt="MIT License">
    </picture>
  </a>
  <a href="https://github.com/ithacaxyz/porto/blob/main/LICENSE-APACHE">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/license-APACHE-blue.svg?colorA=21262d&colorB=21262d&style=flat">
      <img src="https://img.shields.io/badge/license-APACHE-blue.svg?colorA=f6f8fa&colorB=f6f8fa&style=flat" alt="APACHE License">
    </picture>
  </a>
</p>

> [!WARNING]
> Do not use in production. This repository is work-in-progress and highly experimental. Non-major version bumps may contain breaking changes.

## Documentation

For documentation and guides, visit [porto.sh](https://porto.sh).

## Development

### Apps

```bash
$ pnpm install # Install dependencies
$ pnpm dev # Run manager, playground, and iframe dialog
```

### Tests

```bash
$ pnpm install # Install dependencies
$ docker pull ghcr.io/ithacaxyz/relay:latest # Pull Relay image
$ pnpm test # Test
```

### Contracts

```bash
# Install Foundry
$ foundryup

$ forge build --config-path ./contracts/foundry.toml # Build
$ forge test --config-path ./contracts/foundry.toml # Test
```

## License

<sup>
Licensed under either of <a href="LICENSE-APACHE">Apache License, Version
2.0</a> or <a href="LICENSE-MIT">MIT license</a> at your option.
</sup>

<br>

<sub>
Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in these packages by you, as defined in the Apache-2.0 license,
shall be dual licensed as above, without any additional terms or conditions.
</sub>

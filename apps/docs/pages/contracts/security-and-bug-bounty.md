# Security

⚠️ Contracts have been audited by Riley H, Kaden & Milotruck. 

## Bug Bounty

We're opening up a live bug bounty program to encourage responsible security research and battle-test our contracts in the real world. We’re inviting white hat hackers, tinkerers, and security researchers to probe our account implementation.


---

### 🪙 Bounty Rewards

| Severity  | Reward         | Examples                                                                 |
|-----------|----------------|--------------------------------------------------------------------------|
| Critical  |  Up to 5 ETH   | Successfully drain one of the live accounts using any vulnerability      |
| High      |  Up to 2.5 ETH | Prevent a user from accessing funds |
| Medium    |  Discretionary | - |

-The exact severity of bugs is determined from a combination of security impact, and the likelihood of this attack occuring, at the discretion of the Ithaca team.

-We currently don’t have any open bounties for low & info bugs, or gas optimizations. But if you find one, feel free to open an issue in [the account repo](https://github.com/ithacaxyz/account), for good karma.

### Scope

The current bug bounty covers the smart contracts in the [account repo with the version tag at v0.5.4 or above](https://github.com/ithacaxyz/account/releases/tag/v0.5.4). Previous releases and other code are considered out-of-scope.

### Criteria for Bug Bounty eligibility

1. The bug must be novel. It must not be a previously known issue to us (github issue, or surfaced by a previous audit), or revealed/exploited via an on-chain transaction.
2. Security vulnerability reports must be sent to [`security@ithaca.xyz`](mailto:security@ithaca.xyz) to be eligible for a bounty.
3. Public disclosure of the bug must be after written approval by the Ithaca team.
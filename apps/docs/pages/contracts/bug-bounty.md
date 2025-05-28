

## Bug Bounty

We're opening up a live bug bounty program to encourage responsible security research and battle-test our contracts in the real world. We’re inviting white hat hackers, tinkerers, and security researchers to probe our account implementation.

### Capture the Funds

- **Porto smart account** deployed on Base mainnet, funded with **1 ETH**
- Regular operations include: upgrades, signing, execution
- **Open challenge:** Anyone may attempt to drain the account. If successful, **you keep the funds**

**Account Address:** `0xb4B87c22950eD0f3D83aabd3dE20009bA9b16DF1`  
**Chain ID:** `8453`  
**Deployed Commit:** [`v0.2.0`](https://github.com/ithacaxyz/account/releases/tag/v0.2.0)  
For a complete list of the deployment addresses, refer to the [Address Book section](/contracts/address-book)

---

### 🪙 Bounty Rewards

| Severity  | Reward         | Examples                                                                 |
|-----------|----------------|--------------------------------------------------------------------------|
| Critical  | Keep the funds | Successfully drain one of the live accounts using any vulnerability     |
| High      | Ad hoc reward  | Prevent a user from accessing funds, or get them to sign a malicious op |

We currently don’t have any open bounties for low & medium bugs, or gas optimizations. But if you find one, feel free to open an issue in [the account repo](https://github.com/ithacaxyz/account), for good karma. 

Private security vulnerability reports can be sent via [`security@ithaca.xyz`](mailto:security@ithaca.xyz) .




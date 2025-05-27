# Security

⚠️ All contracts are currently unaudited and undergoing active development. 

To provide an additional layer of security during this period, we've implemented a temporary pause functionality. 

This feature enables a designated [`PauseAuthority`](https://github.com/ithacaxyz/account/blob/main/src/PauseAuthority.sol) role within the `Orchestrator` to suspend all account signatures and executions for a maximum of four weeks.
# Overview

## Methods

| Method                                                                      | Description                                                                        | Standard                                            |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------- |
| [`eth_accounts`](/sdk/rpc/eth_accounts)                                     | Returns an array of all **connected** Account addresses.                           | [EIP-1474](https://eips.ethereum.org/EIPS/eip-1474) |
| [`eth_requestAccounts`](/sdk/rpc/eth_requestAccounts)                       | Requests access to Account addresses.                                              |                                                     |
| [`eth_sendTransaction`](/sdk/rpc/eth_sendTransaction)                       | Broadcasts a transaction to the network.                                           | [EIP-1474](https://eips.ethereum.org/EIPS/eip-1474) |
| [`eth_signTypedData_v4`](/sdk/rpc/eth_signTypedData_v4)                     | Signs [EIP-712](https://eips.ethereum.org/EIPS/eip-712) typed data.                | [EIP-712](https://eips.ethereum.org/EIPS/eip-712)   |
| [`personal_sign`](/sdk/rpc/personal_sign)                                   | Signs an [EIP-191](https://eips.ethereum.org/EIPS/eip-191) personal message.       | [EIP-191](https://eips.ethereum.org/EIPS/eip-191)   |
| [`wallet_connect`](/sdk/rpc/wallet_connect)                                 | Requests to connect account(s) with optional capabilities.                         | [ERC-7846](https://eips.ethereum.org/EIPS/eip-7846) |
| [`wallet_disconnect`](/sdk/rpc/wallet_disconnect)                           | Disconnects the Application from Porto.                                            | [ERC-7846](https://eips.ethereum.org/EIPS/eip-7846) |
| [`wallet_getCapabilities`](/sdk/rpc/wallet_getCapabilities)                 | Gets supported capabilities of Porto..                                             | [ERC-5792](https://eips.ethereum.org/EIPS/eip-5792) |
| [`wallet_getCallsStatus`](/sdk/rpc/wallet_getCallsStatus)                   | Gets the status of a call bundle.                                                  | [ERC-5792](https://eips.ethereum.org/EIPS/eip-5792) |
| [`wallet_getPermissions`](/sdk/rpc/wallet_getPermissions)       | Returns the active permissions for an account.                                     | Experimental                                        |
| [`wallet_grantPermissions`](/sdk/rpc/wallet_grantPermissions)   | Grants permissions for an Application to perform actions on behalf of the account. | Experimental                                        |
| [`wallet_revokePermissions`](/sdk/rpc/wallet_revokePermissions) | Revokes a permission.                                                              | Experimental                                        |
| [`wallet_prepareCalls`](/sdk/rpc/wallet_prepareCalls)                       | Prepares a call bundle.                                                            | [ERC-7836](https://eips.ethereum.org/EIPS/eip-7836) |
| [`wallet_sendCalls`](/sdk/rpc/wallet_sendCalls)                             | Broadcast a bundle of calls to the network.                                        | [ERC-5792](https://eips.ethereum.org/EIPS/eip-5792) |
| [`wallet_sendPreparedCalls`](/sdk/rpc/wallet_sendPreparedCalls)             | Executes a signed and prepared call bundle.                                        | [ERC-7836](https://eips.ethereum.org/EIPS/eip-7836) |

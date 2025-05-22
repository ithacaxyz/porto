# Getting Started
## Architecture
![Architecture](/architecture.png)

## Overview 

The onchain infrastructure that powers Porto consists of the following contracts:

##### Porto Account
The Porto Account is a keychain that holds user funds, enforces permissions via [Keys](/contracts/account#keys), manages nonces to prevent replay attacks, and enables secure executions from the account.

##### Orchestrator
The Orchestrator is a [privileged](/contracts/account#orchestrator-integration) contract that facilitates trustless interactions between the relay and the account.

##### Simulator
The Simulator is a peripheral utility that enables offchain services to obtain accurate gas estimates for intents in a single RPC call.
# Orchestrator
The Orchestrator is a privileged contract that facilitates trustless interactions between the relay and the account.

## Intent 
The orchestrator accepts executions in the form of an intent. 

An `intent` struct contains all the relevant data that allows a 3rd party like the relay to make an execution on behalf of the user, and get paid for it.

The intent has to be signed by one of the [Keys](./account.md#keys) authorized in the user's account. Optionally, the intent can use a `paymaster` to pay on behalf of the user, in which case the intent also needs to be signed by the paymaster.

```solidity
    struct Intent {
        ////////////////////////////////////////////////////////////////////////
        // EIP-712 Fields
        ////////////////////////////////////////////////////////////////////////
        /// @dev The user's address.
        address eoa;
        /// @dev An encoded array of calls, using ERC 7821 batch encoding without opData.
        /// `abi.encode(calls)`, where `calls` is of type `Call[]`.
        /// This allows for more efficient safe forwarding to the EOA.
        bytes executionData;
        /// @dev Per delegated EOA.
        /// This nonce is a 4337-style 2D nonce with some specializations:
        /// - Upper 192 bits are used for the `seqKey` (sequence key).
        ///   The upper 16 bits of the `seqKey` is `MULTICHAIN_NONCE_PREFIX`,
        ///   then the Intent EIP712 hash will exclude the chain ID.
        /// - Lower 64 bits are used for the sequential nonce corresponding to the `seqKey`.
        uint256 nonce;
        /// @dev The account paying the payment token.
        /// If this is `address(0)`, it defaults to the `eoa`.
        address payer;
        /// @dev The ERC20 or native token used to pay for gas.
        address paymentToken;
        /// @dev The amount of the token to pay, before the call batch is executed
        /// This will be required to be less than `totalPaymentMaxAmount`.
        uint256 prePaymentMaxAmount;
        /// @dev The maximum amount of the token to pay.
        uint256 totalPaymentMaxAmount;
        /// @dev The combined gas limit for payment, verification, and calling the EOA.
        uint256 combinedGas;
        /// @dev Optional array of encoded PreCalls that will be verified and executed
        /// after PREP (if any) and before the validation of the overall Intent.
        /// A PreCall will NOT have its gas limit or payment applied.
        /// The overall Intent's gas limit and payment will be applied, encompassing all its PreCalls.
        /// The execution of a PreCall will check and increment the nonce in the PreCall.
        /// If at any point, any PreCall cannot be verified to be correct, or fails in execution,
        /// the overall Intent will revert before validation, and execute will return a non-zero error.
        /// A PreCall can contain PreCalls, forming a tree structure.
        /// The `executionData` tree will be executed in post-order (i.e. left -> right -> current).
        /// The `encodedPreCalls` are included in the EIP712 signature, which enables execution order
        /// to be enforced on-the-fly even if the nonces are from different sequences.
        bytes[] encodedPreCalls;
        ////////////////////////////////////////////////////////////////////////
        // Additional Fields (Not included in EIP-712)
        ////////////////////////////////////////////////////////////////////////
        /// @dev Optional data for `initPREP` on the account.
        /// This is encoded using ERC7821 style batch execution encoding.
        /// (ERC7821 is a variant of ERC7579).
        /// `abi.encode(calls, abi.encodePacked(bytes32(saltAndAccount)))`,
        /// where `calls` is of type `Call[]`,
        /// and `saltAndAccount` is `bytes32((uint256(salt) << 160) | uint160(account))`.
        bytes initData;
        /// @dev The actual pre payment amount, requested by the filler. MUST be less than or equal to `prePaymentMaxAmount`
        uint256 prePaymentAmount;
        /// @dev The actual total payment amount, requested by the filler. MUST be less than or equal to `totalPaymentMaxAmount`
        uint256 totalPaymentAmount;
        /// @dev The payment recipient for the ERC20 token.
        /// Excluded from signature. The filler can replace this with their own address.
        /// This enables multiple fillers, allowing for competitive filling, better uptime.
        address paymentRecipient;
        /// @dev The wrapped signature.
        /// `abi.encodePacked(innerSignature, keyHash, prehash)`.
        bytes signature;
        /// @dev Optional payment signature to be passed into the `compensate` function
        /// on the `payer`. This signature is NOT included in the EIP712 signature.
        bytes paymentSignature;
        /// @dev Optional. If non-zero, the EOA must use `supportedAccountImplementation`.
        /// Otherwise, if left as `address(0)`, any EOA implementation will be supported.
        /// This field is NOT included in the EIP712 signature.
        address supportedAccountImplementation;
    }
```

Let's go through each of these fields, to discuss the features enabled by intents.

### Gas Abstraction

One of the most powerful use cases of executing through intents is that backend relays can abstract gas for users and get compensated in any token the user holds.

We've eliminated the concept of `gas refunds`, and made `prePayment` optional.

Here's how the flow works:

1. The user sends their calls to the relay.
2. The relay analyzes the calls and determines the amount they want to be paid, in the `paymentToken` specified in the intent.
3. The relay can run sophisticated griefing checks to assess risk. Based on this, they split the total payment between `prePayment` and `postPayment`.
4. The relay can also set the `supportedAccountImplementation` field in the intent when sending it onchain, to reduce the risk of the user frontrunning them by upgrading their account.

If the `postPayment` fails, the user's entire execution is reverted. This ensures users cannot exploit the system to get free executions.

:::warning
Beyond this, the contracts do not provide native griefing protection. It is up to the relay to simulate the call and evaluate the risk associated with each intent.

Relays may choose to:
- Only support accounts that follow ERC-4337 validation rules.
- Charge the full fee as `postPayment` if they fully trust the user.
:::

We leave the decision of how to split the payment between `prePayment` and `postPayment` entirely to each relay.

Our recommendations:

1. Including both `prePayment` and `postPayment` in an intent introduces an extra ERC20 transfer, increasing gas costs. This tradeoff should be considered.
2. Relays should build sophisticated offchain griefing defenses, such as reputation systems and risk premiums for new users.
3. Charging only via `postPayment` allows the user to start execution without upfront funds. This enables use cases where funds become available only after the call—e.g., after withdrawing from a DApp.

:::note
There is no `postPayment` field in the intent. Post payment is calculated as `totalPayment - prePayment`.
This is done to make the EIP-712 struct more explicit and readable.
:::

### Paymasters
On the topic of payments, DApps might want to sponsor payments for their users. 
This means that instead of the payment to the relay being collected from the user's porto account, it can be collected from any third-party contract that implements the [pay()](./account.md#1-pay) function.

To sponsor an intent, you just need to set the `payer` field to the paymaster contract's address. 

:::note
If left empty, the payer field is substituted with the intent's eoa address. 

This is done for a gas optimization, related to calldata compression.
:::

We've allowed porto accounts to act as paymasters for other porto accounts. This makes it extremely simple to spin up paymasters to sponsor gas for your users.

### Execution
The intent contains the following execution information:

##### nonce
Same as the nonce mechanic detailed [here](./account.md#nonce-management) in the account.
All nonces are stored and incremented in the storage of the account. The orchestrator just has special privilege to access these storage slots.

##### executionData
Since all the data like nonce and signature is added in their corresponding fields in the intent. 
The executionData requires no additional `opData` and uses the `0x0100...` single batch encoding described [here](./account.md#modes).

### Account Creation 
We currently use PREP to initialize provably rootless 7702 accounts. 
All the initialization data goes in the `initData` field.
:::info
More Details Coming Soon
:::

### PreCalls
:::info
More Details Coming Soon
:::


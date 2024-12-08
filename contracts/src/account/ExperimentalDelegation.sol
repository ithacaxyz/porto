// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Receiver} from "solady/accounts/Receiver.sol";
import {UUPSUpgradeable} from "solady/utils/UUPSUpgradeable.sol";
import {JwtVerifier} from "zklogin/JwtVerifier.sol";

import {MultiSendCallOnly} from "../utils/MultiSend.sol";
import {ECDSA} from "../utils/ECDSA.sol";
import {P256} from "../utils/P256.sol";
import {WebAuthnP256} from "../utils/WebAuthnP256.sol";

/// @title ExperimentalDelegation
/// @author jxom <https://github.com/jxom>
/// @notice Experimental EIP-7702 Delegation contract that allows authorized Keys to invoke calls on behalf of an EOA.
contract ExperimentalDelegation is Receiver, MultiSendCallOnly {
    ////////////////////////////////////////////////////////////////////////
    // Data Structures
    ////////////////////////////////////////////////////////////////////////

    /// @notice The type of key.
    enum KeyType {
        P256,
        WebAuthnP256
    }

    /// @notice A Key that can be used to authorize calls.
    /// @custom:property publicKey - ECDSA public key.
    /// @custom:property expiry - Unix timestamp at which the key expires (0 = never).
    /// @custom:property keyType - Type of key (0 = P256, 1 = WebAuthnP256).
    struct Key {
        uint256 expiry;
        KeyType keyType;
        ECDSA.PublicKey publicKey;
    }

    /// @notice A wrapped signature.
    /// @custom:property keyIndex - The index of the authorized key.
    /// @custom:property signature - The ECDSA signature.
    /// @custom:property metadata - (Optional) Key-specific metadata.
    struct WrappedSignature {
        uint32 keyIndex;
        ECDSA.Signature signature;
        bool prehash;
        bytes metadata;
    }

    ////////////////////////////////////////////////////////////////////////
    // Constants
    ////////////////////////////////////////////////////////////////////////

    bytes public constant OWNER_METADATA = abi.encodePacked(bytes4(0xdeadbeef));

    ////////////////////////////////////////////////////////////////////////
    // Errors
    ////////////////////////////////////////////////////////////////////////

    /// @notice Thrown when the EOA has already been initialized.
    error AlreadyInitialized();

    /// @notice Thrown when a key is expired or unauthorized.
    error KeyExpiredOrUnauthorized();

    /// @notice Thrown when the sender is not the EOA.
    error InvalidAuthority();

    /// @notice Thrown when a signature is invalid.
    error InvalidSignature();

    ////////////////////////////////////////////////////////////////////////
    // Functions
    ////////////////////////////////////////////////////////////////////////

    /// @notice Label to associate with the EOA.
    string public label;

    /// @notice List of keys associated with the EOA.
    Key[] public keys;

    /// @notice Authorization nonce used for replay protection.
    uint256 public nonce;

    JwtVerifier.AccountData public zkLoginAccount;

    /// @notice Initializes the EOA with a public key to authorize.
    /// @param label_ - The label to associate with the EOA.
    /// @param keys_ - The keys to authorize.
    function initialize(string calldata label_, Key[] calldata keys_) public onlyOwner {
        if (keys.length > 0) revert AlreadyInitialized();

        label = label_;

        _authorize(keys_);
    }

    /// @notice Initializes the EOA with a public key to authorize, provided the EOA's signature.
    /// @param label_ - The label to associate with the EOA.
    /// @param keys_ - The key to authorize.
    /// @param signature - The signature over the key: `sign(keccak256(abi.encode(nonce, key)))`.
    function initialize(string calldata label_, Key[] calldata keys_, ECDSA.Signature calldata signature) public {
        bytes32 digest = keccak256(abi.encode(nonce++, label_, keys_));

        address signer = ecrecover(digest, signature.yParity == 0 ? 27 : 28, bytes32(signature.r), bytes32(signature.s));
        if (signer != address(this)) revert InvalidSignature();

        if (keys.length > 0) revert AlreadyInitialized();

        label = label_;

        _authorize(keys_);
    }

    /// @notice Authorizes a new public key.
    /// @param keys_ - The key to authorize.
    function authorize(Key[] calldata keys_) public onlyOwner {
        _authorize(keys_);
    }

    /// @notice Authorizes a new public key on behalf of the EOA, provided the EOA's signature.
    /// @param keys_ - The keys to authorize.
    /// @param signature - The signature over the keys: `sign(keccak256(abi.encode(nonce, keys)))`.
    function authorize(Key[] calldata keys_, bytes calldata signature) public {
        WrappedSignature memory wrappedSignature = _parseSignature(signature);
        Key memory authorizingKey = keys[wrappedSignature.keyIndex];

        // Revert for expiring keys. Assume that non-expiring keys are "admins".
        if (authorizingKey.expiry != 0) revert KeyExpiredOrUnauthorized();

        bytes32 digest = keccak256(abi.encode(nonce++, keys_));
        _assertSignature(digest, signature);

        _authorize(keys_);
    }

    /// @notice Revokes an authorized public key.
    /// @param keyIndex - The index of the public key to revoke.
    function revoke(uint32 keyIndex) public onlyOwner {
        keys[keyIndex].expiry = 1;
    }

    /// @notice Revokes an authorized public key on behalf of the EOA, provided the EOA's signature.
    /// @param keyIndex - The index of the public key to revoke.
    /// @param signature - The signature over the key index: `sign(keccak256(abi.encodePacked(nonce, keyIndex)))`.
    function revoke(uint32 keyIndex, bytes calldata signature) public {
        WrappedSignature memory wrappedSignature = _parseSignature(signature);
        Key memory authorizingKey = keys[wrappedSignature.keyIndex];

        // Revert for expiring keys. Assume that non-expiring keys are "admins".
        if (authorizingKey.expiry != 0) revert KeyExpiredOrUnauthorized();

        bytes32 digest = keccak256(abi.encodePacked(nonce++, keyIndex));
        _assertSignature(digest, signature);

        keys[keyIndex].expiry = 1;
    }

    function zkLoginAddBackup(JwtVerifier.AccountData calldata data) public onlyOwner {
        zkLoginAccount = data;
    }

    function zkLoginRecover(bytes calldata proof, bytes32 publicKeyHash, uint256 jwtIat, Key calldata newKey)
        external
    {
        require(
            JwtVerifier.verifyJwtProof(
                zkLoginAccount,
                JwtVerifier.VerificationData({
                    proof: proof,
                    publicKeyHash: publicKeyHash,
                    jwtNonce: keccak256(abi.encode(newKey)),
                    // TODO: check expiration?
                    jwtIat: jwtIat
                })
            ),
            "invalid zklogin proof"
        );

        Key[] memory newKeys = new Key[](1);
        newKeys[0] = newKey;
        _authorize(newKeys);
    }

    /// @notice Executes a set of calls.
    /// @param calls - The calls to execute.
    function execute(bytes memory calls) public onlyOwner {
        multiSend(calls);
    }

    /// @notice Executes a set of calls on behalf of the EOA, provided a signature that was signed by an authorized key.
    /// @param calls - The calls to execute.
    /// @param signature - The wrapped signature over the calls.
    function execute(bytes memory calls, bytes calldata signature) public {
        bytes32 digest = keccak256(abi.encodePacked(nonce++, calls));
        _assertSignature(digest, signature);

        multiSend(calls);
    }

    /// @notice Checks if a signature is valid.
    /// @param digest - The digest to verify.
    /// @param signature - The wrapped signature to verify.
    /// @return magicValue - The magic value indicating the validity of the signature.
    function isValidSignature(bytes32 digest, bytes calldata signature) public view returns (bytes4 magicValue) {
        WrappedSignature memory wrappedSignature = _parseSignature(signature);

        // If prehash flag is set (usually for WebCrypto P256), SHA-256 hash the digest.
        if (wrappedSignature.prehash) digest = sha256(abi.encodePacked(digest));

        bytes4 success = bytes4(keccak256("isValidSignature(bytes32,bytes)"));
        bytes4 failure = bytes4(0);

        // If the signature was computed by the EOA, the signature is valid.
        if (keccak256(wrappedSignature.metadata) == keccak256(OWNER_METADATA)) {
            if (
                ecrecover(
                    digest,
                    wrappedSignature.signature.yParity == 0 ? 27 : 28,
                    bytes32(wrappedSignature.signature.r),
                    bytes32(wrappedSignature.signature.s)
                ) == address(this)
            ) return success;
        }

        if (keys.length > 0) {
            Key memory key = keys[wrappedSignature.keyIndex];

            // If the key has expired, the signature is invalid.
            if (key.expiry > 0 && key.expiry < block.timestamp) return failure;

            // Verify based on key type.
            if (key.keyType == KeyType.P256 && P256.verify(digest, wrappedSignature.signature, key.publicKey)) {
                return success;
            }
            if (key.keyType == KeyType.WebAuthnP256) {
                WebAuthnP256.Metadata memory metadata = abi.decode(wrappedSignature.metadata, (WebAuthnP256.Metadata));
                if (WebAuthnP256.verify(digest, metadata, wrappedSignature.signature, key.publicKey)) return success;
            }
        }

        // If the signature is not valid, return the failure magic value.
        return failure;
    }

    /// @notice Gets the keys associated with the EOA.
    function getKeys() public view returns (Key[] memory) {
        return keys;
    }

    ////////////////////////////////////////////////////////////////////////
    // Modifiers
    ////////////////////////////////////////////////////////////////////////

    /// @notice Modifier to ensure the caller is the owner.
    modifier onlyOwner() {
        if (msg.sender != address(this)) revert InvalidAuthority();
        _;
    }

    ////////////////////////////////////////////////////////////////////////
    // Internal
    ////////////////////////////////////////////////////////////////////////

    /// @notice Authorizes a new public key.
    /// @param keys_ - The keys to authorize.
    function _authorize(Key[] memory keys_) internal {
        for (uint32 i = 0; i < keys_.length; i++) {
            keys.push(keys_[i]);
        }
    }

    /// @notice Asserts that a signature is valid.
    /// @param digest - The digest to verify.
    /// @param signature - The wrapped signature to verify.
    function _assertSignature(bytes32 digest, bytes calldata signature) internal view {
        WrappedSignature memory wrappedSignature = abi.decode(signature, (WrappedSignature));

        Key memory key = keys[wrappedSignature.keyIndex];
        if (key.expiry > 0 && key.expiry < block.timestamp) {
            revert KeyExpiredOrUnauthorized();
        }

        if (isValidSignature(digest, signature) == bytes4(0)) {
            revert InvalidSignature();
        }
    }

    /// @notice Parses a signature from bytes format.
    /// @param signature - The signature to parse.
    /// @return wrappedSignature - The parsed signature.
    function _parseSignature(bytes calldata signature) internal pure returns (WrappedSignature memory) {
        if (signature.length == 65) {
            bytes32 r = bytes32(signature[0:32]);
            bytes32 s = bytes32(signature[32:64]);
            uint8 yParity = uint8(signature[64]);
            return WrappedSignature(0, ECDSA.Signature(uint256(r), uint256(s), yParity), false, OWNER_METADATA);
        }
        return abi.decode(signature, (WrappedSignature));
    }
}

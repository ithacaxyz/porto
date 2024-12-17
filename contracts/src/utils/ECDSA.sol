// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

library ECDSA {
    struct PublicKey {
        uint256 x;
        uint256 y;
    }

    struct Signature {
        uint256 r;
        uint256 s;
        uint8 yParity;
    }

    /// @notice Verifies an ECDSA signature.
    /// @param digest 32 bytes of the signed data hash
    /// @param signature Signature of the signer
    /// @param publicKey Public key of the signer
    /// @return success Represents if the operation was successful
    function verify(bytes32 digest, Signature memory signature, PublicKey memory publicKey) internal pure returns (bool) {
        address signer = ecrecover(digest, signature.v, signature.r, signature.s);

        if (signer == address(0)) return false;

        bytes memory publicKeyBytes = abi.encodePacked(bytes1(0x04), publicKey.x, publicKey.y);

        bytes32 publicKeyHash = keccak256(publicKeyBytes);

        return signer == address(uint160(uint256(publicKeyHash)));
    }
}

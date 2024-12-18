// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Test, console2} from "forge-std/Test.sol";
import {stdJson} from "forge-std/StdJson.sol";
import {VmSafe} from "forge-std/Vm.sol";
import {ExperimentalDelegation} from "../../src/account/ExperimentalDelegation.sol";
import {P256} from "../../src/utils/P256.sol";
import {ECDSA} from "../../src/utils/ECDSA.sol";
import {WebAuthnP256} from "../../src/utils/WebAuthnP256.sol";

contract Callee {
    error UnexpectedSender(address expected, address actual);

    mapping(address => uint256) public counter;
    mapping(address => uint256) public values;

    function increment() public payable {
        counter[msg.sender] += 1;
        values[msg.sender] += msg.value;
    }

    function expectSender(address expected) public payable {
        if (msg.sender != expected) {
            revert UnexpectedSender(expected, msg.sender);
        }
    }
}

contract ExperimentalDelegationTest is Test {
    ExperimentalDelegation public delegation;
    uint256 public p256PrivateKey;
    Callee public callee;

    function setUp() public {
        callee = new Callee();
        delegation = new ExperimentalDelegation();
        p256PrivateKey = 100366595829038452957523597440756290436854445761208339940577349703440345778405;
        vm.deal(address(delegation), 1.5 ether);
        vm.warp(69420);
    }

    function test_initialize() public {
        vm.pauseGasMetering();

        (uint256 x, uint256 y) = vm.publicKeyP256(p256PrivateKey);

        ExperimentalDelegation.Key[] memory keys = new ExperimentalDelegation.Key[](1);
        keys[0] = ExperimentalDelegation.Key(0, ExperimentalDelegation.KeyType.P256, ECDSA.PublicKey(x, y));

        vm.expectRevert();
        delegation.keys(0);

        vm.prank(address(delegation));
        vm.resumeGasMetering();
        delegation.initialize("wallet", keys);
        vm.pauseGasMetering();

        assertEq(delegation.label(), "wallet");

        (uint256 expiry, ExperimentalDelegation.KeyType keyType, ECDSA.PublicKey memory authorizedPublicKey) =
            delegation.keys(0);
        assertEq(authorizedPublicKey.x, x);
        assertEq(authorizedPublicKey.y, y);
        assertEq(expiry, 0);
    }

    function test_authorize() public {
        vm.pauseGasMetering();

        (uint256 x, uint256 y) = vm.publicKeyP256(p256PrivateKey);

        ExperimentalDelegation.Key[] memory keys = new ExperimentalDelegation.Key[](1);
        keys[0] = ExperimentalDelegation.Key(0, ExperimentalDelegation.KeyType.P256, ECDSA.PublicKey(x, y));

        vm.expectRevert();
        delegation.keys(0);

        vm.prank(address(delegation));
        vm.resumeGasMetering();
        delegation.authorize(keys);
        vm.pauseGasMetering();

        (uint256 expiry, ExperimentalDelegation.KeyType keyType, ECDSA.PublicKey memory authorizedPublicKey) =
            delegation.keys(0);
        assertEq(authorizedPublicKey.x, x);
        assertEq(authorizedPublicKey.y, y);
        assertEq(expiry, 0);
    }

    function test_authorize_withSecp256k1Key() public {
        vm.pauseGasMetering();

        VmSafe.Wallet memory wallet = vm.createWallet("wallet");

        ExperimentalDelegation.Key[] memory keys = new ExperimentalDelegation.Key[](1);
        keys[0] = ExperimentalDelegation.Key(
            0, ExperimentalDelegation.KeyType.Secp256k1, ECDSA.PublicKey(wallet.publicKeyX, wallet.publicKeyY)
        );

        vm.expectRevert();
        delegation.keys(0);

        vm.prank(address(delegation));
        vm.resumeGasMetering();
        delegation.authorize(keys);
        vm.pauseGasMetering();

        (uint256 expiry, ExperimentalDelegation.KeyType keyType, ECDSA.PublicKey memory authorizedPublicKey) =
            delegation.keys(0);
        assertEq(authorizedPublicKey.x, wallet.publicKeyX);
        assertEq(authorizedPublicKey.y, wallet.publicKeyY);
        assertEq(expiry, 0);
    }

    function test_authorize_withAuthorizedKey() public {
        vm.pauseGasMetering();

        (uint256 x, uint256 y) = vm.publicKeyP256(p256PrivateKey);

        ExperimentalDelegation.Key[] memory keys = new ExperimentalDelegation.Key[](1);
        keys[0] = ExperimentalDelegation.Key(0, ExperimentalDelegation.KeyType.P256, ECDSA.PublicKey(x, y));

        vm.expectRevert();
        delegation.keys(0);

        vm.prank(address(delegation));
        delegation.authorize(keys);

        ExperimentalDelegation.Key[] memory nextKeys = new ExperimentalDelegation.Key[](1);
        nextKeys[0] = ExperimentalDelegation.Key(69420, ExperimentalDelegation.KeyType.P256, ECDSA.PublicKey(x, y));

        bytes32 hash = keccak256(abi.encode(delegation.nonce(), nextKeys));
        (bytes32 r, bytes32 s) = vm.signP256(p256PrivateKey, hash);

        ExperimentalDelegation.WrappedSignature memory wrappedSignature =
            ExperimentalDelegation.WrappedSignature(0, ECDSA.Signature(uint256(r), uint256(s), 0), false, "0x");

        delegation.authorize(nextKeys, abi.encode(wrappedSignature));

        (uint256 expiry, ExperimentalDelegation.KeyType keyType, ECDSA.PublicKey memory authorizedPublicKey) =
            delegation.keys(1);
        assertEq(authorizedPublicKey.x, x);
        assertEq(authorizedPublicKey.y, y);
        assertEq(expiry, 69420);
    }

    function test_authorize_revertInvalidAuthority() public {
        vm.pauseGasMetering();
        (uint256 x, uint256 y) = vm.publicKeyP256(p256PrivateKey);

        ExperimentalDelegation.Key[] memory keys = new ExperimentalDelegation.Key[](1);
        keys[0] = ExperimentalDelegation.Key(0, ExperimentalDelegation.KeyType.P256, ECDSA.PublicKey(x, y));

        vm.expectRevert();
        delegation.keys(0);

        vm.resumeGasMetering();
        vm.expectRevert(ExperimentalDelegation.InvalidAuthority.selector);
        delegation.authorize(keys);
    }

    function test_revoke() public {
        vm.pauseGasMetering();

        (uint256 x, uint256 y) = vm.publicKeyP256(p256PrivateKey);

        ExperimentalDelegation.Key[] memory keys = new ExperimentalDelegation.Key[](1);
        keys[0] = ExperimentalDelegation.Key(0, ExperimentalDelegation.KeyType.P256, ECDSA.PublicKey(x, y));

        vm.prank(address(delegation));
        delegation.authorize(keys);

        delegation.keys(0);

        vm.prank(address(delegation));
        vm.resumeGasMetering();
        delegation.revoke(0);
        vm.pauseGasMetering();

        (uint256 expiry, ExperimentalDelegation.KeyType keyType, ECDSA.PublicKey memory authorizedPublicKey) =
            delegation.keys(0);
        assertEq(expiry, 1);
    }

    function test_execute() public {
        vm.pauseGasMetering();

        assertEq(address(delegation).balance, 1.5 ether);
        assertEq(address(callee).balance, 0 ether);

        bytes memory data = abi.encodeWithSelector(Callee.increment.selector);
        bytes memory calls;
        calls = abi.encodePacked(uint8(0), address(callee), uint256(0.5 ether), data.length, data);
        calls = abi.encodePacked(calls, uint8(0), address(callee), uint256(0.5 ether), data.length, data);
        calls = abi.encodePacked(calls, uint8(0), address(callee), uint256(0.5 ether), data.length, data);

        bytes32 hash = keccak256(abi.encodePacked(delegation.nonce(), calls));
        (bytes32 r, bytes32 s) = vm.signP256(p256PrivateKey, hash);
        (uint256 x, uint256 y) = vm.publicKeyP256(p256PrivateKey);

        ExperimentalDelegation.Key[] memory keys = new ExperimentalDelegation.Key[](1);
        keys[0] = ExperimentalDelegation.Key(0, ExperimentalDelegation.KeyType.P256, ECDSA.PublicKey(x, y));

        ExperimentalDelegation.WrappedSignature memory wrappedSignature =
            ExperimentalDelegation.WrappedSignature(0, ECDSA.Signature(uint256(r), uint256(s), uint8(0)), false, "0x");

        vm.prank(address(delegation));
        delegation.authorize(keys);

        vm.resumeGasMetering();
        delegation.execute(calls, abi.encode(wrappedSignature));
        vm.pauseGasMetering();

        assertEq(callee.counter(address(delegation)), 3);
        assertEq(callee.values(address(delegation)), 1.5 ether);
        assertEq(address(delegation).balance, 0 ether);
        assertEq(address(callee).balance, 1.5 ether);
    }

    function test_execute_revertRevoke() public {
        vm.pauseGasMetering();

        bytes memory data = abi.encodeWithSelector(Callee.increment.selector);
        bytes memory calls;
        calls = abi.encodePacked(uint8(0), address(callee), uint256(0), data.length, data);
        calls = abi.encodePacked(calls, uint8(0), address(callee), uint256(0), data.length, data);
        calls = abi.encodePacked(calls, uint8(0), address(callee), uint256(0), data.length, data);

        bytes32 hash = keccak256(abi.encodePacked(delegation.nonce(), calls));
        (bytes32 r, bytes32 s) = vm.signP256(p256PrivateKey, hash);
        (uint256 x, uint256 y) = vm.publicKeyP256(p256PrivateKey);

        ExperimentalDelegation.Key[] memory keys = new ExperimentalDelegation.Key[](1);
        keys[0] = ExperimentalDelegation.Key(0, ExperimentalDelegation.KeyType.P256, ECDSA.PublicKey(x, y));

        ExperimentalDelegation.WrappedSignature memory wrappedSignature =
            ExperimentalDelegation.WrappedSignature(0, ECDSA.Signature(uint256(r), uint256(s), uint8(0)), false, "0x");

        vm.prank(address(delegation));
        delegation.authorize(keys);

        vm.prank(address(delegation));
        vm.resumeGasMetering();
        delegation.revoke(0);
        vm.pauseGasMetering();

        vm.expectRevert(ExperimentalDelegation.KeyExpiredOrUnauthorized.selector);
        delegation.execute(calls, abi.encode(wrappedSignature));
    }

    function test_execute_revertExpired() public {
        vm.pauseGasMetering();

        bytes memory data = abi.encodeWithSelector(Callee.increment.selector);
        bytes memory calls;
        calls = abi.encodePacked(uint8(0), address(callee), uint256(0), data.length, data);
        calls = abi.encodePacked(calls, uint8(0), address(callee), uint256(0), data.length, data);
        calls = abi.encodePacked(calls, uint8(0), address(callee), uint256(0), data.length, data);

        bytes32 hash = keccak256(abi.encodePacked(delegation.nonce(), calls));
        (bytes32 r, bytes32 s) = vm.signP256(p256PrivateKey, hash);
        (uint256 x, uint256 y) = vm.publicKeyP256(p256PrivateKey);

        ExperimentalDelegation.Key[] memory keys = new ExperimentalDelegation.Key[](1);
        keys[0] =
            ExperimentalDelegation.Key(block.timestamp, ExperimentalDelegation.KeyType.P256, ECDSA.PublicKey(x, y));

        ExperimentalDelegation.WrappedSignature memory wrappedSignature =
            ExperimentalDelegation.WrappedSignature(0, ECDSA.Signature(uint256(r), uint256(s), uint8(0)), false, "0x");

        vm.prank(address(delegation));
        delegation.authorize(keys);

        vm.warp(block.timestamp + 1);

        vm.expectRevert(ExperimentalDelegation.KeyExpiredOrUnauthorized.selector);
        delegation.execute(calls, abi.encode(wrappedSignature));
    }

    function test_revertReplay() public {
        vm.pauseGasMetering();

        bytes memory data = abi.encodeWithSelector(Callee.increment.selector);
        bytes memory calls;
        calls = abi.encodePacked(uint8(0), address(callee), uint256(0), data.length, data);
        calls = abi.encodePacked(calls, uint8(0), address(callee), uint256(0), data.length, data);
        calls = abi.encodePacked(calls, uint8(0), address(callee), uint256(0), data.length, data);

        bytes32 hash = keccak256(abi.encodePacked(delegation.nonce(), calls));
        (bytes32 r, bytes32 s) = vm.signP256(p256PrivateKey, hash);
        (uint256 x, uint256 y) = vm.publicKeyP256(p256PrivateKey);

        ExperimentalDelegation.Key[] memory keys = new ExperimentalDelegation.Key[](1);
        keys[0] = ExperimentalDelegation.Key(0, ExperimentalDelegation.KeyType.P256, ECDSA.PublicKey(x, y));

        ExperimentalDelegation.WrappedSignature memory wrappedSignature =
            ExperimentalDelegation.WrappedSignature(0, ECDSA.Signature(uint256(r), uint256(s), uint8(0)), false, "0x");

        vm.prank(address(delegation));
        delegation.authorize(keys);

        vm.resumeGasMetering();
        delegation.execute(calls, abi.encode(wrappedSignature));
        vm.pauseGasMetering();

        vm.expectRevert(ExperimentalDelegation.InvalidSignature.selector);
        delegation.execute(calls, abi.encode(wrappedSignature));
    }

    function test_isValidSignature_forOwner() public {
        VmSafe.Wallet memory alice = vm.createWallet("alice");
        vm.etch(alice.addr, bytes.concat(hex"ef0100", abi.encodePacked(delegation)));
        ExperimentalDelegation delegation = ExperimentalDelegation(payable(alice.addr));

        (uint256 x, uint256 y) = vm.publicKeyP256(p256PrivateKey);
        ExperimentalDelegation.Key[] memory keys = new ExperimentalDelegation.Key[](1);
        keys[0] = ExperimentalDelegation.Key(0, ExperimentalDelegation.KeyType.P256, ECDSA.PublicKey(x, y));

        vm.prank(alice.addr);
        delegation.authorize(keys);

        bytes32 hash = keccak256(abi.encodePacked(delegation.nonce(), keccak256("0xdeadbeef")));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(alice, hash);

        bytes memory signature = abi.encodePacked(uint256(r), uint256(s), uint8(v == 27 ? 0 : 1));

        assertEq(delegation.isValidSignature(hash, signature), bytes4(keccak256("isValidSignature(bytes32,bytes)")));
    }

    function test_isValidSignature_forAuthorizingP256Key() public {
        bytes32 hash = keccak256(abi.encodePacked(delegation.nonce(), keccak256("0xdeadbeef")));
        (uint256 x, uint256 y) = vm.publicKeyP256(p256PrivateKey);

        ExperimentalDelegation.Key[] memory keys = new ExperimentalDelegation.Key[](1);
        keys[0] = ExperimentalDelegation.Key(0, ExperimentalDelegation.KeyType.P256, ECDSA.PublicKey(x, y));

        vm.prank(address(delegation));
        delegation.authorize(keys);

        (bytes32 r, bytes32 s) = vm.signP256(p256PrivateKey, hash);
        ExperimentalDelegation.WrappedSignature memory wrappedSignature =
            ExperimentalDelegation.WrappedSignature(0, ECDSA.Signature(uint256(r), uint256(s), uint8(0)), false, "0x");

        assertEq(
            delegation.isValidSignature(hash, abi.encode(wrappedSignature)),
            bytes4(keccak256("isValidSignature(bytes32,bytes)"))
        );
    }

    function test_isValidSignature_forAuthorizingSecp256k1Key() public {
        bytes32 hash = keccak256(abi.encodePacked(delegation.nonce(), keccak256("0xdeadbeef")));
        VmSafe.Wallet memory wallet = vm.createWallet("wallet");

        ExperimentalDelegation.Key[] memory keys = new ExperimentalDelegation.Key[](1);
        keys[0] = ExperimentalDelegation.Key(
            0, ExperimentalDelegation.KeyType.Secp256k1, ECDSA.PublicKey(wallet.publicKeyX, wallet.publicKeyY)
        );

        vm.prank(address(delegation));
        delegation.authorize(keys);

        (uint8 v, bytes32 r, bytes32 s) = vm.sign(wallet.privateKey, hash);
        ExperimentalDelegation.WrappedSignature memory wrappedSignature = ExperimentalDelegation.WrappedSignature(
            0, ECDSA.Signature(uint256(r), uint256(s), v == 27 ? 0 : 1), false, "0x"
        );

        assertEq(
            delegation.isValidSignature(hash, abi.encode(wrappedSignature)),
            bytes4(keccak256("isValidSignature(bytes32,bytes)"))
        );
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Test, console2} from "forge-std/Test.sol";
import {stdJson} from "forge-std/StdJson.sol";
import {VmSafe} from "forge-std/Vm.sol";
import {ExperimentERC20} from "../src/ExperimentERC20.sol";

contract ExperimentERC20Test is Test {
    ExperimentERC20 public erc;
    ExperimentERC20 public erc2;
    VmSafe.Wallet public wallet;
    VmSafe.Wallet public nonOwnerWallet;

    function setUp() public {
        wallet = vm.createWallet("wallet");
        nonOwnerWallet = vm.createWallet("nonOwner");
        erc = new ExperimentERC20("Test", "TEST", 0.01 ether);
        erc2 = new ExperimentERC20("Test2", "TEST2", 100 ether);
        vm.deal(address(erc), 100 ether);
        vm.deal(address(erc2), 100 ether);
    }

    function test_mint() public {
        vm.startBroadcast(address(wallet.addr));

        erc.mint(address(wallet.addr), 100 ether);
        assertEq(erc.balanceOf(address(wallet.addr)), 100 ether);

        vm.stopBroadcast();
    }

    function test_transfer(address to) public {
        vm.assume(to != address(wallet.addr)); // Don't transfer to ourselves

        vm.startBroadcast(address(wallet.addr));

        erc.mint(address(wallet.addr), 100 ether);
        erc.transfer(address(to), 50 ether);
        assertEq(erc.balanceOf(address(wallet.addr)), 50 ether);
        assertEq(erc.balanceOf(address(to)), 50 ether);

        vm.stopBroadcast();
    }

    function test_swap() public {
        vm.startBroadcast(address(wallet.addr));

        erc.mint(address(wallet.addr), 100 ether);
        erc.swap(address(erc2), address(wallet.addr), 10 ether);
        assertEq(erc.balanceOf(address(wallet.addr)), 90 ether);
        assertEq(erc2.balanceOf(address(wallet.addr)), 0.1 ether);

        erc2.swap(address(erc), address(wallet.addr), 0.1 ether);
        assertEq(erc.balanceOf(address(wallet.addr)), 100 ether);
        assertEq(erc2.balanceOf(address(wallet.addr)), 0 ether);

        vm.stopBroadcast();
    }

    function test_mintCap() public {
        // Test default cap allows large amounts
        uint256 largeAmount = type(uint128).max - 1;
        erc.mint(address(wallet.addr), largeAmount);
        assertEq(erc.balanceOf(address(wallet.addr)), largeAmount);

        // Test default cap limit
        vm.expectRevert("Mint cap exceeded");
        erc.mint(address(wallet.addr), type(uint128).max);

        // Test non-owner cannot set cap
        vm.expectRevert("Unauthorized()");
        vm.prank(nonOwnerWallet.addr);
        erc.setMintCap(1000 ether);

        // Owner sets new cap
        uint256 mintCap = 1000 ether;
        erc.setMintCap(mintCap);

        // Test minting within cap works
        erc.mint(address(wallet.addr), 500 ether);
        erc.mint(address(wallet.addr), mintCap - 1); // Just under cap

        // Test minting at cap fails
        vm.expectRevert("Mint cap exceeded");
        erc.mint(address(wallet.addr), mintCap);

        // Test minting above cap fails
        vm.expectRevert("Mint cap exceeded");
        erc.mint(address(wallet.addr), mintCap + 1);

        // Test cap can be decreased
        erc.setMintCap(100 ether);
        vm.expectRevert("Mint cap exceeded");
        erc.mint(address(wallet.addr), 150 ether);

        // Test zero cap edge case
        erc.setMintCap(0);
        vm.expectRevert("Mint cap exceeded");
        erc.mint(address(wallet.addr), 1);
    }
}

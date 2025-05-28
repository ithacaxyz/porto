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

    function setUp() public {
        wallet = vm.createWallet("wallet");
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
}

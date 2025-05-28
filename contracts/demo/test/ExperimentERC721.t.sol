// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Test, console2} from "forge-std/Test.sol";
import {stdJson} from "forge-std/StdJson.sol";
import {VmSafe} from "forge-std/Vm.sol";

import {ExperimentERC20} from "../src/ExperimentERC20.sol";
import {ExperimentERC721} from "../src/ExperimentERC721.sol";

contract ExperimentERC721Test is Test {
    ExperimentERC20 public token;
    ExperimentERC721 public nft;

    function setUp() public {
        token = new ExperimentERC20("EXP", "EXP", 0);
        nft = new ExperimentERC721(
            "GEN",
            "Ithaca Genesis",
            "This is a description.",
            "https://example.com/image.png",
            address(token),
            1000
        );
    }

    function test_mint() public {
        token.mint(address(this), 3000);
        nft.mint();
        assertEq(nft.balanceOf(address(this)), 1);
        assertEq(nft.ownerOf(0), address(this));
        assertEq(
            nft.tokenURI(0),
            "data:application/json;base64,eyJuYW1lIjogIkl0aGFjYSBHZW5lc2lzICMwIiwgImRlc2NyaXB0aW9uIjogIlRoaXMgaXMgYSBkZXNjcmlwdGlvbi4iLCAiaW1hZ2UiOiAiaHR0cHM6Ly9leGFtcGxlLmNvbS9pbWFnZS5wbmcifQ=="
        );

        nft.mint();
        assertEq(nft.balanceOf(address(this)), 2);
        assertEq(nft.ownerOf(1), address(this));
        assertEq(
            nft.tokenURI(1),
            "data:application/json;base64,eyJuYW1lIjogIkl0aGFjYSBHZW5lc2lzICMxIiwgImRlc2NyaXB0aW9uIjogIlRoaXMgaXMgYSBkZXNjcmlwdGlvbi4iLCAiaW1hZ2UiOiAiaHR0cHM6Ly9leGFtcGxlLmNvbS9pbWFnZS5wbmcifQ=="
        );

        nft.mint(address(69));
        assertEq(nft.balanceOf(address(69)), 1);
        assertEq(nft.ownerOf(2), address(69));
    }
}

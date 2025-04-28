// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {console2} from "forge-std/console2.sol";
import {ERC721} from "solady/tokens/ERC721.sol";
import {Ownable} from "solady/auth/Ownable.sol";
import {LibString} from "solady/utils/LibString.sol";

contract ExperimentERC721 is ERC721, Ownable {
    string internal _name;
    string internal _symbol;
    string internal _baseURI;

    constructor(string memory name_, string memory symbol_, string memory baseURI) {
        _name = name_;
        _symbol = symbol_;
        _baseURI = baseURI;
        _initializeOwner(msg.sender);
    }

    function name() public view virtual override returns (string memory) {
        return _name;
    }

    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    function tokenURI(uint256 id) public view virtual override returns (string memory) {
        return string(abi.encodePacked(_baseURI, LibString.toString(id)));
    }

    function mint(address recipient, uint256 id) public virtual {
        _mint(recipient, id);
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseURI = baseURI;
    }
}

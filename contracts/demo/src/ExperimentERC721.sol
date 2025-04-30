// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {ERC721} from "solady/tokens/ERC721.sol";
import {Ownable} from "solady/auth/Ownable.sol";
import {Base64} from "solady/utils/Base64.sol";
import {LibString} from "solady/utils/LibString.sol";

contract ExperimentERC721 is ERC721, Ownable {
    uint256 internal _tokenId;
    string internal _description;
    string internal _name;
    string internal _symbol;
    string internal _image;

    constructor(string memory symbol_, string memory name_, string memory description, string memory image) {
        _description = description;
        _image = image;
        _name = name_;
        _symbol = symbol_;
        _tokenId = 0;
        _initializeOwner(msg.sender);
    }

    function name() public view virtual override returns (string memory) {
        return _name;
    }

    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    function tokenURI(uint256 id) public view virtual override returns (string memory) {
        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                _name,
                " #",
                LibString.toString(id),
                '", "description": "',
                _description,
                '", "image": "',
                _image,
                '"}'
            )
        );
        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function mint() public {
        mint(msg.sender);
    }

    function mint(address recipient) public {
        _mint(recipient, _tokenId);
        _tokenId++;
    }

    function setImage(string memory image) public onlyOwner {
        _image = image;
    }
}

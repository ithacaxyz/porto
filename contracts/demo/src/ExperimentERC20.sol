// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.13;

import {ERC20} from "solady/tokens/ERC20.sol";

contract ExperimentERC20 is ERC20 {
    string internal _name;
    string internal _symbol;
    uint256 internal _scalar;

    constructor(string memory name_, string memory symbol_, uint256 scalar_) {
        _name = name_;
        _symbol = symbol_;
        _scalar = scalar_;
    }

    function name() public view virtual override returns (string memory) {
        return _name;
    }

    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function mint(address recipient, uint256 value) public virtual {
        _mint(recipient, value);
    }

    function swap(address target, address recipient, uint256 amount) public virtual {
        _burn(msg.sender, amount);
        ExperimentERC20(payable(target)).mint(recipient, (amount * _scalar) / 1 ether);
    }

    function transfer(address to, uint256 amount) public virtual override returns (bool) {
        return super.transfer(to, amount);
    }

    fallback() external payable {}
    receive() external payable {}
}

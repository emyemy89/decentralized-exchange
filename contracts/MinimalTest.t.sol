// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DEX.sol";
import "./AssetToken.sol";

contract MinimalTest {
    function testMinimalDepositAndBalance() public {
        // deploy
        DEX dex = new DEX();
        AssetToken tokenB = new AssetToken("Token B", "TKB", 1_000_000 ether);
        
        // deposit
        uint256 depositAmount = 5_000 ether;
        tokenB.approve(address(dex), depositAmount);
        dex.deposit(address(tokenB), depositAmount);
        
        // check balance directly
        uint256 balance = dex.balances(address(tokenB), address(this));
        require(balance == depositAmount, "Balance mismatch");
        
        //create a small buy order that should work
        AssetToken tokenA = new AssetToken("Token A", "TKA", 1_000_000 ether);
        tokenA.approve(address(dex), depositAmount);
        dex.deposit(address(tokenA), depositAmount);
        
        // this should work: 
        dex.createBuyOrder(address(tokenA), address(tokenB), 1 ether, 1 ether);
    }
}

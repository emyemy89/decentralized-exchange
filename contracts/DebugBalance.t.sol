// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DEX.sol";
import "./AssetToken.sol";

contract DebugBalanceTest {
    event DebugBalance(string label, uint256 value);
    event DebugAddress(string label, address value);
    
    function testDebugBalanceCheck() public {
        // Deploy contracts
        DEX dex = new DEX();
        AssetToken tokenB = new AssetToken("Token B", "TKB", 1_000_000 ether);
        
        emit DebugAddress("Test contract address", address(this));
        emit DebugAddress("TokenB address", address(tokenB));
        emit DebugAddress("DEX address", address(dex));
        
        // Deposit tokens
        uint256 depositAmount = 5_000 ether;
        tokenB.approve(address(dex), depositAmount);
        
        emit DebugBalance("TokenB balance before deposit", tokenB.balanceOf(address(this)));
        
        dex.deposit(address(tokenB), depositAmount);
        
        emit DebugBalance("TokenB balance after deposit", tokenB.balanceOf(address(this)));
        emit DebugBalance("DEX internal balance", dex.balances(address(tokenB), address(this)));
        
        // Check balance directly
        uint256 balance = dex.balances(address(tokenB), address(this));
        require(balance == depositAmount, "Balance should be 5000 ether");
        
        // Check required amount
        uint256 requiredAmount = 1 ether * 1 ether;
        emit DebugBalance("Required amount", requiredAmount);
        emit DebugBalance("Available balance", balance);
        
        require(balance >= requiredAmount, "Balance should be sufficient");
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DEX.sol";
import "./AssetToken.sol";

contract DEXFixedTest {
    function testOrderCreationFixed() public {
        // Deploy contracts
        DEX dex = new DEX();
        AssetToken tokenA = new AssetToken("Token A", "TKA", 1_000_000 ether);
        AssetToken tokenB = new AssetToken("Token B", "TKB", 1_000_000 ether);
        
        // Deposit tokens
        uint256 depositAmount = 5_000 ether;
        tokenA.approve(address(dex), depositAmount);
        tokenB.approve(address(dex), depositAmount);
        dex.deposit(address(tokenA), depositAmount);
        dex.deposit(address(tokenB), depositAmount);
        
        // Verify deposits
        require(dex.balances(address(tokenA), address(this)) == depositAmount, "TokenA deposit failed");
        require(dex.balances(address(tokenB), address(this)) == depositAmount, "TokenB deposit failed");
        
        // Debug: Check balance before order creation
        uint256 balanceBefore = dex.balances(address(tokenB), address(this));
        require(balanceBefore == depositAmount, "Balance check failed");
        
        // Create buy order: 100 TokenA at 2 TokenB per TokenA (requires 200 TokenB)
        dex.createBuyOrder(address(tokenA), address(tokenB), 100 ether, 2 ether);
        
        // Verify order was created and balance was deducted
        require(dex.balances(address(tokenB), address(this)) == 4_800 ether, "TokenB balance not deducted correctly");
        
        // Check order book
        (uint256 id, address trader, bool isBuyOrder, address buyToken, address sellToken, uint256 amount, uint256 price, bool isFilled) = dex.orderBook(address(tokenA), 0);
        require(trader == address(this), "Order trader incorrect");
        require(isBuyOrder == true, "Order type incorrect");
        require(buyToken == address(tokenA), "Buy token incorrect");
        require(sellToken == address(tokenB), "Sell token incorrect");
        require(amount == 100 ether, "Order amount incorrect");
        require(price == 2 ether, "Order price incorrect");
        require(isFilled == false, "Order should not be filled");
    }
    
    function testSellOrderCreation() public {
        // Deploy contracts
        DEX dex = new DEX();
        AssetToken tokenA = new AssetToken("Token A", "TKA", 1_000_000 ether);
        AssetToken tokenB = new AssetToken("Token B", "TKB", 1_000_000 ether);
        
        // Deposit tokens
        uint256 depositAmount = 5_000 ether;
        tokenA.approve(address(dex), depositAmount);
        tokenB.approve(address(dex), depositAmount);
        dex.deposit(address(tokenA), depositAmount);
        dex.deposit(address(tokenB), depositAmount);
        
        // Create sell order: 50 TokenA at 3 TokenB per TokenA
        dex.createSellOrder(address(tokenA), address(tokenB), 50 ether, 3 ether);
        
        // Verify order was created and balance was deducted
        require(dex.balances(address(tokenA), address(this)) == 4_950 ether, "TokenA balance not deducted correctly");
        
        // Check order book
        (uint256 id, address trader, bool isBuyOrder, address buyToken, address sellToken, uint256 amount, uint256 price, bool isFilled) = dex.orderBook(address(tokenA), 0);
        require(trader == address(this), "Order trader incorrect");
        require(isBuyOrder == false, "Order type incorrect");
        require(buyToken == address(tokenB), "Buy token incorrect");
        require(sellToken == address(tokenA), "Sell token incorrect");
        require(amount == 50 ether, "Order amount incorrect");
        require(price == 3 ether, "Order price incorrect");
        require(isFilled == false, "Order should not be filled");
    }
}

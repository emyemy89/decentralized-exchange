// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AssetToken.sol";

contract MintCaller {
    function tryMint(address tokenAddr, address to, uint256 amount) external returns (bool) {
        AssetToken token = AssetToken(tokenAddr);
        try token.mint(to, amount) {
            return true;
        } catch {
            return false;
        }
    }
}

contract AssetTokenTest {
    function testDeploymentAndInitialSupply() public {
        uint256 initialSupply = 1_000_000 ether;
        AssetToken token = new AssetToken("Asset Token", "AST", initialSupply);

        require(token.totalSupply() == initialSupply, "total supply mismatch");
        require(token.balanceOf(address(this)) == initialSupply, "deployer balance mismatch");
        require(
            keccak256(bytes(token.name())) == keccak256(bytes("Asset Token")),
            "name mismatch"
        );
        require(
            keccak256(bytes(token.symbol())) == keccak256(bytes("AST")),
            "symbol mismatch"
        );
    }

    function testTransfersUpdateBalances() public {
        uint256 initialSupply = 10_000 ether;
        AssetToken token = new AssetToken("Asset Token", "AST", initialSupply);

        address user1 = address(0x1111);
        address user2 = address(0x2222);

        uint256 amount = 1_000 ether;
        bool ok = token.transfer(user1, amount);
        require(ok, "transfer to user1 failed");
        require(token.balanceOf(user1) == amount, "user1 balance incorrect");
        require(token.balanceOf(address(this)) == initialSupply - amount, "deployer balance incorrect");

        ok = AssetToken(token).transferFrom(user1, user2, 0);

        uint256 amount2 = amount;
        ok = token.transfer(user2, amount2);
        require(ok, "transfer to user2 failed");
        require(token.balanceOf(user2) == amount2, "user2 balance incorrect");
    }

    function testMintOwnerAndNonOwner() public {
        uint256 initialSupply = 1_000 ether;
        AssetToken token = new AssetToken("Asset Token", "AST", initialSupply);

        // owner can mint
        uint256 mintAmount = 123 ether;
        token.mint(address(0xBEEF), mintAmount);
        require(token.totalSupply() == initialSupply + mintAmount, "supply not increased");
        require(token.balanceOf(address(0xBEEF)) == mintAmount, "recipient not minted");

        // non-owner cannot mint
        MintCaller caller = new MintCaller();
        bool success = caller.tryMint(address(token), address(0xCAFE), 1 ether);
        require(success == false, "non-owner mint should revert");
    }
}



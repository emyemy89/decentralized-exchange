const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying contracts...");

  // Deploy AssetToken A
  const AssetToken = await ethers.getContractFactory("AssetToken");
  const tokenA = await AssetToken.deploy("Token A", "TKA", ethers.parseEther("1000000"));
  await tokenA.waitForDeployment();
  const tokenAAddress = await tokenA.getAddress();
  console.log("Token A deployed to:", tokenAAddress);

  // Deploy AssetToken B
  const tokenB = await AssetToken.deploy("Token B", "TKB", ethers.parseEther("1000000"));
  await tokenB.waitForDeployment();
  const tokenBAddress = await tokenB.getAddress();
  console.log("Token B deployed to:", tokenBAddress);

  // Deploy DEX
  const DEX = await ethers.getContractFactory("DEX");
  const dex = await DEX.deploy();
  await dex.waitForDeployment();
  const dexAddress = await dex.getAddress();
  console.log("DEX deployed to:", dexAddress);

  // Transfer some tokens to the deployer for testing
  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);

  // Transfer tokens to deployer
  await tokenA.transfer(deployer.address, ethers.parseEther("10000"));
  await tokenB.transfer(deployer.address, ethers.parseEther("10000"));

  console.log("\n=== Deployment Summary ===");
  console.log("Token A (TKA):", tokenAAddress);
  console.log("Token B (TKB):", tokenBAddress);
  console.log("DEX Contract:", dexAddress);
  console.log("Deployer:", deployer.address);
  
  console.log("\n=== Update Frontend Config ===");
  console.log("Update frontend/src/utils/contractConfig.js with:");
  console.log(`DEX_CONTRACT_ADDRESS = "${dexAddress}";`);
  console.log("\nUpdate frontend/src/App.jsx with:");
  console.log(`setTokenAAddress('${tokenAAddress}');`);
  console.log(`setTokenBAddress('${tokenBAddress}');`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
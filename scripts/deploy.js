import { ethers } from "ethers";
import { artifacts } from "hardhat";

async function main() {
  console.log("Deploying contracts...");

  // Get the provider and signer
  const provider = new ethers.JsonRpcProvider("http://localhost:8545");
  const signer = await provider.getSigner();
  console.log("Deployer address:", await signer.getAddress());

  // Get contract artifacts
  const AssetTokenArtifact = await artifacts.readArtifact("AssetToken");
  const DEXArtifact = await artifacts.readArtifact("DEX");

  // Deploy AssetToken A
  const AssetTokenFactory = new ethers.ContractFactory(
    AssetTokenArtifact.abi,
    AssetTokenArtifact.bytecode,
    signer
  );
  const tokenA = await AssetTokenFactory.deploy("Token A", "TKA", ethers.parseEther("1000000"));
  await tokenA.waitForDeployment();
  const tokenAAddress = await tokenA.getAddress();
  console.log("Token A deployed to:", tokenAAddress);

  // Deploy AssetToken B
  const tokenB = await AssetTokenFactory.deploy("Token B", "TKB", ethers.parseEther("1000000"));
  await tokenB.waitForDeployment();
  const tokenBAddress = await tokenB.getAddress();
  console.log("Token B deployed to:", tokenBAddress);

  // Deploy DEX
  const DEXFactory = new ethers.ContractFactory(
    DEXArtifact.abi,
    DEXArtifact.bytecode,
    signer
  );
  const dex = await DEXFactory.deploy();
  await dex.waitForDeployment();
  const dexAddress = await dex.getAddress();
  console.log("DEX deployed to:", dexAddress);

  // Transfer some tokens to the deployer for testing
  await tokenA.transfer(await signer.getAddress(), ethers.parseEther("10000"));
  await tokenB.transfer(await signer.getAddress(), ethers.parseEther("10000"));

  console.log("\n=== Deployment Summary ===");
  console.log("Token A (TKA):", tokenAAddress);
  console.log("Token B (TKB):", tokenBAddress);
  console.log("DEX Contract:", dexAddress);
  console.log("Deployer:", await signer.getAddress());
  
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
import { ethers } from "ethers";
import { artifacts } from "hardhat";

async function main() {
  console.log("Deploying contracts...");

  //provider and signer
  const provider = new ethers.JsonRpcProvider("http://localhost:8545");
  const signer = await provider.getSigner();
  console.log("Deployer address:", await signer.getAddress());

  //contract artifacts
  const AssetTokenArtifact = await artifacts.readArtifact("AssetToken");
  const DEXArtifact = await artifacts.readArtifact("DEX");

  // deploy AssetToken A
  const AssetTokenFactory = new ethers.ContractFactory(
    AssetTokenArtifact.abi,
    AssetTokenArtifact.bytecode,
    signer
  );
  const tokenA = await AssetTokenFactory.deploy("Token A", "TKA", ethers.parseEther("1000000"));
  await tokenA.waitForDeployment();
  const tokenAAddress = await tokenA.getAddress();
  console.log("Token A deployed to:", tokenAAddress);

  // same for B
  const tokenB = await AssetTokenFactory.deploy("Token B", "TKB", ethers.parseEther("1000000"));
  await tokenB.waitForDeployment();
  const tokenBAddress = await tokenB.getAddress();
  console.log("Token B deployed to:", tokenBAddress);

  // deploy dex
  const DEXFactory = new ethers.ContractFactory(
    DEXArtifact.abi,
    DEXArtifact.bytecode,
    signer
  );
  const dex = await DEXFactory.deploy();
  await dex.waitForDeployment();
  const dexAddress = await dex.getAddress();
  console.log("DEX deployed to:", dexAddress);

  // transfer some tokens to the deployer for testing
  await tokenA.transfer(await signer.getAddress(), ethers.parseEther("10000"));
  await tokenB.transfer(await signer.getAddress(), ethers.parseEther("10000"));


    // fund account 13 with token A and approve dex
  const acct13 = await provider.getSigner(2);
  await tokenA.transfer(await acct13.getAddress(), ethers.parseEther("1000")); // or: await tokenA.mint(...)

  await tokenA.connect(acct13).approve(dexAddress, ethers.parseEther("500"));

  // sanity deposit, I think we should remove this line
  await dex.connect(acct13).deposit(tokenAAddress, ethers.parseEther("10"));

  // option A: transfer from deployer;deployer owns initialSupply
  await tokenB.transfer(await acct13.getAddress(), ethers.parseEther("1000"));

  // B: mint directly; deployer is owner in AssetToken
  // await tokenB.mint(await acct13.getAddress(), ethers.parseEther("1000"));

  await tokenB.connect(acct13).approve(dexAddress, ethers.parseEther("500"));

  //deposit some Token B into the DEX for buy orders
  await dex.connect(acct13).deposit(tokenBAddress, ethers.parseEther("200"));


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
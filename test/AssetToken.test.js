const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AssetToken", function () {
  const NAME = "Asset Token";
  const SYMBOL = "AST";
  const INITIAL_SUPPLY = ethers.parseUnits("1000000", 18); // 1,000,000 AST

  let deployer;
  let user1;
  let user2;
  let token;

  beforeEach(async function () {
    [deployer, user1, user2] = await ethers.getSigners();

    const AssetToken = await ethers.getContractFactory("AssetToken");
    token = await AssetToken.deploy(NAME, SYMBOL, INITIAL_SUPPLY);
    await token.waitForDeployment();
  });

  describe("Deployment", function () {
    it("mints the initial supply to the deployer", async function () {
      const totalSupply = await token.totalSupply();
      const deployerBalance = await token.balanceOf(deployer.address);
      expect(totalSupply).to.equal(INITIAL_SUPPLY);
      expect(deployerBalance).to.equal(INITIAL_SUPPLY);
    });

    it("sets correct name and symbol", async function () {
      expect(await token.name()).to.equal(NAME);
      expect(await token.symbol()).to.equal(SYMBOL);
    });
  });

  describe("Transfers", function () {
    it("transfers tokens between accounts and updates balances", async function () {
      const amount = ethers.parseUnits("1000", 18);

      await token.transfer(user1.address, amount);

      expect(await token.balanceOf(user1.address)).to.equal(amount);
      expect(await token.balanceOf(deployer.address)).to.equal(
        INITIAL_SUPPLY - amount
      );

      await token.connect(user1).transfer(user2.address, amount);
      expect(await token.balanceOf(user2.address)).to.equal(amount);
      expect(await token.balanceOf(user1.address)).to.equal(0n);
    });
  });

  describe("Minting", function () {
    it("only owner can mint", async function () {
      const amount = ethers.parseUnits("5000", 18);

      await expect(token.connect(user1).mint(user1.address, amount))
        .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount");

      await expect(token.mint(user1.address, amount))
        .to.emit(token, "Transfer")
        .withArgs(ethers.ZeroAddress, user1.address, amount);
    });

    it("minting increases total supply and recipient balance", async function () {
      const amount = ethers.parseUnits("12345", 18);
      const prevSupply = await token.totalSupply();
      const prevBal = await token.balanceOf(user2.address);

      await token.mint(user2.address, amount);

      expect(await token.totalSupply()).to.equal(prevSupply + amount);
      expect(await token.balanceOf(user2.address)).to.equal(prevBal + amount);
    });
  });
});

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AssetToken", function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const name = "Asset Token";
    const symbol = "AST";
    const initialSupply = ethers.parseUnits("1000000", 18n);

    const AssetToken = await ethers.getContractFactory("AssetToken");
    const token = await AssetToken.deploy(name, symbol, initialSupply);
    await token.waitForDeployment();

    return { token, owner, addr1, addr2, name, symbol, initialSupply };
  }

  describe("Deployment", function () {
    it("mints the initial supply to the deployer", async function () {
      const { token, owner, initialSupply } = await deployTokenFixture();
      const ownerBalance = await token.balanceOf(owner.address);
      expect(ownerBalance).to.equal(initialSupply);
      const totalSupply = await token.totalSupply();
      expect(totalSupply).to.equal(initialSupply);
    });

    it("sets the correct name and symbol", async function () {
      const { token, name, symbol } = await deployTokenFixture();
      expect(await token.name()).to.equal(name);
      expect(await token.symbol()).to.equal(symbol);
    });
  });

  describe("Transfers", function () {
    it("transfers tokens between accounts and updates balances", async function () {
      const { token, owner, addr1, addr2 } = await deployTokenFixture();

      const amountToAddr1 = ethers.parseUnits("1000", 18n);
      await token.transfer(addr1.address, amountToAddr1);
      expect(await token.balanceOf(addr1.address)).to.equal(amountToAddr1);

      const amountToAddr2 = ethers.parseUnits("250", 18n);
      await token.connect(addr1).transfer(addr2.address, amountToAddr2);
      expect(await token.balanceOf(addr2.address)).to.equal(amountToAddr2);

      const remainingAddr1 = amountToAddr1 - amountToAddr2;
      expect(await token.balanceOf(addr1.address)).to.equal(remainingAddr1);
    });
  });

  describe("Minting", function () {
    it("only owner can mint and it increases total supply and recipient balance", async function () {
      const { token, owner, addr1 } = await deployTokenFixture();
      const mintAmount = ethers.parseUnits("5000", 18n);

      const totalBefore = await token.totalSupply();
      const balanceBefore = await token.balanceOf(addr1.address);

      await token.mint(addr1.address, mintAmount);

      const totalAfter = await token.totalSupply();
      const balanceAfter = await token.balanceOf(addr1.address);

      expect(totalAfter).to.equal(totalBefore + mintAmount);
      expect(balanceAfter).to.equal(balanceBefore + mintAmount);
    });

    it("reverts when non-owner attempts to mint", async function () {
      const { token, addr1, addr2 } = await deployTokenFixture();
      const mintAmount = ethers.parseUnits("1", 18n);

      let reverted = false;
      try {
        await token.connect(addr1).mint(addr2.address, mintAmount);
      } catch (err) {
        reverted = true;
        // OpenZeppelin Ownable (v5) uses custom error OwnableUnauthorizedAccount(address)
        expect(String(err.message || err)).to.include("OwnableUnauthorizedAccount");
      }
      expect(reverted).to.equal(true);
    });
  });
});



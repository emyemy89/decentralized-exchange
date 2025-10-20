require("dotenv").config();
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox-mocha-ethers");

const { SEPOLIA_URL, PRIVATE_KEY } = process.env;
const networks = {};
if (SEPOLIA_URL) {
  networks.sepolia = {
    type: "http",
    url: SEPOLIA_URL,
    accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
  };
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks,
};



require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const QUICKNODE_RPC_URL = process.env.QUICKNODE_RPC_URL;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.10",
      },
      {
        version: "0.8.20",
        settings: {},
      },
    ],
    // overrides: {
    //   "@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol":
    //     {
    //       version: "0.8.20",
    //       settings: {},
    //     },
    // },
  },
  networks: {
    hardhat: {
      forking: {
        url: QUICKNODE_RPC_URL,
      },
    },
  },
};

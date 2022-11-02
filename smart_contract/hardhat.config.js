require("@nomiclabs/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    ropsten: {
      url: 'https://eth-goerli.g.alchemy.com/v2/Y9MRtDoJ9z8lVdf5FVoniIgM8pGEEGqP',
      accounts: ['77e667c1fef90aa2e6900fad496f06e3938ae59b32b27bc73e984b5d3d192bd1']
    }
  }
};

// https://eth-goerli.g.alchemy.com/v2/Y9MRtDoJ9z8lVdf5FVoniIgM8pGEEGqP
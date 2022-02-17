const HDWalletProvider = require("@truffle/hdwallet-provider");
const keys = require("./keys.json");

module.exports = {
  contracts_build_directory: "./public/contracts",
  networks: {
    development: {
     host: "127.0.0.1",
     port: 8545, 
     network_id: "*",
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider({
          mnemonic: {
            phrase: keys.MNEMONIC,
          },
          providerOrUrl: `https://ropsten.infura.io/v3/${keys.INFURA_PROJECT_ID}`,
          addressIndex: 0,
        }),
      network_id: 3,
      gas: 5500000,  // Gas limit, how much gas we are willing to spent
      gasPrice: 20000000000, // Gas price, how much we are willing to pay for unit of gas
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
    }
  },

  mocha: {
    // timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.8.4",
    }
  },
};


// transaction hash:    0x93817166e471f342f4d774bf2c28796eaf403945325b3b8a0429c897b9837257
// contract address:    0xAD5E22bddD7d7Df1eDFFcB97105035E5BDECA946

// NEXT_PUBLIC_TARGET_CHAIN_ID=1337
// NEXT_PUBLIC_NETWORK_ID=5777

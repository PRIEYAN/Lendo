/**
 * Contract addresses on CreditCoin Testnet
 * Update these after deploying contracts
 */

export const CONTRACT_ADDRESSES = {
  creditRegistry: "0x0000000000000000000000000000000000000000", // Update after deployment
  reservePool: "0x0000000000000000000000000000000000000000", // Update after deployment
  factory: "0x0000000000000000000000000000000000000000", // Update after deployment
} as const;

export const CREDITCOIN_CHAIN = {
  id: 102031,
  name: "Creditcoin Testnet",
  network: "creditcoin-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "CreditCoin",
    symbol: "tCTC",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.cc3-testnet.creditcoin.network"],
    },
    public: {
      http: ["https://rpc.cc3-testnet.creditcoin.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "CreditCoin Explorer",
      url: "https://creditcoin-testnet.blockscout.com",
    },
  },
} as const;

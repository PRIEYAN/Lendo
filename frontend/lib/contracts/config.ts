/**
 * Contract addresses and configuration
 * Update these with your deployed contract addresses
 */

// CreditCoin Testnet network configuration
export const CREDITCOIN_CHAIN = {
  id: 102031, // CreditCoin Testnet Chain ID
  name: "Creditcoin Testnet",
  network: "creditcoin-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "CreditCoin",
    symbol: "tCTC", // Testnet currency symbol
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
      name: "CreditCoin Testnet Explorer",
      url: "https://creditcoin-testnet.blockscout.com",
    },
  },
} as const;

// Contract addresses - UPDATE THESE WITH YOUR DEPLOYED ADDRESSES
export const CONTRACT_ADDRESSES = {
  creditRegistry: "0x0000000000000000000000000000000000000000", // UPDATE
  reservePool: "0x0000000000000000000000000000000000000000", // UPDATE
  factory: "0x0000000000000000000000000000000000000000", // UPDATE
} as const;

// Contract ABIs will be imported from separate files
export const VOTING_PERIOD_DAYS = 7;
export const BASE_CREDIT_SCORE = 300;
export const MAX_CREDIT_SCORE = 1000;

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
  creditRegistry: "0x7dc508ac5ee4c9d864c0f1a1514efadd8295f76d",
  reservePool: "0xfb2043fcf329d61056d3b1fabf61825da9d1288a",
  factory: "0x49e509f39b110820f221957c003e7ce793f10ef4",
} as const;

// Contract ABIs will be imported from separate files
export const VOTING_PERIOD_DAYS = 7;
export const BASE_CREDIT_SCORE = 300;
export const MAX_CREDIT_SCORE = 1000;

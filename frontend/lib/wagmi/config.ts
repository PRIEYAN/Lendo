import { createConfig, http } from "wagmi";
import { createPublicClient } from "viem";
import { walletConnect, metaMask, injected } from "wagmi/connectors";
import { CREDITCOIN_CHAIN } from "../contracts/config";
import { defineChain } from "viem";

// WalletConnect Project ID - Get from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

// Define CreditCoin Testnet chain for wagmi/viem
const creditcoinTestnet = defineChain({
  id: CREDITCOIN_CHAIN.id,
  name: CREDITCOIN_CHAIN.name,
  nativeCurrency: CREDITCOIN_CHAIN.nativeCurrency,
  rpcUrls: {
    default: {
      http: CREDITCOIN_CHAIN.rpcUrls.default.http,
    },
  },
  blockExplorers: {
    default: {
      name: CREDITCOIN_CHAIN.blockExplorers.default.name,
      url: CREDITCOIN_CHAIN.blockExplorers.default.url,
    },
  },
});

export const wagmiConfig = createConfig({
  chains: [creditcoinTestnet],
  connectors: [
    metaMask({
      dappMetadata: {
        name: "CreditCoin Lending Circles",
      },
    }),
    walletConnect({ projectId }),
    injected({ shimDisconnect: true }),
  ],
  transports: {
    [creditcoinTestnet.id]: http(),
  },
});

export const publicClient = createPublicClient({
  chain: creditcoinTestnet,
  transport: http(),
});

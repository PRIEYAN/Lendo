import { createConfig, http } from "wagmi";
import { createPublicClient } from "viem";
import { walletConnect, metaMask, injected } from "wagmi/connectors";
import { CREDITCOIN_CHAIN } from "../contracts/config";

// WalletConnect Project ID - Get from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

export const wagmiConfig = createConfig({
  chains: [CREDITCOIN_CHAIN],
  connectors: [
    metaMask(),
    walletConnect({ projectId }),
    injected({ shimDisconnect: true }),
  ],
  transports: {
    [CREDITCOIN_CHAIN.id]: http(),
  },
});

export const publicClient = createPublicClient({
  chain: CREDITCOIN_CHAIN,
  transport: http(),
});

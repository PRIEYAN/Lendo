import { createConfig, http } from "wagmi";
import { metaMask, walletConnect, injected } from "wagmi/connectors";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { CREDITCOIN_CHAIN } from "../contracts/addresses";

const projectId = process.env.VITE_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID";

export const wagmiConfig = createConfig({
  chains: [CREDITCOIN_CHAIN],
  connectors: [
    metaMask(),
    walletConnect({ projectId }),
    injected(),
  ],
  transports: {
    [CREDITCOIN_CHAIN.id]: http(),
  },
});

// Initialize Web3Modal only in browser
if (typeof window !== "undefined") {
  createWeb3Modal({
    wagmiConfig,
    projectId,
  });
}

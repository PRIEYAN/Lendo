"use client";

import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { CREDITCOIN_CHAIN } from "@/lib/contracts/config";

export function ChainChecker() {
  const { isConnected, connector } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected) {
    return null;
  }

  // Check if connected to the correct chain
  if (chainId !== CREDITCOIN_CHAIN.id) {
    const addNetwork = async () => {
      if (connector?.id === "metaMask" && typeof window !== "undefined" && window.ethereum) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${CREDITCOIN_CHAIN.id.toString(16)}`,
                chainName: CREDITCOIN_CHAIN.name,
                nativeCurrency: {
                  name: CREDITCOIN_CHAIN.nativeCurrency.name,
                  symbol: CREDITCOIN_CHAIN.nativeCurrency.symbol,
                  decimals: CREDITCOIN_CHAIN.nativeCurrency.decimals,
                },
                rpcUrls: CREDITCOIN_CHAIN.rpcUrls.default.http,
                blockExplorerUrls: [CREDITCOIN_CHAIN.blockExplorers.default.url],
              },
            ],
          });
          // After adding, switch to it
          await switchChain({ chainId: CREDITCOIN_CHAIN.id });
        } catch (error) {
          console.error("Error adding network:", error);
          // If network already exists, just switch
          try {
            await switchChain({ chainId: CREDITCOIN_CHAIN.id });
          } catch (switchError) {
            console.error("Error switching chain:", switchError);
          }
        }
      } else {
        // For other connectors, just try to switch
        try {
          await switchChain({ chainId: CREDITCOIN_CHAIN.id });
        } catch (error) {
          console.error("Error switching chain:", error);
        }
      }
    };

    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm text-yellow-700">
              <strong>⚠️ WRONG NETWORK DETECTED!</strong>
              <br />
              Current: Chain ID {chainId} (Ethereum)
              <br />
              Required: Chain ID {CREDITCOIN_CHAIN.id} ({CREDITCOIN_CHAIN.name})
              <br />
              <strong className="text-red-600">All transactions are BLOCKED until you switch!</strong>
            </p>
            <button
              onClick={addNetwork}
              disabled={isPending}
              className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition disabled:opacity-50 text-sm font-semibold"
            >
              {isPending ? "Switching..." : `Switch to ${CREDITCOIN_CHAIN.name}`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

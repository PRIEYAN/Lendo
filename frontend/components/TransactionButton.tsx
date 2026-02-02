"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt, useChainId, useSwitchChain } from "wagmi";
import { Hash } from "viem";
import { CREDITCOIN_CHAIN } from "@/lib/contracts/config";

interface TransactionButtonProps {
  contractAddress: `0x${string}`;
  abi: readonly unknown[];
  functionName: string;
  args?: unknown[];
  value?: bigint;
  children: React.ReactNode;
  className?: string;
  onSuccess?: () => void;
  disabled?: boolean;
}

export function TransactionButton({
  contractAddress,
  abi,
  functionName,
  args = [],
  value,
  children,
  className = "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50",
  onSuccess,
  disabled,
}: TransactionButtonProps) {
  const [txHash, setTxHash] = useState<Hash | undefined>();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();

  const { writeContract, isPending, error } = useWriteContract({
    chainId: CREDITCOIN_CHAIN.id, // Force CreditCoin chain
  });
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: CREDITCOIN_CHAIN.id, // Force CreditCoin chain
  });

  const handleClick = async () => {
    // Check if on correct chain - if not, try to switch first
    if (chainId !== CREDITCOIN_CHAIN.id) {
      try {
        // Try to switch chain
        await switchChain({ chainId: CREDITCOIN_CHAIN.id });
        // Don't proceed with transaction - let user confirm the switch first
        // The component will re-render when chain switches, and user can click again
        return;
      } catch (switchError: any) {
        console.error("Error switching chain:", switchError);
        // If switch fails, show error
        alert(
          `Failed to switch network. Please manually switch to ${CREDITCOIN_CHAIN.name} (Chain ID: ${CREDITCOIN_CHAIN.id}) in your wallet and try again.`
        );
        return;
      }
    }

    // Only proceed if we're on the correct chain
    if (chainId !== CREDITCOIN_CHAIN.id) {
      alert(`Please switch to ${CREDITCOIN_CHAIN.name} (Chain ID: ${CREDITCOIN_CHAIN.id}) first.`);
      return;
    }

    try {
      // FORCE CreditCoin chain - explicitly set chainId
      const hash = await writeContract({
        address: contractAddress,
        abi,
        functionName,
        args,
        value,
        chainId: CREDITCOIN_CHAIN.id, // EXPLICITLY FORCE CreditCoin chain
      });
      setTxHash(hash);
    } catch (err: any) {
      console.error("Transaction error:", err);
      // Check if error is about wrong chain
      if (err?.message?.includes("chain") || err?.message?.includes("network") || err?.code === 4902 || err?.message?.includes("102031")) {
        alert(
          `❌ WRONG NETWORK!\n\nYou are on Ethereum (Chain ID: 1)\nYou need: ${CREDITCOIN_CHAIN.name} (Chain ID: ${CREDITCOIN_CHAIN.id})\n\nPlease switch networks in MetaMask first!`
        );
      } else {
        alert(`Transaction failed: ${err?.message || "Unknown error"}`);
      }
    }
  };

  if (isSuccess && onSuccess) {
    onSuccess();
  }

  const isLoading = isPending || isConfirming || isSwitchingChain;
  const isWrongChain = chainId !== CREDITCOIN_CHAIN.id;

  // Don't allow transactions on wrong chain
  if (isWrongChain && !isSwitchingChain) {
    return (
      <div>
        <p className="text-yellow-600 text-sm mb-2 font-semibold">
          ⚠️ Wrong Network Detected
        </p>
        <p className="text-yellow-600 text-sm mb-2">
          Current: Chain ID {chainId} (Ethereum)
          <br />
          Required: Chain ID {CREDITCOIN_CHAIN.id} ({CREDITCOIN_CHAIN.name})
        </p>
        <button
          onClick={handleClick}
          disabled={isSwitchingChain}
          className={className}
        >
          {isSwitchingChain ? "Switching Network..." : `Switch to ${CREDITCOIN_CHAIN.name}`}
        </button>
        <p className="text-gray-500 text-xs mt-2">
          Click the button above or use the network switch banner at the top of the page.
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={disabled || isLoading || isWrongChain}
        className={className}
      >
        {isSwitchingChain
          ? "Switching Network..."
          : isLoading
          ? "Processing..."
          : children}
      </button>
      {error && (
        <p className="text-red-500 text-sm mt-2">
          Error: {error.message || "Transaction failed"}
          {error.message?.includes("chain") && (
            <span className="block mt-1 text-red-600">
              Please switch to {CREDITCOIN_CHAIN.name} (Chain ID: {CREDITCOIN_CHAIN.id}) in your wallet.
            </span>
          )}
        </p>
      )}
      {isSuccess && (
        <p className="text-green-500 text-sm mt-2">Transaction confirmed!</p>
      )}
    </div>
  );
}

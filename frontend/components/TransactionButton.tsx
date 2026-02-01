"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Hash } from "viem";

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

  const { writeContract, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const handleClick = async () => {
    try {
      const hash = await writeContract({
        address: contractAddress,
        abi,
        functionName,
        args,
        value,
      });
      setTxHash(hash);
    } catch (err) {
      console.error("Transaction error:", err);
    }
  };

  if (isSuccess && onSuccess) {
    onSuccess();
  }

  const isLoading = isPending || isConfirming;

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={className}
      >
        {isLoading ? "Processing..." : children}
      </button>
      {error && (
        <p className="text-red-500 text-sm mt-2">
          Error: {error.message || "Transaction failed"}
        </p>
      )}
      {isSuccess && (
        <p className="text-green-500 text-sm mt-2">Transaction confirmed!</p>
      )}
    </div>
  );
}

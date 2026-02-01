import { ReactNode } from "react";
import { useWallet } from "../hooks/useWallet";

interface TransactionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

export function TransactionButton({
  onClick,
  disabled = false,
  children,
  className = "",
}: TransactionButtonProps) {
  const { isConnected, isCorrectNetwork } = useWallet();

  const isDisabled = !isConnected || !isCorrectNetwork || disabled;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`px-4 py-2 rounded-lg transition-colors ${
        isDisabled
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-primary-600 text-white hover:bg-primary-700"
      } ${className}`}
    >
      {children}
    </button>
  );
}

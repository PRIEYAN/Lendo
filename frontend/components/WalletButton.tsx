"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { formatAddress } from "@/lib/utils";

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-mono">{formatAddress(address)}</span>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
          disabled={isPending}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
        >
          {isPending ? "Connecting..." : `Connect ${connector.name}`}
        </button>
      ))}
    </div>
  );
}

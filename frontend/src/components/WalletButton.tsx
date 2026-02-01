import { useWallet } from "../hooks/useWallet";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { formatAddress } from "../utils";

export function WalletButton() {
  const { address, isConnected, isCorrectNetwork, switchToCreditCoin } = useWallet();
  const { open } = useWeb3Modal();

  if (!isConnected) {
    return (
      <button
        onClick={() => open()}
        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        Connect Wallet
      </button>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-red-600 text-sm">Wrong Network</span>
        <button
          onClick={switchToCreditCoin}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Switch Network
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => open({ view: "Account" })}
      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
    >
      {formatAddress(address || "")}
    </button>
  );
}

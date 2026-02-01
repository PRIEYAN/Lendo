import { useAccount, useChainId, useDisconnect, useSwitchChain } from "wagmi";
import { useAppStore } from "../store/useAppStore";
import { CREDITCOIN_CHAIN } from "../contracts/addresses";
import { useEffect } from "react";

export function useWallet() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const { setWallet } = useAppStore();

  const isCorrectNetwork = chainId === CREDITCOIN_CHAIN.id;

  useEffect(() => {
    setWallet(address || null, chainId || null);
  }, [address, chainId, setWallet]);

  const switchToCreditCoin = async () => {
    try {
      await switchChain({ chainId: CREDITCOIN_CHAIN.id });
    } catch (error) {
      console.error("Failed to switch chain:", error);
    }
  };

  return {
    address,
    isConnected,
    chainId,
    isCorrectNetwork,
    disconnect,
    switchToCreditCoin,
  };
}

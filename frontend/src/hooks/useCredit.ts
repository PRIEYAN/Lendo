import { useReadContract, useWatchContractEvent } from "wagmi";
import { useAccount } from "wagmi";
import { CONTRACT_ADDRESSES } from "../contracts/addresses";
import { CreditRegistryABI } from "../abi/CreditRegistry";
import { useAppStore } from "../store/useAppStore";
import { useEffect } from "react";

interface CreditProfile {
  creditScore: bigint;
  circlesJoined: bigint;
  circlesCompleted: bigint;
  onTimePayments: bigint;
  latePayments: bigint;
  defaults: bigint;
  hasDefaulted: boolean;
}

export function useCreditScore(address?: string) {
  const { address: accountAddress } = useAccount();
  const targetAddress = address || accountAddress;
  const { setCreditProfile } = useAppStore();

  const { data: creditScore, refetch: refetchScore } = useReadContract({
    address: CONTRACT_ADDRESSES.creditRegistry,
    abi: CreditRegistryABI,
    functionName: "getCreditScore",
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress && !!CONTRACT_ADDRESSES.creditRegistry,
    },
  });

  const { data: profile, refetch: refetchProfile } = useReadContract({
    address: CONTRACT_ADDRESSES.creditRegistry,
    abi: CreditRegistryABI,
    functionName: "getCreditProfile",
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress && !!CONTRACT_ADDRESSES.creditRegistry,
    },
  });

  useEffect(() => {
    if (profile && typeof profile === 'object' && 'creditScore' in profile) {
      const p = profile as CreditProfile;
      setCreditProfile({
        creditScore: p.creditScore,
        circlesJoined: p.circlesJoined,
        circlesCompleted: p.circlesCompleted,
        onTimePayments: p.onTimePayments,
        latePayments: p.latePayments,
        defaults: p.defaults,
        hasDefaulted: p.hasDefaulted,
      });
    }
  }, [profile, setCreditProfile]);

  // Watch for credit score updates
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.creditRegistry,
    abi: CreditRegistryABI,
    eventName: "CreditScoreUpdated",
    onLogs: () => {
      refetchScore();
      refetchProfile();
    },
  });

  return {
    creditScore: (creditScore as bigint) || BigInt(0),
    profile: profile as CreditProfile | undefined,
    refetch: () => {
      refetchScore();
      refetchProfile();
    },
  };
}

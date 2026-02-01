import { useReadContract, useAccount } from "wagmi";
import { CONTRACT_ADDRESSES } from "../contracts/config";
import { CREDIT_REGISTRY_ABI } from "../contracts/abis/CreditRegistry";
import { formatUnits } from "viem";

export function useCreditScore(address?: `0x${string}`) {
  const { address: connectedAddress } = useAccount();
  const targetAddress = address || connectedAddress;

  const { data: creditScore, ...rest } = useReadContract({
    address: CONTRACT_ADDRESSES.creditRegistry,
    abi: CREDIT_REGISTRY_ABI,
    functionName: "getCreditScore",
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
    },
  });

  return {
    creditScore: creditScore ? Number(creditScore) : 0,
    ...rest,
  };
}

export function useCreditProfile(address?: `0x${string}`) {
  const { address: connectedAddress } = useAccount();
  const targetAddress = address || connectedAddress;

  const { data: profile, ...rest } = useReadContract({
    address: CONTRACT_ADDRESSES.creditRegistry,
    abi: CREDIT_REGISTRY_ABI,
    functionName: "getCreditProfile",
    args: targetAddress ? [targetAddress] : undefined,
    query: {
      enabled: !!targetAddress,
    },
  });

  return {
    profile: profile
      ? {
          creditScore: Number(profile.creditScore),
          circlesJoined: Number(profile.circlesJoined),
          circlesCompleted: Number(profile.circlesCompleted),
          onTimePayments: Number(profile.onTimePayments),
          latePayments: Number(profile.latePayments),
          defaults: Number(profile.defaults),
          hasDefaulted: profile.hasDefaulted,
        }
      : null,
    ...rest,
  };
}

import { useReadContract, useReadContracts } from "wagmi";
import { LENDING_CIRCLE_ABI } from "../contracts/abis/LendingCircle";
import { CREDIT_REGISTRY_ABI } from "../contracts/abis/CreditRegistry";
import { CONTRACT_ADDRESSES } from "../contracts/config";
import { useCreditScore } from "./useCreditScore";

export function useCircleCandidates(circleAddress: `0x${string}` | undefined, month: number) {
  const { data: candidates } = useReadContract({
    address: circleAddress,
    abi: LENDING_CIRCLE_ABI,
    functionName: "getCandidates",
    args: [BigInt(month)],
    query: {
      enabled: !!circleAddress,
    },
  });

  return candidates || [];
}

export function useCandidateVotes(
  circleAddress: `0x${string}` | undefined,
  month: number,
  candidates: `0x${string}`[]
) {
  const contracts = candidates.map((candidate) => ({
    address: circleAddress!,
    abi: LENDING_CIRCLE_ABI,
    functionName: "getCandidateVotes" as const,
    args: [BigInt(month), candidate] as const,
  }));

  const { data, isLoading } = useReadContracts({
    contracts: circleAddress && candidates.length > 0 ? contracts : [],
  });

  const votes = data?.map((result, idx) => ({
    candidate: candidates[idx],
    votes: Number(result.result || 0n),
  })) || [];

  // Get credit scores for each candidate
  const creditScoreContracts = candidates.map((candidate) => ({
    address: CONTRACT_ADDRESSES.creditRegistry,
    abi: CREDIT_REGISTRY_ABI,
    functionName: "getCreditScore" as const,
    args: [candidate] as const,
  }));

  const { data: creditScores } = useReadContracts({
    contracts: candidates.length > 0 ? creditScoreContracts : [],
  });

  return {
    votes: votes.map((v, idx) => ({
      ...v,
      creditScore: creditScores ? Number(creditScores[idx]?.result || 0n) : 0,
    })),
    isLoading,
  };
}

export function useVotingStatus(circleAddress: `0x${string}` | undefined, month: number) {
  const { data: isEnded } = useReadContract({
    address: circleAddress,
    abi: LENDING_CIRCLE_ABI,
    functionName: "isVotingPeriodEnded",
    args: [BigInt(month)],
    query: {
      enabled: !!circleAddress,
    },
  });

  const { data: winner } = useReadContract({
    address: circleAddress,
    abi: LENDING_CIRCLE_ABI,
    functionName: "getWinner",
    args: [BigInt(month)],
    query: {
      enabled: !!circleAddress,
    },
  });

  return {
    isEnded: isEnded || false,
    winner: winner as `0x${string}` | undefined,
  };
}

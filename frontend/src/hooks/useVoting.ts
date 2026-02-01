import { useReadContract } from "wagmi";
import { LendingCircleABI } from "../abi/LendingCircle";
import { Address } from "viem";

export function useCircleVoting(circleAddress: Address | undefined, month: bigint | undefined) {
  const { data: candidates } = useReadContract({
    address: circleAddress,
    abi: LendingCircleABI,
    functionName: "getCandidates",
    args: month !== undefined ? [month] : undefined,
    query: {
      enabled: !!circleAddress && month !== undefined,
    },
  });

  const { data: winner } = useReadContract({
    address: circleAddress,
    abi: LendingCircleABI,
    functionName: "getWinner",
    args: month !== undefined ? [month] : undefined,
    query: {
      enabled: !!circleAddress && month !== undefined,
    },
  });

  const { data: isVotingPeriodEnded } = useReadContract({
    address: circleAddress,
    abi: LendingCircleABI,
    functionName: "isVotingPeriodEnded",
    args: month !== undefined ? [month] : undefined,
    query: {
      enabled: !!circleAddress && month !== undefined,
    },
  });

  return {
    candidates: (candidates as Address[]) || [],
    winner: winner as Address | undefined,
    isVotingPeriodEnded: isVotingPeriodEnded || false,
  };
}

export function useCandidateVotes(
  circleAddress: Address | undefined,
  month: bigint | undefined,
  candidate: Address | undefined
) {
  const { data: votes } = useReadContract({
    address: circleAddress,
    abi: LendingCircleABI,
    functionName: "getCandidateVotes",
    args: month !== undefined && candidate ? [month, candidate] : undefined,
    query: {
      enabled: !!circleAddress && month !== undefined && !!candidate,
    },
  });

  return {
    votes: (votes as bigint) || BigInt(0),
  };
}

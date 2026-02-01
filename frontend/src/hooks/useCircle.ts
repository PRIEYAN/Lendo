import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent, usePublicClient } from "wagmi";
import { CONTRACT_ADDRESSES } from "../contracts/addresses";
import { LendingCircleFactoryABI } from "../abi/LendingCircleFactory";
import { LendingCircleABI } from "../abi/LendingCircle";
import { useAppStore } from "../store/useAppStore";
import { useEffect, useState } from "react";
import { Address } from "viem";

export function useLendingCircles() {
  const { setCircles } = useAppStore();

  const { data: circleCount, refetch: refetchCount } = useReadContract({
    address: CONTRACT_ADDRESSES.factory,
    abi: LendingCircleFactoryABI,
    functionName: "getCircleCount",
    query: {
      enabled: !!CONTRACT_ADDRESSES.factory,
    },
  });

  const { data: circles, refetch: refetchCircles } = useReadContract({
    address: CONTRACT_ADDRESSES.factory,
    abi: LendingCircleFactoryABI,
    functionName: "getCircles",
    args: [BigInt(0), circleCount || BigInt(100)],
    query: {
      enabled: !!CONTRACT_ADDRESSES.factory && !!circleCount && (circleCount as bigint) > 0n,
    },
  });

  useEffect(() => {
    if (circles && Array.isArray(circles)) {
      setCircles(circles as string[]);
    }
  }, [circles, setCircles]);

  // Watch for new circles
  useWatchContractEvent({
    address: CONTRACT_ADDRESSES.factory,
    abi: LendingCircleFactoryABI,
    eventName: "CircleCreated",
    onLogs: () => {
      refetchCount();
      refetchCircles();
    },
  });

  return {
    circles: (circles as string[]) || [],
    circleCount: circleCount || BigInt(0),
    refetch: () => {
      refetchCount();
      refetchCircles();
    },
  };
}

export function useCircleData(circleAddress: Address | undefined) {
  const { updateCircleData } = useAppStore();

  const { data: monthlyContribution } = useReadContract({
    address: circleAddress,
    abi: LendingCircleABI,
    functionName: "monthlyContribution",
    query: { enabled: !!circleAddress },
  });

  const { data: durationInMonths } = useReadContract({
    address: circleAddress,
    abi: LendingCircleABI,
    functionName: "durationInMonths",
    query: { enabled: !!circleAddress },
  });

  const { data: minParticipants } = useReadContract({
    address: circleAddress,
    abi: LendingCircleABI,
    functionName: "minParticipants",
    query: { enabled: !!circleAddress },
  });

  const { data: maxParticipants } = useReadContract({
    address: circleAddress,
    abi: LendingCircleABI,
    functionName: "maxParticipants",
    query: { enabled: !!circleAddress },
  });

  const { data: totalParticipants } = useReadContract({
    address: circleAddress,
    abi: LendingCircleABI,
    functionName: "totalParticipants",
    query: { enabled: !!circleAddress },
  });

  const { data: currentMonth } = useReadContract({
    address: circleAddress,
    abi: LendingCircleABI,
    functionName: "currentMonth",
    query: { enabled: !!circleAddress },
  });

  const { data: status } = useReadContract({
    address: circleAddress,
    abi: LendingCircleABI,
    functionName: "status",
    query: { enabled: !!circleAddress },
  });

  const { data: poolBalance } = useReadContract({
    address: circleAddress,
    abi: LendingCircleABI,
    functionName: "poolBalance",
    query: { enabled: !!circleAddress },
  });

  const { data: creator } = useReadContract({
    address: circleAddress,
    abi: LendingCircleABI,
    functionName: "creator",
    query: { enabled: !!circleAddress },
  });

  useEffect(() => {
    if (circleAddress) {
      updateCircleData(circleAddress, {
        monthlyContribution,
        durationInMonths,
        minParticipants,
        maxParticipants,
        totalParticipants,
        currentMonth,
        status,
        poolBalance,
        creator,
      });
    }
  }, [
    circleAddress,
    monthlyContribution,
    durationInMonths,
    minParticipants,
    maxParticipants,
    totalParticipants,
    currentMonth,
    status,
    poolBalance,
    creator,
    updateCircleData,
  ]);

  return {
    monthlyContribution: monthlyContribution || BigInt(0),
    durationInMonths: durationInMonths || BigInt(0),
    minParticipants: minParticipants || BigInt(0),
    maxParticipants: maxParticipants || BigInt(0),
    totalParticipants: totalParticipants || BigInt(0),
    currentMonth: currentMonth || BigInt(0),
    status: status || 0,
    poolBalance: poolBalance || BigInt(0),
    creator: creator || "0x",
  };
}

export function useCircleParticipants(circleAddress: Address | undefined) {
  const [participants, setParticipants] = useState<Address[]>([]);
  const publicClient = usePublicClient();
  const { data: totalParticipants } = useReadContract({
    address: circleAddress,
    abi: LendingCircleABI,
    functionName: "totalParticipants",
    query: { enabled: !!circleAddress },
  });

  useEffect(() => {
    if (!circleAddress || !totalParticipants || !publicClient) return;

    const fetchParticipants = async () => {
      const participantAddresses: Address[] = [];
      const count = Number(totalParticipants as bigint);
      
      for (let i = 0; i < count; i++) {
        try {
          const address = await publicClient.readContract({
            address: circleAddress,
            abi: LendingCircleABI,
            functionName: "participantList",
            args: [BigInt(i)],
          });
          participantAddresses.push(address as Address);
        } catch (error) {
          console.error(`Error fetching participant ${i}:`, error);
          break;
        }
      }
      
      setParticipants(participantAddresses);
    };

    fetchParticipants();
  }, [circleAddress, totalParticipants, publicClient]);

  return participants;
}

export function useCircleActions(circleAddress: Address | undefined) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const requestToJoin = () => {
    if (!circleAddress) return;
    writeContract({
      address: circleAddress,
      abi: LendingCircleABI,
      functionName: "requestToJoin",
    });
  };

  const approveParticipant = (participant: Address) => {
    if (!circleAddress) return;
    writeContract({
      address: circleAddress,
      abi: LendingCircleABI,
      functionName: "approveParticipant",
      args: [participant],
    });
  };

  const rejectParticipant = (participant: Address) => {
    if (!circleAddress) return;
    writeContract({
      address: circleAddress,
      abi: LendingCircleABI,
      functionName: "rejectParticipant",
      args: [participant],
    });
  };

  const makeContribution = (month: bigint, value: bigint) => {
    if (!circleAddress) return;
    writeContract({
      address: circleAddress,
      abi: LendingCircleABI,
      functionName: "makeContribution",
      args: [month],
      value,
    });
  };

  const proposePayout = (candidate: Address, month: bigint) => {
    if (!circleAddress) return;
    writeContract({
      address: circleAddress,
      abi: LendingCircleABI,
      functionName: "proposePayout",
      args: [candidate, month],
    });
  };

  const vote = (candidate: Address, month: bigint) => {
    if (!circleAddress) return;
    writeContract({
      address: circleAddress,
      abi: LendingCircleABI,
      functionName: "vote",
      args: [month, candidate],
    });
  };

  const executePayout = (month: bigint) => {
    if (!circleAddress) return;
    writeContract({
      address: circleAddress,
      abi: LendingCircleABI,
      functionName: "executePayout",
      args: [month],
    });
  };

  const withdrawExcess = () => {
    if (!circleAddress) return;
    writeContract({
      address: circleAddress,
      abi: LendingCircleABI,
      functionName: "withdrawExcess",
    });
  };

  return {
    requestToJoin,
    approveParticipant,
    rejectParticipant,
    makeContribution,
    proposePayout,
    vote,
    executePayout,
    withdrawExcess,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
  };
}

import { useReadContract, useReadContracts } from "wagmi";
import { CONTRACT_ADDRESSES } from "../contracts/config";
import { LENDING_CIRCLE_FACTORY_ABI, LENDING_CIRCLE_ABI } from "../contracts/abis/LendingCircleFactory";
import { LENDING_CIRCLE_ABI as CIRCLE_ABI } from "../contracts/abis/LendingCircle";
import { formatEther } from "viem";

export function useCircleCount() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.factory,
    abi: LENDING_CIRCLE_FACTORY_ABI,
    functionName: "getCircleCount",
  });
}

export function useAllCircles(limit = 50) {
  const { data: count } = useCircleCount();
  const circleCount = count ? Number(count) : 0;

  const { data: circles } = useReadContract({
    address: CONTRACT_ADDRESSES.factory,
    abi: LENDING_CIRCLE_FACTORY_ABI,
    functionName: "getCircles",
    args: [0n, BigInt(Math.min(limit, circleCount))],
    query: {
      enabled: circleCount > 0,
    },
  });

  return circles || [];
}

export function useCircleDetails(circleAddress: `0x${string}` | undefined) {
  if (!circleAddress) {
    return { data: null, isLoading: false, error: null };
  }

  const contracts = [
    {
      address: circleAddress,
      abi: CIRCLE_ABI,
      functionName: "creator" as const,
    },
    {
      address: circleAddress,
      abi: CIRCLE_ABI,
      functionName: "monthlyContribution" as const,
    },
    {
      address: circleAddress,
      abi: CIRCLE_ABI,
      functionName: "durationInMonths" as const,
    },
    {
      address: circleAddress,
      abi: CIRCLE_ABI,
      functionName: "minParticipants" as const,
    },
    {
      address: circleAddress,
      abi: CIRCLE_ABI,
      functionName: "maxParticipants" as const,
    },
    {
      address: circleAddress,
      abi: CIRCLE_ABI,
      functionName: "reservePercentage" as const,
    },
    {
      address: circleAddress,
      abi: CIRCLE_ABI,
      functionName: "status" as const,
    },
    {
      address: circleAddress,
      abi: CIRCLE_ABI,
      functionName: "currentMonth" as const,
    },
    {
      address: circleAddress,
      abi: CIRCLE_ABI,
      functionName: "totalParticipants" as const,
    },
    {
      address: circleAddress,
      abi: CIRCLE_ABI,
      functionName: "poolBalance" as const,
    },
  ];

  const { data, isLoading, error } = useReadContracts({ contracts });

  if (isLoading) {
    return { data: null, isLoading: true, error: null };
  }

  if (error || !data) {
    return { data: null, isLoading: false, error: error || new Error("Failed to fetch circle details") };
  }

  // Check if all required data is available
  const hasAllData = data.every((item) => item.status === "success" && item.result !== undefined);
  
  if (!hasAllData) {
    // Some calls failed, but we can still try to show what we have
    console.warn("Some contract calls failed:", data);
  }

  try {
    return {
      data: {
        creator: (data[0]?.result as `0x${string}`) || "0x0000000000000000000000000000000000000000",
        monthlyContribution: formatEther((data[1]?.result as bigint) || 0n),
        durationInMonths: Number(data[2]?.result || 0n),
        minParticipants: Number(data[3]?.result || 0n),
        maxParticipants: Number(data[4]?.result || 0n),
        reservePercentage: Number(data[5]?.result || 0n),
        status: Number(data[6]?.result || 0n), // 0: PENDING, 1: ACTIVE, 2: COMPLETED, 3: CANCELLED
        currentMonth: Number(data[7]?.result || 0n),
        totalParticipants: Number(data[8]?.result || 0n),
        poolBalance: formatEther((data[9]?.result as bigint) || 0n),
      },
      isLoading: false,
      error: null,
    };
  } catch (err) {
    console.error("Error processing circle details:", err);
    return { data: null, isLoading: false, error: err as Error };
  }
}

export function useUserCircles(userAddress: `0x${string}` | undefined) {
  const { data, ...rest } = useReadContract({
    address: CONTRACT_ADDRESSES.factory,
    abi: LENDING_CIRCLE_FACTORY_ABI,
    functionName: "getUserCircles",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  return {
    data: data as `0x${string}`[] | undefined,
    ...rest,
  };
}

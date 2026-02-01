"use client";

import { useAccount } from "wagmi";
import { useCircleCandidates, useCandidateVotes, useVotingStatus } from "@/lib/hooks/useCircleVoting";
import { TransactionButton } from "./TransactionButton";
import { LENDING_CIRCLE_ABI } from "@/lib/contracts/abis/LendingCircle";
import { formatAddress } from "@/lib/utils";
import { useCreditScore } from "@/lib/hooks/useCreditScore";
import { useReadContract } from "wagmi";

interface VotingUIProps {
  circleAddress: `0x${string}`;
  month: number;
}

export function VotingUI({ circleAddress, month }: VotingUIProps) {
  const { address, isConnected } = useAccount();
  const candidates = useCircleCandidates(circleAddress, month);
  const { votes, isLoading: votesLoading } = useCandidateVotes(circleAddress, month, candidates);
  const { isEnded, winner } = useVotingStatus(circleAddress, month);
  const { creditScore } = useCreditScore();

  // Note: Voting status is already checked via useVotingStatus hook

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Voting</h2>
        <p className="text-gray-500">Connect wallet to participate in voting</p>
      </div>
    );
  }

  if (candidates.length === 0 && !isEnded) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Voting - Month {month + 1}</h2>
        <p className="text-gray-500 mb-4">No candidates proposed yet.</p>
        <TransactionButton
          contractAddress={circleAddress}
          abi={LENDING_CIRCLE_ABI}
          functionName="proposePayout"
          args={[address!, BigInt(month)]}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Propose Yourself
        </TransactionButton>
      </div>
    );
  }

  if (isEnded && winner) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Voting Results - Month {month + 1}</h2>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800 font-semibold">Winner:</p>
          <p className="text-green-700">{formatAddress(winner)}</p>
        </div>
        <TransactionButton
          contractAddress={circleAddress}
          abi={LENDING_CIRCLE_ABI}
          functionName="executePayout"
          args={[BigInt(month)]}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Execute Payout
        </TransactionButton>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Voting - Month {month + 1}</h2>
        <div className="text-sm text-gray-500">
          Your voting power: <span className="font-semibold">{creditScore}</span>
        </div>
      </div>

      {votesLoading ? (
        <p>Loading votes...</p>
      ) : (
        <div className="space-y-4">
          {votes.map((vote) => (
            <CandidateCard
              key={vote.candidate}
              candidate={vote.candidate}
              votes={vote.votes}
              creditScore={vote.creditScore}
              circleAddress={circleAddress}
              month={month}
              userAddress={address}
              userCreditScore={creditScore}
            />
          ))}
        </div>
      )}

      <div className="mt-6 pt-6 border-t">
        <h3 className="font-semibold mb-2">Propose a Candidate</h3>
        <p className="text-sm text-gray-600 mb-4">
          You can propose yourself or another eligible participant
        </p>
        <TransactionButton
          contractAddress={circleAddress}
          abi={LENDING_CIRCLE_ABI}
          functionName="proposePayout"
          args={[address!, BigInt(month)]}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Propose Yourself
        </TransactionButton>
      </div>
    </div>
  );
}

function CandidateCard({
  candidate,
  votes,
  creditScore,
  circleAddress,
  month,
  userAddress,
  userCreditScore,
}: {
  candidate: `0x${string}`;
  votes: number;
  creditScore: number;
  circleAddress: `0x${string}`;
  month: number;
  userAddress: `0x${string}` | undefined;
  userCreditScore: number;
}) {
  const isUser = candidate.toLowerCase() === userAddress?.toLowerCase();
  const votePercentage = votes > 0 ? (votes / (votes + 100)) * 100 : 0; // Simplified calculation

  return (
    <div className={`border rounded-lg p-4 ${isUser ? "border-blue-500 bg-blue-50" : ""}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold">{formatAddress(candidate)}</p>
          {isUser && <span className="text-xs text-blue-600">(You)</span>}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Credit Score</p>
          <p className="font-semibold">{creditScore}</p>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-sm mb-1">
          <span>Votes (weighted):</span>
          <span className="font-semibold">{votes}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${Math.min(votePercentage, 100)}%` }}
          />
        </div>
      </div>
      {userAddress && (
        <div className="mt-4">
          <TransactionButton
            contractAddress={circleAddress}
            abi={LENDING_CIRCLE_ABI}
            functionName="vote"
            args={[BigInt(month), candidate]}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Vote (Power: {userCreditScore})
          </TransactionButton>
        </div>
      )}
    </div>
  );
}

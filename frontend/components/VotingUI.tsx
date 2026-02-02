"use client";

import { useAccount } from "wagmi";
import { useCircleCandidates, useCandidateVotes, useVotingStatus, useBackendWinner } from "@/lib/hooks/useCircleVoting";
import { TransactionButton } from "./TransactionButton";
import { LENDING_CIRCLE_ABI } from "@/lib/contracts/abis/LendingCircle";
import { formatAddress } from "@/lib/utils";
import { useCreditScore } from "@/lib/hooks/useCreditScore";

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
  const { data: backendWinnerData, isLoading: backendLoading } = useBackendWinner(circleAddress, month);
  
  // Use backend winner data if available, otherwise use contract winner
  const displayWinner = backendWinnerData?.winner || winner;
  const sortedCandidates = backendWinnerData?.candidates || votes.map(v => ({
    address: v.candidate,
    votes: v.votes.toString(),
    creditScore: v.creditScore.toString(),
  }));

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Voting</h2>
        <p className="text-gray-500">Connect wallet to participate in voting</p>
      </div>
    );
  }

  if (candidates.length === 0 && !isEnded) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Voting - Month {month + 1}</h2>
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

  if (isEnded && displayWinner) {
    // Find winner details from sorted candidates
    const winnerDetails = sortedCandidates.find(c => 
      c.address.toLowerCase() === displayWinner.toLowerCase()
    );
    
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Voting Results - Month {month + 1}</h2>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <p className="text-green-800 font-semibold">Winner (Selected by: Votes → Credit Score → Alphabetical):</p>
          <p className="text-green-700 font-bold text-lg">{formatAddress(displayWinner)}</p>
          {winnerDetails && (
            <div className="mt-2 text-sm text-green-700">
              <p>Votes: {winnerDetails.votes}</p>
              <p>Credit Score: {winnerDetails.creditScore}</p>
            </div>
          )}
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">All Candidates (Sorted):</h3>
          <div className="space-y-2">
            {sortedCandidates.map((candidate, idx) => (
              <div
                key={candidate.address}
                className={`p-2 rounded ${
                  candidate.address.toLowerCase() === displayWinner.toLowerCase()
                    ? "bg-green-100 border-2 border-green-500"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold">#{idx + 1}</span> {formatAddress(candidate.address)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Votes: {candidate.votes} | Credit: {candidate.creditScore}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
        <h2 className="text-2xl font-bold text-gray-900">Voting - Month {month + 1}</h2>
        <div className="text-sm text-gray-500">
          Your voting power: <span className="font-semibold">{creditScore}</span>
        </div>
      </div>

      {(votesLoading || backendLoading) ? (
        <p className="text-gray-900">Loading votes...</p>
      ) : (
        <div className="space-y-4">
          {sortedCandidates.map((candidate) => {
            const voteData = votes.find(v => 
              v.candidate.toLowerCase() === candidate.address.toLowerCase()
            );
            return (
              <CandidateCard
                key={candidate.address}
                candidate={candidate.address as `0x${string}`}
                votes={voteData?.votes || parseInt(candidate.votes) || 0}
                creditScore={voteData?.creditScore || parseInt(candidate.creditScore) || 0}
                circleAddress={circleAddress}
                month={month}
                userAddress={address}
                userCreditScore={creditScore}
              />
            );
          })}
        </div>
      )}
      
      {sortedCandidates.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Selection Criteria:</strong> Highest votes → Highest credit score → Alphabetical order (lower address)
          </p>
        </div>
      )}

      <div className="mt-6 pt-6 border-t">
        <h3 className="font-semibold mb-2 text-gray-900">Propose a Candidate</h3>
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
          <p className="font-semibold text-gray-900">{formatAddress(candidate)}</p>
          {isUser && <span className="text-xs text-blue-600">(You)</span>}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Credit Score</p>
          <p className="font-semibold text-gray-900">{creditScore}</p>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-700">Votes (weighted):</span>
          <span className="font-semibold text-gray-900">{votes}</span>
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

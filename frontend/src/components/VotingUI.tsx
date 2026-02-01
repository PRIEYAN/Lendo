import { useCircleVoting, useCandidateVotes } from "../hooks/useVoting";
import { useCreditScore } from "../hooks/useCredit";
import { useCircleActions } from "../hooks/useCircle";
import { TransactionButton } from "./TransactionButton";
import { formatAddress, formatEther } from "../utils";
import { Address } from "viem";
import { useState } from "react";

interface VotingUIProps {
  circleAddress: Address;
  month: bigint;
}

export function VotingUI({ circleAddress, month }: VotingUIProps) {
  const { candidates, winner, isVotingPeriodEnded } = useCircleVoting(circleAddress, month);
  const { vote, isPending } = useCircleActions(circleAddress);
  const [selectedCandidate, setSelectedCandidate] = useState<Address | null>(null);

  const handleVote = () => {
    if (selectedCandidate) {
      vote(selectedCandidate, month);
    }
  };

  if ((isVotingPeriodEnded as boolean) && winner) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Voting Complete</h3>
        <p className="text-gray-600">
          Winner: <span className="font-mono">{formatAddress(winner)}</span>
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Vote for Payout Recipient</h3>
      <div className="space-y-4">
        {candidates.length === 0 ? (
          <p className="text-gray-500">No eligible candidates for this month</p>
        ) : (
          candidates.map((candidate) => (
            <CandidateCard
              key={candidate}
              candidate={candidate}
              circleAddress={circleAddress}
              month={month}
              isSelected={selectedCandidate === candidate}
              onSelect={() => setSelectedCandidate(candidate)}
            />
          ))
        )}
        {selectedCandidate && (
          <TransactionButton
            onClick={handleVote}
            disabled={isPending || isVotingPeriodEnded}
            className="w-full mt-4"
          >
            {isPending ? "Voting..." : "Cast Vote"}
          </TransactionButton>
        )}
      </div>
    </div>
  );
}

function CandidateCard({
  candidate,
  circleAddress,
  month,
  isSelected,
  onSelect,
}: {
  candidate: Address;
  circleAddress: Address;
  month: bigint;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { votes } = useCandidateVotes(circleAddress, month, candidate);
  const { creditScore } = useCreditScore(candidate);

  return (
    <div
      onClick={onSelect}
      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
        isSelected ? "border-primary-500 bg-primary-50" : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-mono text-sm">{formatAddress(candidate)}</p>
          <p className="text-sm text-gray-600">Credit Score: {creditScore.toString()}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">{formatEther(votes)} votes</p>
        </div>
      </div>
    </div>
  );
}

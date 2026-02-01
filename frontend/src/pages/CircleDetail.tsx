import { useParams } from "react-router-dom";
import { useCircleData, useCircleActions, useCircleParticipants } from "../hooks/useCircle";
import { useCircleVoting } from "../hooks/useVoting";
import { useCreditScore } from "../hooks/useCredit";
import { useAccount, useReadContract } from "wagmi";
import { VotingUI } from "../components/VotingUI";
import { TransactionButton } from "../components/TransactionButton";
import { formatAddress, formatEther, getCircleStatus, getStatusColor, parseEther } from "../utils";
import { LendingCircleABI } from "../abi/LendingCircle";
import { Address } from "viem";
import { useState } from "react";
import { toast } from "react-hot-toast";

export function CircleDetail() {
  const { address } = useParams<{ address: string }>();
  const circleAddress = address as Address;
  const { address: userAddress } = useAccount();
  const data = useCircleData(circleAddress);
  const {
    requestToJoin,
    makeContribution,
    executePayout,
    withdrawExcess,
    isPending,
    isConfirmed,
  } = useCircleActions(circleAddress);
  const { isVotingPeriodEnded, winner } = useCircleVoting(circleAddress, data.currentMonth as bigint);
  const [contributionAmount, setContributionAmount] = useState("");

  const handleContribution = () => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      toast.error("Please enter a valid contribution amount");
      return;
    }
    try {
      const amount = parseEther(contributionAmount);
      makeContribution(data.currentMonth as bigint, amount);
      setContributionAmount("");
    } catch (error: any) {
      toast.error(error.message || "Failed to make contribution");
    }
  };

  if (isConfirmed) {
    toast.success("Transaction confirmed!");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Circle Details</h1>
        <p className="text-gray-600 font-mono text-sm">{formatAddress(circleAddress)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Circle Info</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`px-2 py-1 rounded text-xs ${getStatusColor(data.status as number)}`}>
                {getCircleStatus(data.status as number)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Contribution:</span>
              <span className="font-semibold">{formatEther(data.monthlyContribution as bigint)} tCTC</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-semibold">{(data.durationInMonths as bigint).toString()} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Participants:</span>
              <span className="font-semibold">
                {(data.totalParticipants as bigint).toString()} / {(data.maxParticipants as bigint).toString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Current Month:</span>
              <span className="font-semibold">{(data.currentMonth as bigint).toString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pool Balance:</span>
              <span className="font-semibold">{formatEther(data.poolBalance as bigint)} tCTC</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Actions</h2>
          <div className="space-y-3">
            {(data.status as number) === 0 && (
              <TransactionButton onClick={requestToJoin} disabled={isPending}>
                Request to Join
              </TransactionButton>
            )}

            {userAddress?.toLowerCase() === (data.creator as string).toLowerCase() && (data.status as number) === 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Approve/Reject participants (as creator)</p>
              </div>
            )}

            {(data.status as number) === 1 && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Make Contribution (tCTC)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.0001"
                      value={contributionAmount}
                      onChange={(e) => setContributionAmount(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder={formatEther(data.monthlyContribution)}
                    />
                    <TransactionButton
                      onClick={handleContribution}
                      disabled={isPending || !contributionAmount}
                    >
                      Pay
                    </TransactionButton>
                  </div>
                </div>

                {(isVotingPeriodEnded as boolean) && winner && (
                  <TransactionButton onClick={() => executePayout(data.currentMonth as bigint)} disabled={isPending}>
                    Execute Payout
                  </TransactionButton>
                )}

                <TransactionButton onClick={withdrawExcess} disabled={isPending}>
                  Withdraw Excess
                </TransactionButton>
              </div>
            )}
          </div>
        </div>
      </div>

      {(data.status as number) === 1 && (
        <div className="mb-6">
          <VotingUI circleAddress={circleAddress} month={data.currentMonth as bigint} />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Participants</h2>
        <ParticipantList circleAddress={circleAddress} />
      </div>
    </div>
  );
}

function ParticipantList({ circleAddress }: { circleAddress: Address }) {
  const participants = useCircleParticipants(circleAddress);
  const { address: userAddress } = useAccount();

  return (
    <div className="space-y-2">
      {participants.length === 0 ? (
        <p className="text-gray-500">No participants yet</p>
      ) : (
        participants.map((participant) => (
          <ParticipantItem
            key={participant}
            address={participant}
            circleAddress={circleAddress}
            isCurrentUser={userAddress?.toLowerCase() === participant.toLowerCase()}
          />
        ))
      )}
    </div>
  );
}

function ParticipantItem({
  address,
  circleAddress,
  isCurrentUser,
}: {
  address: Address;
  circleAddress: Address;
  isCurrentUser: boolean;
}) {
  const { data: participantData } = useReadContract({
    address: circleAddress,
    abi: LendingCircleABI,
    functionName: "participants",
    args: [address],
    query: { enabled: !!circleAddress },
  });

  const { creditScore } = useCreditScore(address);

  if (!participantData) return null;

  const participantInfo = participantData as [
    Address,
    boolean,
    boolean,
    boolean,
    bigint,
  ];
  const [, isActive, hasReceivedPayout, isInDefault, withdrawableBalance] = participantInfo;

  return (
    <div className={`p-4 border rounded-lg ${isCurrentUser ? "bg-primary-50 border-primary-200" : "bg-gray-50"}`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="font-mono text-sm">
            {formatAddress(address)}
            {isCurrentUser && <span className="ml-2 text-primary-600">(You)</span>}
          </p>
          <div className="flex gap-4 mt-1 text-xs text-gray-600">
            <span>Credit: {creditScore.toString()}</span>
            <span className={isActive ? "text-green-600" : "text-gray-400"}>
              {isActive ? "Active" : "Inactive"}
            </span>
            {hasReceivedPayout && <span className="text-blue-600">Paid</span>}
            {isInDefault && <span className="text-red-600">Default</span>}
          </div>
        </div>
        {withdrawableBalance > 0n && (
          <div className="text-right">
            <p className="text-sm text-gray-600">Withdrawable</p>
            <p className="font-semibold">{formatEther(withdrawableBalance)} tCTC</p>
          </div>
        )}
      </div>
    </div>
  );
}

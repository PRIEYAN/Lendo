"use client";

import { useCreditScore, useCreditProfile } from "@/lib/hooks/useCreditScore";
import { useAccount } from "wagmi";
import { MAX_CREDIT_SCORE, BASE_CREDIT_SCORE } from "@/lib/contracts/config";

export function CreditScoreCard() {
  const { address } = useAccount();
  const { creditScore, isLoading } = useCreditScore();
  const { profile } = useCreditProfile();

  if (!address) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Connect wallet to view credit score</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p>Loading credit score...</p>
      </div>
    );
  }

  const scorePercentage = (creditScore / MAX_CREDIT_SCORE) * 100;
  const scoreColor =
    creditScore >= 700
      ? "text-green-600"
      : creditScore >= 500
      ? "text-yellow-600"
      : creditScore >= 300
      ? "text-orange-600"
      : "text-red-600";

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Credit Score</h2>
      <div className="flex items-center gap-4 mb-6">
        <div className={`text-6xl font-bold ${scoreColor}`}>{creditScore}</div>
        <div className="flex-1">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full ${
                creditScore >= 700
                  ? "bg-green-600"
                  : creditScore >= 500
                  ? "bg-yellow-600"
                  : creditScore >= 300
                  ? "bg-orange-600"
                  : "bg-red-600"
              }`}
              style={{ width: `${scorePercentage}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {scorePercentage.toFixed(1)}% of maximum ({MAX_CREDIT_SCORE})
          </p>
        </div>
      </div>

      {profile && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Circles Joined</p>
            <p className="font-semibold">{profile.circlesJoined}</p>
          </div>
          <div>
            <p className="text-gray-500">Circles Completed</p>
            <p className="font-semibold">{profile.circlesCompleted}</p>
          </div>
          <div>
            <p className="text-gray-500">On-Time Payments</p>
            <p className="font-semibold text-green-600">{profile.onTimePayments}</p>
          </div>
          <div>
            <p className="text-gray-500">Late Payments</p>
            <p className="font-semibold text-yellow-600">{profile.latePayments}</p>
          </div>
          <div>
            <p className="text-gray-500">Defaults</p>
            <p className="font-semibold text-red-600">{profile.defaults}</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-semibold">
              {profile.hasDefaulted ? (
                <span className="text-red-600">Defaulted</span>
              ) : (
                <span className="text-green-600">Active</span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

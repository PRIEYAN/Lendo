"use client";

import { useAccount } from "wagmi";
import { useCreditProfile } from "@/lib/hooks/useCreditScore";
import { useUserCircles } from "@/lib/hooks/useLendingCircles";
import { CreditScoreCard } from "@/components/CreditScoreCard";
import Link from "next/link";
import { formatAddress } from "@/lib/utils";
import { MAX_CREDIT_SCORE, BASE_CREDIT_SCORE } from "@/lib/contracts/config";

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const { profile, isLoading } = useCreditProfile();
  const { data: userCircles } = useUserCircles(address);

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-yellow-900 mb-2">
            Wallet Not Connected
          </h2>
          <p className="text-yellow-700">
            Please connect your wallet to view your credit profile.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Credit Profile</h1>

      <div className="mb-8">
        <CreditScoreCard />
      </div>

      {profile && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Payment History</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="font-semibold text-green-800">On-Time Payments</p>
                  <p className="text-sm text-green-600">
                    Each on-time payment increases your credit score by +10 points
                  </p>
                </div>
                <div className="text-3xl font-bold text-green-600">{profile.onTimePayments}</div>
              </div>
              <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-semibold text-yellow-800">Late Payments</p>
                  <p className="text-sm text-yellow-600">
                    Each late payment decreases your credit score by -20 points
                  </p>
                </div>
                <div className="text-3xl font-bold text-yellow-600">{profile.latePayments}</div>
              </div>
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <div>
                  <p className="font-semibold text-red-800">Defaults</p>
                  <p className="text-sm text-red-600">
                    Each default decreases your credit score by -100 points
                  </p>
                </div>
                <div className="text-3xl font-bold text-red-600">{profile.defaults}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Circle Participation</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-semibold text-blue-800">Circles Joined</p>
                  <p className="text-sm text-blue-600">Total circles you've participated in</p>
                </div>
                <div className="text-3xl font-bold text-blue-600">{profile.circlesJoined}</div>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-semibold text-purple-800">Circles Completed</p>
                  <p className="text-sm text-purple-600">
                    Each completion increases your credit score by +15 points
                  </p>
                </div>
                <div className="text-3xl font-bold text-purple-600">{profile.circlesCompleted}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Credit Score Breakdown</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <p className="font-semibold mb-2">Base Credit Score</p>
            <p className="text-gray-600">{BASE_CREDIT_SCORE} points</p>
            <p className="text-sm text-gray-500 mt-1">
              Every address starts with a base credit score of {BASE_CREDIT_SCORE} points.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="font-semibold mb-2">Maximum Credit Score</p>
            <p className="text-gray-600">{MAX_CREDIT_SCORE} points</p>
            <p className="text-sm text-gray-500 mt-1">
              The maximum credit score you can achieve is {MAX_CREDIT_SCORE} points.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="font-semibold mb-2">How Credit Scores Work</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mt-2">
              <li>On-time payment: +10 points</li>
              <li>Late payment: -20 points</li>
              <li>Default: -100 points</li>
              <li>Circle completion: +15 points</li>
            </ul>
          </div>
        </div>
      </div>

      {userCircles && userCircles.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Your Circles</h2>
          <div className="space-y-2">
            {userCircles.map((circleAddress) => (
              <Link
                key={circleAddress}
                href={`/circles/${circleAddress}`}
                className="block p-4 border rounded-lg hover:bg-gray-50 transition"
              >
                <p className="font-mono text-sm">{formatAddress(circleAddress)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

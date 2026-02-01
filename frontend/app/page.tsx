"use client";

import { CreditScoreCard } from "@/components/CreditScoreCard";
import { useAccount } from "wagmi";
import Link from "next/link";

export default function HomePage() {
  const { isConnected } = useAccount();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          CreditCoin Lending Circles
        </h1>
        <p className="text-lg text-gray-600">
          Join lending circles, build credit, and access funds through community voting.
        </p>
      </div>

      {!isConnected && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-blue-700">
            Connect your wallet to view your credit score and start participating in lending circles.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <CreditScoreCard />
        </div>
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/circles"
                className="block w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-center"
              >
                Browse Circles
              </Link>
              {isConnected && (
                <>
                  <Link
                    href="/create"
                    className="block w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-center"
                  >
                    Create Circle
                  </Link>
                  <Link
                    href="/profile"
                    className="block w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-center"
                  >
                    View Profile
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
            <h3 className="font-semibold mb-2">Join a Circle</h3>
            <p className="text-gray-600">
              Browse available lending circles and request to join. Circle coordinators approve participants.
            </p>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
            <h3 className="font-semibold mb-2">Make Contributions</h3>
            <p className="text-gray-600">
              Contribute monthly payments. On-time payments boost your credit score.
            </p>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
            <h3 className="font-semibold mb-2">Vote & Receive</h3>
            <p className="text-gray-600">
              Vote for payout recipients. Your voting power is based on your credit score.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

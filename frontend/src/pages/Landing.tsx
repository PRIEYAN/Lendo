import { useWallet } from "../hooks/useWallet";
import { useCreditScore } from "../hooks/useCredit";
import { CreditScoreCard } from "../components/CreditScoreCard";
import { Link } from "react-router-dom";
import { formatAddress } from "../utils";

export function Landing() {
  const { address, isConnected, isCorrectNetwork } = useWallet();
  const { profile } = useCreditScore();

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">CreditCoin Lending Circle</h1>
          <p className="text-gray-600 mb-8">
            Join lending circles, build credit, and access funds through community-based lending.
          </p>
          <p className="text-lg text-gray-500">Connect your wallet to get started</p>
        </div>
      </div>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Wrong Network</h2>
          <p className="text-yellow-700">Please switch to CreditCoin Testnet to continue.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Lending Circle</h1>
        <p className="text-gray-600 mb-4">Wallet: <span className="font-mono">{formatAddress(address || "")}</span></p>
      </div>

      <div className="mb-8">
        <CreditScoreCard />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/create"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Create Circle</h2>
          <p className="text-gray-600">Start a new lending circle</p>
        </Link>

        <Link
          to="/circles"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Browse Circles</h2>
          <p className="text-gray-600">Find and join existing circles</p>
        </Link>
      </div>

      {profile && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Circles Joined</p>
              <p className="text-2xl font-bold">{profile.circlesJoined.toString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Circles Completed</p>
              <p className="text-2xl font-bold">{profile.circlesCompleted.toString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">On-Time Payments</p>
              <p className="text-2xl font-bold">{profile.onTimePayments.toString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Defaults</p>
              <p className="text-2xl font-bold text-red-600">{profile.defaults.toString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

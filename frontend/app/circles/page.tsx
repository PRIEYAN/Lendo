"use client";

import { useAllCircles, useCircleDetails } from "@/lib/hooks/useLendingCircles";
import { useAccount } from "wagmi";
import Link from "next/link";
import { getCircleStatus, getStatusColor } from "@/lib/utils";

export default function CirclesPage() {
  const circles = useAllCircles();
  const { isConnected } = useAccount();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Browse Lending Circles</h1>
        {isConnected && (
          <Link
            href="/create"
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Create Circle
          </Link>
        )}
      </div>

      {circles.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg">No circles found. Be the first to create one!</p>
          {isConnected && (
            <Link
              href="/create"
              className="inline-block mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Create Circle
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {circles.map((circleAddress) => (
            <CircleCard key={circleAddress} circleAddress={circleAddress as `0x${string}`} />
          ))}
        </div>
      )}
    </div>
  );
}

function CircleCard({ circleAddress }: { circleAddress: `0x${string}` }) {
  const { data: details, isLoading } = useCircleDetails(circleAddress);

  if (isLoading || !details) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-900">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">Circle</h3>
        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(details.status)}`}>
          {getCircleStatus(details.status)}
        </span>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Monthly Contribution:</span>
          <span className="font-semibold text-gray-900">{details.monthlyContribution} CC</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Duration:</span>
          <span className="font-semibold text-gray-900">{details.durationInMonths} months</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Participants:</span>
          <span className="font-semibold text-gray-900">
            {details.totalParticipants} / {details.maxParticipants}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Current Month:</span>
          <span className="font-semibold text-gray-900">{details.currentMonth + 1} / {details.durationInMonths}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Pool Balance:</span>
          <span className="font-semibold text-gray-900">{details.poolBalance} CC</span>
        </div>
      </div>

      <Link
        href={`/circles/${circleAddress}`}
        className="block w-full text-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        View Details
      </Link>
    </div>
  );
}

import { useLendingCircles } from "../hooks/useCircle";
import { Link } from "react-router-dom";
import { formatAddress, formatEther, getCircleStatus, getStatusColor } from "../utils";
import { useCircleData } from "../hooks/useCircle";
import { Address } from "viem";

export function Circles() {
  const { circles, refetch } = useLendingCircles();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Browse Lending Circles</h1>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {circles.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No circles found. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {circles.map((address) => (
            <CircleCard key={address} address={address as Address} />
          ))}
        </div>
      )}
    </div>
  );
}

function CircleCard({ address }: { address: Address }) {
  const data = useCircleData(address);

  return (
    <Link
      to={`/circle/${address}`}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg">Circle</h3>
        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(data.status as number)}`}>
          {getCircleStatus(data.status as number)}
        </span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Contribution:</span>
          <span className="font-semibold">{formatEther(data.monthlyContribution as bigint)} tCTC</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Duration:</span>
          <span className="font-semibold">{data.durationInMonths.toString()} months</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Participants:</span>
          <span className="font-semibold">
            {data.totalParticipants.toString()} / {data.maxParticipants.toString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Current Month:</span>
          <span className="font-semibold">{data.currentMonth.toString()}</span>
        </div>
        <div className="pt-2 border-t">
          <p className="text-xs text-gray-500 font-mono">{formatAddress(address)}</p>
        </div>
      </div>
    </Link>
  );
}

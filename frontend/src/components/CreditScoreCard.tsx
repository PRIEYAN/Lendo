import { useCreditScore } from "../hooks/useCredit";

export function CreditScoreCard({ address }: { address?: string }) {
  const { creditScore, profile } = useCreditScore(address);

  const score = Number(creditScore);
  const maxScore = 1000;
  const percentage = (score / maxScore) * 100;

  const getScoreColor = () => {
    if (score >= 800) return "text-green-600";
    if (score >= 600) return "text-blue-600";
    if (score >= 400) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Credit Score</h3>
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-4xl font-bold ${getScoreColor()}`}>{score}</span>
            <span className="text-gray-500">/ {maxScore}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                score >= 800 ? "bg-green-600" : score >= 600 ? "bg-blue-600" : score >= 400 ? "bg-yellow-600" : "bg-red-600"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
      {profile && (
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Circles Joined:</span>
            <span className="ml-2 font-semibold">{profile.circlesJoined.toString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Circles Completed:</span>
            <span className="ml-2 font-semibold">{profile.circlesCompleted.toString()}</span>
          </div>
          <div>
            <span className="text-gray-600">On-Time Payments:</span>
            <span className="ml-2 font-semibold">{profile.onTimePayments.toString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Late Payments:</span>
            <span className="ml-2 font-semibold">{profile.latePayments.toString()}</span>
          </div>
          <div>
            <span className="text-gray-600">Defaults:</span>
            <span className="ml-2 font-semibold">{profile.defaults.toString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

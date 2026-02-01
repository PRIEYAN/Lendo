import { useCreditScore } from "../hooks/useCredit";
import { CreditScoreCard } from "../components/CreditScoreCard";

export function CreditProfile() {
  const { profile } = useCreditScore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Credit Profile</h1>

      <div className="mb-6">
        <CreditScoreCard />
      </div>

      {profile && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Credit History</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Circles Joined</p>
                <p className="text-2xl font-bold">{profile.circlesJoined.toString()}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Circles Completed</p>
                <p className="text-2xl font-bold">{profile.circlesCompleted.toString()}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">On-Time Payments</p>
                <p className="text-2xl font-bold">{profile.onTimePayments.toString()}</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600">Late Payments</p>
                <p className="text-2xl font-bold">{profile.latePayments.toString()}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-600">Defaults</p>
                <p className="text-2xl font-bold text-red-600">{profile.defaults.toString()}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Has Defaulted</p>
                <p className="text-2xl font-bold">{profile.hasDefaulted ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">How Credit Score Works</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <p className="font-semibold">Base Score:</p>
            <p>Everyone starts with a base credit score of 300.</p>
          </div>
          <div>
            <p className="font-semibold">Improves Credit:</p>
            <ul className="list-disc list-inside ml-2">
              <li>On-time payments (+10 points each)</li>
              <li>Completing circles (+15 points each)</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Reduces Credit:</p>
            <ul className="list-disc list-inside ml-2">
              <li>Late payments (-20 points each)</li>
              <li>Defaults (-100 points each)</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Credit Range:</p>
            <p>Credit scores range from 0 to 1000.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

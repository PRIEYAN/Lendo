import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useCreditScore } from "../hooks/useCredit";
import { CONTRACT_ADDRESSES } from "../contracts/addresses";
import { LendingCircleFactoryABI } from "../abi/LendingCircleFactory";
import { TransactionButton } from "../components/TransactionButton";
import { parseEther } from "../utils";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function CreateCircle() {
  const { creditScore } = useCreditScore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    monthlyContribution: "",
    durationInMonths: "",
    minParticipants: "",
    maxParticipants: "",
    reservePercentage: "",
    excessDistributionMethod: "0", // 0 = WITHDRAWABLE, 1 = AUTO_DEDUCT
  });

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.monthlyContribution || parseFloat(formData.monthlyContribution) <= 0) {
      toast.error("Monthly contribution must be a positive number");
      return;
    }

    try {
      const monthlyContribution = parseEther(formData.monthlyContribution);
      const durationInMonths = BigInt(formData.durationInMonths);
      const minParticipants = BigInt(formData.minParticipants);
      const maxParticipants = BigInt(formData.maxParticipants);
      const reservePercentage = BigInt(formData.reservePercentage);
      const excessDistributionMethod = BigInt(formData.excessDistributionMethod);

      writeContract({
        address: CONTRACT_ADDRESSES.factory,
        abi: LendingCircleFactoryABI,
        functionName: "createCircle",
        args: [
          monthlyContribution,
          durationInMonths,
          minParticipants,
          maxParticipants,
          reservePercentage,
          excessDistributionMethod,
        ],
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to create circle");
    }
  };

  if (isConfirmed) {
    toast.success("Circle created successfully!");
    navigate("/circles");
  }

  if (error) {
    toast.error(`Transaction failed: ${error.message}`);
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create Lending Circle</h1>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          Your Credit Score: <span className="font-semibold">{creditScore.toString()}</span>
        </p>
        <p className="text-xs text-blue-700 mt-1">
          Your credit score determines the maximum contribution and participants you can set.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Contribution (tCTC)
          </label>
          <input
            type="number"
            step="0.0001"
            min="0"
            value={formData.monthlyContribution}
            onChange={(e) => setFormData({ ...formData, monthlyContribution: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (Months)
          </label>
          <input
            type="number"
            min="2"
            value={formData.durationInMonths}
            onChange={(e) => setFormData({ ...formData, durationInMonths: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minimum Participants
          </label>
          <input
            type="number"
            min="2"
            value={formData.minParticipants}
            onChange={(e) => setFormData({ ...formData, minParticipants: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Participants
          </label>
          <input
            type="number"
            min={formData.minParticipants || "2"}
            value={formData.maxParticipants}
            onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reserve Percentage (0-100)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={formData.reservePercentage}
            onChange={(e) => setFormData({ ...formData, reservePercentage: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Excess Distribution Method
          </label>
          <select
            value={formData.excessDistributionMethod}
            onChange={(e) => setFormData({ ...formData, excessDistributionMethod: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="0">Withdrawable Balance</option>
            <option value="1">Auto-Deduct from Next Month</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isPending || isConfirming}
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isPending || isConfirming ? "Creating..." : "Create Circle"}
        </button>
      </form>
    </div>
  );
}

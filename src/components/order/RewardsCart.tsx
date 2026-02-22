"use client";

import { useEffect, useState } from "react";
import { Gift, RefreshCw } from "lucide-react";
import axiosInstance from "@/utils/axios";
import { getRewardLabel } from "@/utils/rewardLabel";

interface RequiredTier {
  id: number;
  level: number;
  name: string;
}

interface Reward {
  id: number;
  point_cost: number;
  type: string;
  discountType: string | null;
  discountValue: string | null;
  productName: string | null;
  requiredTier: RequiredTier | null;
  can_claim: boolean;
}

interface RewardsCartProps {
  merchantId: number | null;
  userId: number | null;
  selectedRewardId: number | null;
  onSelect: (id: number | null) => void;
}

export default function RewardsCart({ merchantId, userId, selectedRewardId, onSelect }: RewardsCartProps) {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchRewards = () => {
    if (!merchantId || !userId) return;
    setLoading(true);
    setError(false);
    axiosInstance
      .get(`/user/merchant/rewards`, { params: { merchant_id: merchantId, user_id: userId } })
      .then((res) => {
        setRewards(res.data.data ?? []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRewards();
  }, [merchantId, userId]);

  const handleSelect = (reward: Reward) => {
    if (!reward.can_claim) return;
    onSelect(selectedRewardId === reward.id ? null : reward.id);
  };

  return (
    <div className="bg-[#0A0E2A] border border-[#1e2a4a] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Gift size={18} className="text-[#2979FF]" />
        <h2 className="text-base font-semibold text-white">Rewards</h2>
        {selectedRewardId !== null && (
          <span className="ml-auto flex items-center gap-1.5 text-xs text-[#2979FF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2979FF]" />
            Selected
          </span>
        )}
      </div>

      {loading && (
        <div className="space-y-2 animate-pulse">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-11 rounded-lg bg-[#0d1231] border border-[#1e2a4a]" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
          <p className="text-sm text-gray-400">Failed to load rewards.</p>
          <button
            onClick={fetchRewards}
            className="flex items-center gap-1.5 text-xs text-[#2979FF] hover:underline cursor-pointer"
          >
            <RefreshCw size={13} />
            Retry
          </button>
        </div>
      )}

      {!loading && !error && rewards.length === 0 && (
        <div className="flex items-center justify-center py-6 min-h-20">
          <p className="text-sm text-gray-500">No rewards available right now.</p>
        </div>
      )}

      {!loading && !error && rewards.length > 0 && (
        <div className="space-y-2">
          {rewards.map((reward) => {
            const isSelected = selectedRewardId === reward.id;
            const disabled = !reward.can_claim;
            return (
              <button
                key={reward.id}
                onClick={() => handleSelect(reward)}
                disabled={disabled}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border text-left transition-colors duration-150 ${
                  disabled
                    ? "border-[#1e2a4a] bg-[#0d1231] text-gray-600 opacity-50 cursor-not-allowed"
                    : isSelected
                    ? "border-[#2979FF] bg-[#2979FF]/10 text-white cursor-pointer"
                    : "border-[#1e2a4a] bg-[#0d1231] text-gray-300 hover:border-[#2979FF]/50 cursor-pointer"
                }`}
              >
                <span className="font-semibold text-sm">{getRewardLabel(reward)}</span>
                <div className="flex flex-col items-end gap-0.5">
                  {reward.point_cost > 0 && (
                    <span className={`text-xs ${isSelected ? "text-[#2979FF]" : disabled ? "text-gray-600" : "text-gray-500"}`}>
                      {reward.point_cost} pts
                    </span>
                  )}
                  {reward.requiredTier !== null && (
                    <span className={`text-xs ${isSelected ? "text-[#2979FF]" : disabled ? "text-gray-600" : "text-gray-500"}`}>
                      {reward.requiredTier.name} tier
                    </span>
                  )}
                  {reward.point_cost === 0 && reward.requiredTier === null && (
                    <span className={`text-xs ${isSelected ? "text-[#2979FF]" : disabled ? "text-gray-600" : "text-gray-500"}`}>
                      0 pts
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

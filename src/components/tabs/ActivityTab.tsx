"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Gift, RefreshCw } from "lucide-react";
import axiosInstance from "@/utils/axios";
import { getRewardLabel } from "@/utils/rewardLabel";

interface GrantedReward {
  id: number;
  merchant_id: number;
  point_cost: number;
  type: string;
  discountType: string | null;
  discountValue: string | null;
  productName: string | null;
  requiredTierId: number | null;
  createdAt: string;
}

export default function ActivityTab() {
  const router = useRouter();
  const [rewards, setRewards] = useState<GrantedReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchGrantedRewards = () => {
    const raw = Cookies.get("merchant_user");
    if (!raw) {
      router.push("/login");
      return;
    }

    let user: { id?: number; merchant_id?: number } = {};
    try {
      user = JSON.parse(raw);
    } catch {
      router.push("/login");
      return;
    }

    const userId = user?.id;
    const merchantId = user?.merchant_id;

    if (!userId || !merchantId) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError(false);

    axiosInstance
      .get("/user/merchant/granted-rewards", {
        params: { user_id: userId, merchant_id: merchantId },
      })
      .then((res) => {
        setRewards(res.data.data ?? []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGrantedRewards();
  }, []);

  if (loading) {
    return (
      <div className="p-4 space-y-3 animate-pulse font-quantico">
        <div className="h-6 w-32 bg-[#1C1F2D] rounded" />
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-12 rounded-lg bg-[#0A0E2A] border border-[#1e2a4a]"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex flex-col items-center justify-center gap-2 text-center font-quantico min-h-50">
        <p className="text-sm text-gray-400">Failed to load activity.</p>
        <button
          onClick={fetchGrantedRewards}
          className="flex items-center gap-1.5 text-xs text-[#2979FF] hover:underline cursor-pointer"
        >
          <RefreshCw size={13} />
          Retry
        </button>
      </div>
    );
  }

  if (rewards.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center gap-2 text-center font-quantico min-h-50">
        <Gift size={32} className="text-gray-600" />
        <p className="text-sm text-gray-500">No rewards claimed yet.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3 font-quantico">
      <h2 className="text-xl font-semibold">Rewards Claimed</h2>
      <div className="space-y-2">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className="flex items-center gap-3 bg-[#0A0E2A] border border-[#1e2a4a] rounded-lg px-4 py-3"
          >
            <Gift size={16} className="text-[#2979FF] shrink-0" />
            <span className="text-sm text-gray-200">
              {getRewardLabel({
                type: reward.type,
                discountType: reward.discountType,
                discountValue: reward.discountValue,
                productName: reward.productName,
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

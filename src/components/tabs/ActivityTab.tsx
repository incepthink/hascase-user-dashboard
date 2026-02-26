"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Gift, RefreshCw } from "lucide-react";
import client from "@/utils/sdk";
import type { Reward } from "@hashcase/merchant-sdk";
import { getRewardLabel } from "@/utils/rewardLabel";

interface RewardsState {
  claimed: Reward[];
  pending: Reward[];
}

export default function ActivityTab() {
  const router = useRouter();
  const [rewards, setRewards] = useState<RewardsState>({ claimed: [], pending: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchGrantedRewards = async () => {
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

    if (!userId) {
      router.push("/login");
      return;
    }

    setLoading(true);
    setError(false);

    try {
      const data = await client.users.getRewards(userId);
      setRewards({ claimed: data.claimed_rewards, pending: data.pending_rewards });
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
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

  if (rewards.claimed.length === 0 && rewards.pending.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center gap-2 text-center font-quantico min-h-50">
        <Gift size={32} className="text-gray-600" />
        <p className="text-sm text-gray-500">No rewards claimed yet.</p>
      </div>
    );
  }

  const renderReward = (reward: Reward) => (
    <div
      key={reward.id}
      className="flex items-center gap-3 bg-[#0A0E2A] border border-[#1e2a4a] rounded-lg px-4 py-3"
    >
      <Gift size={16} className="text-[#2979FF] shrink-0" />
      <span className="text-sm text-gray-200">
        {getRewardLabel({
          type: reward.type,
          discountType: reward.discountType,
          discountValue: reward.discountValue?.toString(),
          productName: reward.productName,
        })}
      </span>
    </div>
  );

  return (
    <div className="p-4 space-y-5 font-quantico">
      {rewards.claimed.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Rewards Claimed</h2>
          <div className="space-y-2">{rewards.claimed.map(renderReward)}</div>
        </div>
      )}
      {rewards.pending.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Pending Rewards</h2>
          <div className="space-y-2">{rewards.pending.map(renderReward)}</div>
        </div>
      )}
    </div>
  );
}

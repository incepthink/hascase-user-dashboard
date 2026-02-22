"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axiosInstance from "@/utils/axios";

interface PointsData {
  id: number;
  merchant_id: number;
  user_id: number;
  balance: number;
  enrolled_at: string;
  total_points_earned: number;
  total_points_spent: number;
  current_tier: {
    id: number;
    level: number;
    name: string;
    minValue: number;
  } | null;
  points_until_next_tier: number | null;
}

export default function SummaryTab() {
  const router = useRouter();
  const [data, setData] = useState<PointsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"not_enrolled" | "generic" | null>(null);

  const fetchPoints = () => {
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
    setError(null);

    axiosInstance
      .get("/user/merchant/points", {
        params: { user_id: userId, merchant_id: merchantId },
      })
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        if (err?.response?.status === 404) {
          setError("not_enrolled");
        } else {
          setError("generic");
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  if (loading) {
    return (
      <div className="p-4 space-y-4 font-quantico animate-pulse">
        <div className="h-6 w-40 bg-[#1C1F2D] rounded" />
        <div className="bg-[#0A0E2A] border border-[#2D3748] rounded-xl p-5 h-28" />
        <div className="bg-[#0A0E2A] border border-[#2D3748] rounded-xl p-5 h-16" />
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#0A0E2A] border border-[#2D3748] rounded-xl p-5 h-24" />
          <div className="bg-[#0A0E2A] border border-[#2D3748] rounded-xl p-5 h-24" />
        </div>
        <div className="bg-[#0A0E2A] border border-[#2D3748] rounded-xl p-5 h-16" />
      </div>
    );
  }

  if (error === "not_enrolled") {
    return (
      <div className="p-4 flex flex-col items-center justify-center gap-3 text-center font-quantico min-h-[200px]">
        <div className="text-4xl">🎯</div>
        <h3 className="text-lg font-semibold text-white">Not Enrolled</h3>
        <p className="text-gray-400 text-sm max-w-xs">
          You are not enrolled in any loyalty program for this merchant yet.
        </p>
      </div>
    );
  }

  if (error === "generic") {
    return (
      <div className="p-4 flex flex-col items-center justify-center gap-3 text-center font-quantico min-h-[200px]">
        <div className="text-4xl">⚠️</div>
        <h3 className="text-lg font-semibold text-white">Something went wrong</h3>
        <p className="text-gray-400 text-sm mb-2">Failed to load your loyalty summary.</p>
        <button
          onClick={fetchPoints}
          className="bg-[#2979FF] text-white px-5 py-2 rounded text-sm cursor-pointer hover:bg-[#1d5bbf] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const enrolledDate = new Date(data.enrolled_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-4 space-y-4 font-quantico">
      <h2 className="text-xl font-semibold">Loyalty Summary</h2>

      {/* Balance — hero card */}
      <div className="bg-[#0A0E2A] border border-[#2D3748] rounded-xl p-5 flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">Points Balance</p>
          <p className="text-[#2979FF] text-4xl font-bold">
            {data.balance.toLocaleString()}
          </p>
          <p className="text-gray-500 text-xs mt-1">pts available</p>
        </div>
        <div className="text-5xl opacity-20 select-none">⭐</div>
      </div>

      {/* Current Tier */}
      {data.current_tier && (
        <div className="bg-[#0A0E2A] border border-[#2D3748] rounded-xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#2979FF] flex items-center justify-center shrink-0">
              <span className="text-[#2979FF] text-sm font-bold">{data.current_tier.level}</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">{data.current_tier.name}</p>
              <p className="text-gray-400 text-xs">Level {data.current_tier.level}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            {data.points_until_next_tier === null ? (
              <>
                <p className="text-yellow-400 text-sm font-medium">👑 Max Tier</p>
                <p className="text-gray-500 text-xs">Highest level</p>
              </>
            ) : (
              <>
                <p className="text-[#2979FF] text-sm font-medium">
                  {data.points_until_next_tier.toLocaleString()} pts
                </p>
                <p className="text-gray-500 text-xs">until next tier</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Earned & Spent — 2-col grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#0A0E2A] border border-[#2D3748] rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-2">Total Earned</p>
          <p className="text-green-400 text-2xl font-bold">
            {data.total_points_earned.toLocaleString()}
          </p>
          <p className="text-gray-500 text-xs mt-1">pts</p>
        </div>
        <div className="bg-[#0A0E2A] border border-[#2D3748] rounded-xl p-4">
          <p className="text-gray-400 text-xs mb-2">Total Spent</p>
          <p className="text-red-400 text-2xl font-bold">
            {data.total_points_spent.toLocaleString()}
          </p>
          <p className="text-gray-500 text-xs mt-1">pts</p>
        </div>
      </div>

      {/* Member Since */}
      <div className="bg-[#0A0E2A] border border-[#2D3748] rounded-xl p-4 flex items-center gap-3">
        <div className="text-[#2979FF] text-xl">📅</div>
        <div>
          <p className="text-gray-400 text-xs">Member Since</p>
          <p className="text-white text-sm font-medium">{enrolledDate}</p>
        </div>
      </div>
    </div>
  );
}

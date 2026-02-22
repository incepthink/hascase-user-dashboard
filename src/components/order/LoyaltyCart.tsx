"use client";

import { useEffect, useState } from "react";
import { Tag, RefreshCw } from "lucide-react";
import axiosInstance from "@/utils/axios";

interface AvailabilityRule {
  timezone: string;
  start_date?: string | null;
  end_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  available_days?: string[] | null;
}

interface LoyaltyCode {
  id: number;
  code: string;
  value: number;
  type: string;
  is_active: boolean;
  availabilityRule: AvailabilityRule | null;
}

function isCodeAvailableNow(
  availabilityRule: AvailabilityRule | null,
): boolean {
  if (!availabilityRule) return true;

  const now = new Date();
  const tzNow = new Date(
    now.toLocaleString("en-US", { timeZone: availabilityRule.timezone }),
  );

  if (availabilityRule.start_date) {
    if (tzNow < new Date(availabilityRule.start_date)) return false;
  }
  if (availabilityRule.end_date) {
    const end = new Date(availabilityRule.end_date);
    end.setHours(23, 59, 59, 999);
    if (tzNow > end) return false;
  }

  const currentTime = tzNow.toTimeString().slice(0, 5);
  if (availabilityRule.start_time && currentTime < availabilityRule.start_time)
    return false;
  if (availabilityRule.end_time && currentTime > availabilityRule.end_time)
    return false;

  if (
    availabilityRule.available_days &&
    availabilityRule.available_days.length > 0
  ) {
    const dayNames = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const todayName = dayNames[tzNow.getDay()];
    if (!availabilityRule.available_days.includes(todayName)) return false;
  }

  return true;
}

interface LoyaltyCartProps {
  merchantId: number | null;
  selectedLoyaltyId: number | null;
  onSelect: (id: number | null) => void;
}

export default function LoyaltyCart({
  merchantId,
  selectedLoyaltyId,
  onSelect,
}: LoyaltyCartProps) {
  const [codes, setCodes] = useState<LoyaltyCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchCodes = () => {
    if (!merchantId) return;
    setLoading(true);
    setError(false);
    axiosInstance
      .get(`/user/merchant/codes/${merchantId}`)
      .then((res) => {
        const all: LoyaltyCode[] = res.data.loyalties ?? [];
        const available = all.filter(
          (l) => l.is_active && isCodeAvailableNow(l.availabilityRule ?? null),
        );
        setCodes(available);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCodes();
  }, [merchantId]);

  const handleSelect = (id: number) => {
    onSelect(selectedLoyaltyId === id ? null : id);
  };

  return (
    <div className="bg-[#0A0E2A] border border-[#1e2a4a] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Tag size={18} className="text-[#2979FF]" />
        <h2 className="text-base font-semibold text-white">Loyalty Code</h2>
        {selectedLoyaltyId !== null && (
          <span className="ml-auto flex items-center gap-1.5 text-xs text-[#2979FF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2979FF]" />
            Selected
          </span>
        )}
      </div>

      {loading && (
        <div className="space-y-2 animate-pulse">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-11 rounded-lg bg-[#0d1231] border border-[#1e2a4a]"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
          <p className="text-sm text-gray-400">Failed to load loyalty codes.</p>
          <button
            onClick={fetchCodes}
            className="flex items-center gap-1.5 text-xs text-[#2979FF] hover:underline cursor-pointer"
          >
            <RefreshCw size={13} />
            Retry
          </button>
        </div>
      )}

      {!loading && !error && codes.length === 0 && (
        <div className="flex items-center justify-center py-6 min-h-[80px]">
          <p className="text-sm text-gray-500">
            No loyalty codes available right now.
          </p>
        </div>
      )}

      {!loading && !error && codes.length > 0 && (
        <div className="space-y-2">
          {codes.map((code) => {
            const isSelected = selectedLoyaltyId === code.id;
            return (
              <button
                key={code.id}
                onClick={() => handleSelect(code.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg border text-left transition-colors duration-150 cursor-pointer ${
                  isSelected
                    ? "border-[#2979FF] bg-[#2979FF]/10 text-white"
                    : "border-[#1e2a4a] bg-[#0d1231] text-gray-300 hover:border-[#2979FF]/50"
                }`}
              >
                <span className="font-mono font-semibold text-sm tracking-wide">
                  {code.code}
                </span>
                <span
                  className={`text-xs ${isSelected ? "text-[#2979FF]" : "text-gray-500"}`}
                >
                  {code.value} {code.type === "points" ? "pts" : code.type}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

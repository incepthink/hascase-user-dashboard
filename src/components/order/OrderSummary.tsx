"use client";

import { ShoppingCart, Loader2 } from "lucide-react";

interface OrderSummaryProps {
  userId: number | null;
  merchantId: number | null;
  selectedLoyaltyId: number | null;
  selectedRewardId: number | null;
  onSubmit: () => void;
  submitting: boolean;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#1e2a4a] last:border-0">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-sm text-white font-medium">{value}</span>
    </div>
  );
}

export default function OrderSummary({
  userId,
  merchantId,
  selectedLoyaltyId,
  selectedRewardId,
  onSubmit,
  submitting,
}: OrderSummaryProps) {
  const isReady = userId !== null && merchantId !== null;

  return (
    <div className="bg-[#0A0E2A] border border-[#1e2a4a] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart size={18} className="text-[#2979FF]" />
        <h2 className="text-base font-semibold text-white">Order Summary</h2>
      </div>

      <div className="mb-5">
        <SummaryRow label="User ID" value={userId !== null ? String(userId) : "—"} />
        <SummaryRow label="Merchant ID" value={merchantId !== null ? String(merchantId) : "—"} />
        <SummaryRow
          label="Loyalty Program"
          value={selectedLoyaltyId !== null ? `#${selectedLoyaltyId}` : "None"}
        />
        <SummaryRow
          label="Reward"
          value={selectedRewardId !== null ? `#${selectedRewardId}` : "None"}
        />
        <SummaryRow label="Status" value="Pending" />
      </div>

      <button
        onClick={onSubmit}
        disabled={!isReady || submitting}
        className="w-full bg-[#2979FF] hover:bg-[#1d5bbf] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Creating Order...</span>
          </>
        ) : (
          <>
            <ShoppingCart size={18} />
            <span>Submit Order</span>
          </>
        )}
      </button>
    </div>
  );
}

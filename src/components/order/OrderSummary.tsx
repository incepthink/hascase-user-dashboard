"use client";

import { ShoppingCart, Loader2 } from "lucide-react";

interface OrderSummaryProps {
  userId: number | null;
  merchantId: number | null;
  selectedLoyaltyId: number | null;
  selectedRewardId: number | null;
  selectedLoyaltyCode: string | null;
  selectedRewardLabel: string | null;
  onSubmit: () => void;
  submitting: boolean;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#1e2a4a] last:border-0">
      <span className="text-md text-gray-400">{label}</span>
      <span className="text-md text-white font-medium max-w-50 truncate" title={value}>{value}</span>
    </div>
  );
}

export default function OrderSummary({
  userId,
  merchantId,
  selectedLoyaltyId,
  selectedRewardId,
  selectedLoyaltyCode,
  selectedRewardLabel,
  onSubmit,
  submitting,
}: OrderSummaryProps) {
  const isReady = userId !== null && merchantId !== null;

  return (
    <div>
      <div className="flex items-center gap-2 mt-8 mb-6">
        <ShoppingCart size={24} className="text-[#2979FF]" />
        <h2 className="text-2xl font-semibold text-white">Order Summary</h2>
      </div>

      <div className="mb-5">
        {/* <SummaryRow
          label="User ID"
          value={userId !== null ? String(userId) : "—"}
        />
        <SummaryRow
          label="Merchant ID"
          value={merchantId !== null ? String(merchantId) : "—"}
        /> */}
        <SummaryRow
          label="Loyalty Code"
          value={selectedLoyaltyCode ?? (selectedLoyaltyId !== null ? `#${selectedLoyaltyId}` : "None")}
        />
        <SummaryRow
          label="Reward"
          value={selectedRewardLabel ?? (selectedRewardId !== null ? `#${selectedRewardId}` : "None")}
        />
        {/* <SummaryRow label="Status" value="Pending" /> */}
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

"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axiosInstance from "@/utils/axios";
import notify from "@/utils/notify";
import OrderHeader from "@/components/order/OrderHeader";
import LoyaltyCart from "@/components/order/LoyaltyCart";
import RewardsCart from "@/components/order/RewardsCart";
import OrderSummary from "@/components/order/OrderSummary";

interface OrderState {
  user_id: number | null;
  merchant_id: number | null;
  selected_loyalty_id: number | null;
  selected_reward_id: number | null;
}

export default function OrderPage() {
  const router = useRouter();
  const [order, setOrder] = useState<OrderState>({
    user_id: null,
    merchant_id: null,
    selected_loyalty_id: null,
    selected_reward_id: null,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
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

    if (!user.id || !user.merchant_id) {
      router.push("/login");
      return;
    }

    setOrder((prev) => ({
      ...prev,
      user_id: user.id!,
      merchant_id: user.merchant_id!,
    }));
  }, [router]);

  const [selectedLoyaltyCode, setSelectedLoyaltyCode] = useState<string | null>(null);
  const [selectedRewardLabel, setSelectedRewardLabel] = useState<string | null>(null);

  const handleLoyaltySelect = useCallback((id: number | null, code: string | null) => {
    setOrder((prev) => ({ ...prev, selected_loyalty_id: id }));
    setSelectedLoyaltyCode(code);
  }, []);

  const handleRewardSelect = useCallback((id: number | null, label: string | null) => {
    setOrder((prev) => ({ ...prev, selected_reward_id: id }));
    setSelectedRewardLabel(label);
  }, []);

  const handleSubmit = async () => {
    if (!order.user_id || !order.merchant_id) return;
    setSubmitting(true);
    try {
      const response = await axiosInstance.post("/user/merchant/order/create", {
        user_id: order.user_id,
        merchant_id: order.merchant_id,
        selected_loyalty_id: order.selected_loyalty_id,
        selected_reward_id: order.selected_reward_id,
        status: "pending",
      });
      const orderId = response.data.data.id;
      notify("Order created successfully!", "success");
      router.push(`/order/status/${orderId}`);
    } catch {
      notify("Failed to create order. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-5 px-4 pb-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <OrderHeader />
        <LoyaltyCart
          merchantId={order.merchant_id}
          selectedLoyaltyId={order.selected_loyalty_id}
          onSelect={handleLoyaltySelect}
        />
        <RewardsCart
          merchantId={order.merchant_id}
          userId={order.user_id}
          selectedRewardId={order.selected_reward_id}
          onSelect={handleRewardSelect}
        />
        <OrderSummary
          userId={order.user_id}
          merchantId={order.merchant_id}
          selectedLoyaltyId={order.selected_loyalty_id}
          selectedRewardId={order.selected_reward_id}
          selectedLoyaltyCode={selectedLoyaltyCode}
          selectedRewardLabel={selectedRewardLabel}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </div>
    </div>
  );
}

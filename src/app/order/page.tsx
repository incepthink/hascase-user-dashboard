"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axiosInstance from "@/utils/axios";
import notify from "@/utils/notify";
import OrderHeader from "@/components/order/OrderHeader";
import LoyaltyCart from "@/components/order/LoyaltyCart";
import RewardsCart from "@/components/order/RewardsCart";
import PaymentMethod, { PaymentMethodData } from "@/components/order/PymentMethod";
import OrderSummary from "@/components/order/OrderSummary";
import type { RewardDiscount } from "@/components/order/RewardsCart";

interface OrderState {
  user_id: number | null;
  merchant_id: number | null;
  selected_loyalty_id: number | null;
  selected_reward_id: number | null;
}

function computeDiscountedAmount(billAmount: number, discount: RewardDiscount): number | null {
  if (discount.type !== "DISCOUNT_ON_TOTAL" || !discount.discountValue) return null;
  const val = parseFloat(discount.discountValue);
  if (isNaN(val)) return null;
  if (discount.discountType === "PERCENTAGE") return Math.max(0, billAmount * (1 - val / 100));
  if (discount.discountType === "FIXED_AMOUNT") return Math.max(0, billAmount - val);
  return null;
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
  const [paymentData, setPaymentData] = useState<PaymentMethodData>(null);

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
  const [selectedRewardDiscount, setSelectedRewardDiscount] = useState<RewardDiscount | null>(null);

  const handleLoyaltySelect = useCallback((id: number | null, code: string | null) => {
    setOrder((prev) => ({ ...prev, selected_loyalty_id: id }));
    setSelectedLoyaltyCode(code);
  }, []);

  const handleRewardSelect = useCallback((id: number | null, label: string | null, discount: RewardDiscount | null) => {
    setOrder((prev) => ({ ...prev, selected_reward_id: id }));
    setSelectedRewardLabel(label);
    setSelectedRewardDiscount(discount);
  }, []);

  const handlePaymentChange = useCallback((data: PaymentMethodData) => {
    setPaymentData(data);
  }, []);

  const handleSubmit = async () => {
    if (!order.user_id || !order.merchant_id || !paymentData) return;
    setSubmitting(true);
    const { bill_amount, ...paymentMethod } = paymentData;
    const discounted = selectedRewardDiscount
      ? computeDiscountedAmount(bill_amount, selectedRewardDiscount)
      : null;
    const finalBillAmount = discounted ?? bill_amount;
    try {
      const response = await axiosInstance.post("/user/merchant/order/create", {
        user_id: order.user_id,
        merchant_id: order.merchant_id,
        bill_amount: finalBillAmount,
        payment_method: paymentMethod,
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
        <PaymentMethod onChange={handlePaymentChange} />
        <OrderSummary
          userId={order.user_id}
          merchantId={order.merchant_id}
          billAmount={paymentData?.bill_amount ?? null}
          selectedLoyaltyId={order.selected_loyalty_id}
          selectedRewardId={order.selected_reward_id}
          selectedLoyaltyCode={selectedLoyaltyCode}
          selectedRewardLabel={selectedRewardLabel}
          paymentType={paymentData?.type ?? null}
          discountedBillAmount={
            paymentData && selectedRewardDiscount
              ? computeDiscountedAmount(paymentData.bill_amount, selectedRewardDiscount)
              : null
          }
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </div>
    </div>
  );
}

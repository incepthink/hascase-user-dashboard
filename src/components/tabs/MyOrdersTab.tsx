"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axiosInstance from "@/utils/axios";

interface Order {
  id: number;
  status: string;
  createdAt: string;
  loyalty: {
    code: string;
    value: number;
    type: string;
  } | null;
  reward: {
    point_cost: number;
    discountType: string;
    discountValue: string;
    productName: string;
  } | null;
}

export default function MyOrdersTab() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"generic" | null>(null);

  const fetchOrders = () => {
    const raw = Cookies.get("merchant_user");
    if (!raw) { router.push("/login"); return; }

    let user: { id?: number; merchant_id?: number } = {};
    try { user = JSON.parse(raw); } catch { router.push("/login"); return; }

    const userId = user?.id;
    const merchantId = user?.merchant_id;
    if (!userId || !merchantId) { router.push("/login"); return; }

    setLoading(true);
    setError(null);

    axiosInstance
      .get(`/user/merchant/orders/${merchantId}/${userId}`)
      .then((res) => setOrders(res.data.data ?? res.data))
      .catch(() => setError("generic"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  if (loading) {
    return (
      <div className="p-4 space-y-3 font-quantico animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#0A0E2A] border border-[#2D3748] rounded-xl h-16" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex flex-col items-center justify-center gap-3 text-center font-quantico min-h-50">
        <div className="text-4xl">⚠️</div>
        <p className="text-gray-400 text-sm">Failed to load orders.</p>
        <button
          onClick={fetchOrders}
          className="bg-[#2979FF] text-white px-5 py-2 rounded text-sm cursor-pointer hover:bg-[#1d5bbf] transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="p-4 flex flex-col items-center justify-center gap-2 text-center font-quantico min-h-50">
        <div className="text-4xl">🛒</div>
        <p className="text-white font-medium">No orders yet</p>
        <p className="text-gray-400 text-sm">Your order history will appear here.</p>
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    accepted: "text-green-400",
    completed: "text-green-400",
    pending: "text-yellow-400",
    cancelled: "text-red-400",
    processing: "text-blue-400",
  };

  return (
    <div className="p-4 space-y-3 font-quantico">
      <h2 className="text-xl font-semibold">My Orders</h2>

      {orders.map((order) => {
        const date = new Date(order.createdAt).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        });
        const colorClass = statusColor[order.status?.toLowerCase()] ?? "text-gray-400";

        const rewardLabel = order.reward
          ? order.reward.discountType === "PERCENTAGE"
            ? `${order.reward.productName} • ${parseFloat(order.reward.discountValue)}% off`
            : `${order.reward.productName} • ₹${order.reward.discountValue} off`
          : null;

        return (
          <div
            key={order.id}
            className="bg-[#0A0E2A] border border-[#2D3748] rounded-xl px-4 py-3 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="text-white text-sm font-medium">#{order.id}</p>
              <p className="text-gray-500 text-xs">{date}</p>
              {rewardLabel && (
                <p className="text-gray-400 text-xs truncate">{rewardLabel}</p>
              )}
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              <p className={`text-xs capitalize font-medium ${colorClass}`}>{order.status}</p>
              {order.loyalty && (
                <span className="text-[#2979FF] text-xs">+{order.loyalty.value} pts</span>
              )}
              {order.reward && (
                <span className="text-gray-500 text-xs">{order.reward.point_cost} pts spent</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

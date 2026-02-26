"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Home,
  Loader2,
  ShoppingCart,
  User,
  Store,
  Tag,
  Gift,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";
import axiosInstance from "@/utils/axios";
import { getRewardLabel } from "@/utils/rewardLabel";

interface Loyalty {
  id: number;
  owner_id: number | null;
  merchant_id: number;
  code: string;
  value: number;
  type: string;
  availability_rule_id: number | null;
  reset_rule_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Reward {
  id: number;
  owner_id: number | null;
  merchant_id: number;
  point_cost: number;
  type: string;
  discountType: string;
  discountValue: string;
  productName: string | null;
  requiredTierId: number | null;
  createdAt: string;
  updatedAt: string;
}

interface OrderUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface PaymentMethod {
  id: number;
  user_id: number;
  type: string;
  status: string;
  card_number: string | null;
  card_type: string | null;
  network: string | null;
  expiry: string | null;
  upi_id: string | null;
  linked_bank: string | null;
}

interface Order {
  id: number;
  user_id: number;
  merchant_id: number;
  selected_loyalty_id: number | null;
  selected_reward_id: number | null;
  bill_amount: string;
  payment_method_id: number | null;
  createdAt: string;
  updatedAt: string;
  loyalty: Loyalty | null;
  reward: Reward | null;
  user: OrderUser;
  merchant: {
    name: string;
  };
  payment_method: PaymentMethod | null;
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#1e2a4a] last:border-0">
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-sm text-white font-medium">{value}</div>
    </div>
  );
}

export default function OrderStatusPage() {
  const { order_id } = useParams<{ order_id: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch full order once
  useEffect(() => {
    if (!order_id) return;

    axiosInstance
      .get(`/user/merchant/order/${order_id}`)
      .then((res) => {
        const data: Order = res.data?.data ?? res.data;
        setOrder(data);
      })
      .catch(() => {
        setError("Failed to load order details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [order_id]);

  return (
    <div className="min-h-screen pt-24 px-4 pb-10">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header with home button */}
        <div className="flex items-end justify-between">
          <button
            onClick={() => router.push("/?tab=my-orders")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 text-md cursor-pointer"
          >
            <Home size={16} />
            <span>Home</span>
          </button>
          <h1 className="text-4xl font-bold text-white flex items-center gap-2">
            {/* <ShoppingCart size={20} className="text-[#2979FF]" /> */}
            Order Details
          </h1>
          <div className="w-16" /> {/* spacer to center heading */}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-12 h-12 rounded-full border-4 border-[#1e2a4a] border-t-[#2979FF] animate-spin" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-[#0A0E2A] border border-red-500/40 rounded-xl p-5 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Order details */}
        {!loading && order && (
          <>
            {/* Full order details card */}
            <div className="bg-[#0A0E2A] border border-[#1e2a4a] rounded-xl p-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 mb-4">
                  {/* <ShoppingCart size={18} className="text-[#2979FF]" /> */}
                  <h2 className="text-xl font-semibold text-white">
                    #{order.id}
                  </h2>
                </div>
              </div>
              <DetailRow
                icon={<User size={14} />}
                label="Email"
                value={order.user.email}
              />
              <DetailRow
                icon={<Store size={14} />}
                label="Merchant"
                value={order.merchant.name}
              />
              <DetailRow
                icon={<Store size={14} />}
                label="Bill Amount"
                value={
                  order.bill_amount
                    ? `₹${parseFloat(order.bill_amount).toFixed(2)}`
                    : "—"
                }
              />
              <DetailRow
                icon={<Tag size={14} />}
                label="Loyalty Code"
                value={
                  order.loyalty ? (
                    order.loyalty.code
                  ) : (
                    <span className="text-gray-500">None</span>
                  )
                }
              />
              <DetailRow
                icon={<Gift size={14} />}
                label="Reward"
                value={
                  order.reward ? (
                    getRewardLabel(order.reward)
                  ) : (
                    <span className="text-gray-500">None</span>
                  )
                }
              />
              <DetailRow
                icon={<User size={14} />}
                label="Payment Method"
                value={
                  order.payment_method ? (
                    order.payment_method.card_number ? (
                      `${order.payment_method.network?.toUpperCase() ?? order.payment_method.type.toUpperCase()} ${order.payment_method.card_type?.toUpperCase() ?? ""} ••••${order.payment_method.card_number.slice(-4)}`.trim()
                    ) : (
                      `${order.payment_method.network?.toUpperCase() ?? order.payment_method.type.toUpperCase()} ${order.payment_method.upi_id ?? ""}`.trim()
                    )
                  ) : (
                    <span className="text-gray-500">None</span>
                  )
                }
              />
              {order.createdAt && (
                <DetailRow
                  icon={<Clock size={14} />}
                  label="Time"
                  value={new Date(order.createdAt).toLocaleString()}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

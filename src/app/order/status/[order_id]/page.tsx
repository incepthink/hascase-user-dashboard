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

interface Order {
  id: number;
  user_id: number;
  merchant_id: number;
  selected_loyalty_id: number | null;
  selected_reward_id: number | null;
  status: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

function StatusBadge({ status }: { status: string }) {
  const s = status?.toLowerCase();

  if (s === "completed" || s === "success") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/15 text-green-400 text-sm font-medium">
        <CheckCircle2 size={14} />
        {status}
      </span>
    );
  }
  if (s === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/15 text-yellow-400 text-sm font-medium">
        <Clock size={14} />
        {status}
      </span>
    );
  }
  if (s === "failed" || s === "cancelled" || s === "canceled") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 text-red-400 text-sm font-medium">
        <XCircle size={14} />
        {status}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 text-[#2979FF] text-sm font-medium">
      <AlertCircle size={14} />
      {status}
    </span>
  );
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
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch full order once
  useEffect(() => {
    if (!order_id) return;

    axiosInstance
      .get(`/user/merchant/order/${order_id}`)
      .then((res) => {
        const data: Order = res.data?.data ?? res.data;
        setOrder(data);
        setStatus(data.status);
      })
      .catch(() => {
        setError("Failed to load order details.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [order_id]);

  // Poll status every second
  useEffect(() => {
    if (!order_id) return;

    pollRef.current = setInterval(() => {
      axiosInstance
        .get(`/user/merchant/order/${order_id}/poll`)
        .then((res) => {
          const pollData = res.data?.data ?? res.data;
          const newStatus: string = pollData?.status ?? pollData;
          setStatus(newStatus);
        })
        .catch(() => {
          // Silently ignore poll errors
        });
    }, 1000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [order_id]);

  const displayStatus = status ?? order?.status ?? "";

  return (
    <div className="min-h-screen pt-24 px-4 pb-10">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header with home button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm cursor-pointer"
          >
            <Home size={16} />
            <span>Home</span>
          </button>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            {/* <ShoppingCart size={20} className="text-[#2979FF]" /> */}
            Order Status
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
            {/* Status card */}
            <div className="bg-[#0A0E2A] border border-[#1e2a4a] rounded-xl p-5 mt-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Current Status</span>
                {displayStatus ? (
                  <StatusBadge status={displayStatus} />
                ) : (
                  <Loader2 size={16} className="animate-spin text-[#2979FF]" />
                )}
              </div>
            </div>

            {/* Full order details card */}
            <div className="bg-[#0A0E2A] border border-[#1e2a4a] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart size={18} className="text-[#2979FF]" />
                <h2 className="text-base font-semibold text-white">
                  Order Details
                </h2>
              </div>

              <DetailRow
                icon={<Tag size={14} />}
                label="Order ID"
                value={`#${order.id}`}
              />
              <DetailRow
                icon={<User size={14} />}
                label="User ID"
                value={order.user_id}
              />
              <DetailRow
                icon={<Store size={14} />}
                label="Merchant ID"
                value={order.merchant_id}
              />
              <DetailRow
                icon={<Tag size={14} />}
                label="Loyalty Code"
                value={
                  order.selected_loyalty_id != null ? (
                    `#${order.selected_loyalty_id}`
                  ) : (
                    <span className="text-gray-500">None</span>
                  )
                }
              />
              <DetailRow
                icon={<Gift size={14} />}
                label="Reward"
                value={
                  order.selected_reward_id != null ? (
                    `#${order.selected_reward_id}`
                  ) : (
                    <span className="text-gray-500">None</span>
                  )
                }
              />
              {order.created_at && (
                <DetailRow
                  icon={<Clock size={14} />}
                  label="Created At"
                  value={new Date(order.created_at).toLocaleString()}
                />
              )}
              {order.updated_at && (
                <DetailRow
                  icon={<Clock size={14} />}
                  label="Last Updated"
                  value={new Date(order.updated_at).toLocaleString()}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

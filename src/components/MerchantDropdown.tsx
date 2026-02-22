"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";

interface Merchant {
  id: number;
  name: string;
  email: string;
  webhook_url: string | null;
  status: string;
}

interface MerchantDropdownProps {
  value: number | "";
  onChange: (id: number | "") => void;
}

const MerchantDropdown = ({ value, onChange }: MerchantDropdownProps) => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/platform/merchant")
      .then((res) => {
        const all: Merchant[] = res.data.data;
        setMerchants(all.filter((m) => m.status === "active"));
      })
      .catch(() => {
        setMerchants([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChange(val === "" ? "" : Number(val));
  };

  return (
    <div className="space-y-2 w-full">
      <label htmlFor="merchant-select" className="text-lg">
        Select Merchant: <span className="text-red-500">*</span>
      </label>
      <select
        id="merchant-select"
        className="border border-[#2D3748] px-4 py-2 w-full outline-none rounded bg-white"
        value={value}
        onChange={handleChange}
        disabled={loading}
        required
      >
        <option value="">Select Merchant</option>
        {merchants.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MerchantDropdown;

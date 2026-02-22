"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function OrderHeader() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => router.back()}
        className="p-2 rounded-md hover:bg-[#1C1F2D] transition-colors duration-200 text-gray-400 hover:text-white cursor-pointer"
        aria-label="Go back"
      >
        <ArrowLeft size={20} />
      </button>
      <h1 className="text-2xl font-bold text-white">Create Order</h1>
    </div>
  );
}

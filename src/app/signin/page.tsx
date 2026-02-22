"use client";

import React, { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axiosInstance from "@/utils/axios";
import { notifyPromise, notifyResolve } from "@/utils/notify";
import MerchantDropdown from "@/components/MerchantDropdown";

const Signin = () => {
  const router = useRouter();

  const [signinForm, setSigninForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [selectedMerchantId, setSelectedMerchantId] = useState<number | "">(
    "",
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSigninForm((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid =
    signinForm.name &&
    signinForm.email &&
    signinForm.phone &&
    signinForm.password &&
    selectedMerchantId !== "";

  const handleSignin = async () => {
    const notifyId = notifyPromise(
      "Creating account, please hold on...",
      "info",
    );

    try {
      await axiosInstance.post("/auth/merchant/user/signin", {
        name: signinForm.name,
        email: signinForm.email,
        phone: signinForm.phone,
        password: signinForm.password,
        merchant_id: selectedMerchantId,
      });

      notifyResolve(
        notifyId,
        "Account created successfully! Redirecting to login...",
        "success",
      );

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error: any) {
      const status = error?.response?.status;
      const apiMessage = error?.response?.data?.message;
      const message =
        apiMessage ||
        (status === 400 ? "Email or phone already exists" : "Failed to create account");
      notifyResolve(notifyId, message, "error");
    }
  };

  return (
    <div className="flex justify-center items-center gap-4 lg:gap-8 w-full h-screen font-quantico">
      <div className="flex flex-col justify-center items-start gap-4 px-4 w-full lg:w-1/2 h-full">
        <div className="space-y-2 w-full">
          <label htmlFor="name" className="text-lg">
            Name: <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            className="border border-[#2D3748] px-4 py-2 w-full outline-none rounded"
            placeholder="Enter your name..."
            value={signinForm.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2 w-full">
          <label htmlFor="email" className="text-lg">
            Email: <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            className="border border-[#2D3748] px-4 py-2 w-full outline-none rounded"
            placeholder="Enter email..."
            value={signinForm.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2 w-full">
          <label htmlFor="phone" className="text-lg">
            Phone: <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            className="border border-[#2D3748] px-4 py-2 w-full outline-none rounded"
            placeholder="Enter phone number..."
            value={signinForm.phone}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, "");
              setSigninForm((prev) => ({ ...prev, phone: val }));
            }}
            inputMode="numeric"
            required
          />
        </div>

        <div className="space-y-2 w-full">
          <label htmlFor="password" className="text-lg">
            Password: <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            className="border border-[#2D3748] px-4 py-2 w-full outline-none rounded"
            placeholder="Enter password..."
            value={signinForm.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <MerchantDropdown
          value={selectedMerchantId}
          onChange={setSelectedMerchantId}
        />

        <div className="text-sm text-blue-500 flex flex-col">
          <Link href="/login" className="cursor-pointer">
            Already have an account? Login
          </Link>
        </div>

        <div className="flex gap-5 w-full lg:w-1/2">
          <button
            type="button"
            className={`text-[#E6FFFA] text-lg px-6 py-2 rounded w-full transition-colors ${
              isFormValid
                ? "bg-[#2979FF] cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={handleSignin}
            disabled={!isFormValid}
          >
            Create User Account
          </button>
        </div>

        <div className="text-sm text-gray-600 mt-2">
          <span className="text-red-500">*</span> All fields are required
        </div>
      </div>
    </div>
  );
};

export default Signin;

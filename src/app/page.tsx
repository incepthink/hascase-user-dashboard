"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, Tab, Box, Button } from "@mui/material";
import Cookies from "js-cookie";
import SummaryTab from "@/components/tabs/SummaryTab";
import MyOrdersTab from "@/components/tabs/MyOrdersTab";
import ActivityTab from "@/components/tabs/ActivityTab";
import ProfileTab from "@/components/tabs/ProfileTab";
import MerchantDropdown from "@/components/MerchantDropdown";
import axiosInstance from "@/utils/axios";
import { useMerchantStore } from "@/context/merchantStore";

const TABS = [
  { label: "Summary", value: "summary" },
  { label: "My Orders", value: "my-orders" },
  { label: "Rewards", value: "activity" },
  { label: "Profile", value: "profile" },
] as const;

type TabValue = (typeof TABS)[number]["value"];

function TabContent({ tab }: { tab: TabValue }) {
  switch (tab) {
    case "summary":
      return <SummaryTab />;
    case "my-orders":
      return <MyOrdersTab />;
    case "activity":
      return <ActivityTab />;
    case "profile":
      return <ProfileTab />;
  }
}

function TabsLayout() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { merchantId, setMerchantId } = useMerchantStore();

  useEffect(() => {
    // Initialize merchantId from cookie on mount
    const raw = Cookies.get("merchant_user");
    if (!raw) {
      router.push("/login");
      return;
    }
    try {
      const user = JSON.parse(raw);
      if (!user?.id) {
        router.push("/login");
        return;
      }
      if (user.merchant_id) {
        setMerchantId(user.merchant_id);
      }
    } catch {
      router.push("/login");
      return;
    }

    // Fetch merchant list
    axiosInstance
      .get("/platform/merchant")
      .then((res) => {
        const active = res.data.data.filter(
          (m: { status: string }) => m.status === "active",
        );
        // If no merchant selected yet, default to the first active one
        const raw2 = Cookies.get("merchant_user");
        if (raw2) {
          const user2 = JSON.parse(raw2);
          if (!user2.merchant_id && active.length > 0) {
            setMerchantId(active[0].id);
          }
        }
      })
      .catch(() => {});
  }, []);

  const param = searchParams.get("tab") as TabValue | null;
  const activeTab: TabValue = TABS.some((t) => t.value === param)
    ? (param as TabValue)
    : "summary";

  const handleChange = (_: React.SyntheticEvent, value: TabValue) => {
    router.push(`?tab=${value}`);
  };

  const handleLogout = () => {
    Cookies.remove("owner_id");
    Cookies.remove("owner_cap_id");
    Cookies.remove("jwt");
    Cookies.remove("api_key");

    window.location.href = "/login";
  };

  return (
    <Box sx={{ width: "100%", pt: 10 }}>
      <div className="flex justify-between mb-8">
        {/* Merchant selector */}
        <Box>
          <MerchantDropdown
            value={merchantId ?? ""}
            onChange={(id) => {
              if (id !== "") setMerchantId(id);
            }}
          />
        </Box>
        <button
          onClick={handleLogout}
          className="bg-[#2563EB] px-4 py-2 rounded-md"
        >
          LOGOUT
        </button>
      </div>

      <Tabs
        value={activeTab}
        onChange={handleChange}
        sx={{
          borderBottom: "1px solid #1e2a4a",
          "& .MuiTabs-flexContainer": {
            flexWrap: { xs: "wrap", sm: "nowrap" },
          },
          "& .MuiTab-root": {
            flex: { xs: "0 0 50%", sm: 1 },
            color: "#9ca3af",
            textTransform: "none",
            fontSize: "0.95rem",
            "&.Mui-selected": {
              color: "#ffffff",
            },
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "#2979FF",
            display: { xs: "none", sm: "block" },
          },
        }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} />
        ))}
      </Tabs>

      <Box sx={{ pt: 2, minHeight: "400px" }}>
        <TabContent key={merchantId ?? "none"} tab={activeTab} />
      </Box>

      <Box sx={{ pt: 4, pb: 4 }}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={() => router.push("/order")}
          sx={{
            backgroundColor: "#2979FF",
            "&:hover": { backgroundColor: "#1a5fd4" },
            borderRadius: 2,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          Checkout
        </Button>
      </Box>
    </Box>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto">
      <Suspense fallback={null}>
        <TabsLayout />
      </Suspense>
    </div>
  );
}

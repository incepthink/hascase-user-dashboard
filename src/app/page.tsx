"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, Tab, Box, Button } from "@mui/material";
import SummaryTab from "@/components/tabs/SummaryTab";
import MyOrdersTab from "@/components/tabs/MyOrdersTab";
import ActivityTab from "@/components/tabs/ActivityTab";
import ProfileTab from "@/components/tabs/ProfileTab";

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

  const param = searchParams.get("tab") as TabValue | null;
  const activeTab: TabValue = TABS.some((t) => t.value === param)
    ? (param as TabValue)
    : "summary";

  const handleChange = (_: React.SyntheticEvent, value: TabValue) => {
    router.push(`?tab=${value}`);
  };

  return (
    <Box sx={{ width: "100%", pt: 10 }}>
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

      <Box sx={{ pt: 2 }}>
        <TabContent tab={activeTab} />
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
          Create Order
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

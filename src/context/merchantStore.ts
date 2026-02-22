import { create } from "zustand";
import Cookies from "js-cookie";

interface Merchant {
  id: number;
  name: string;
  status: string;
}

interface MerchantStore {
  merchantId: number | null;
  merchantList: Merchant[];
  setMerchantId: (id: number) => void;
  setMerchantList: (list: Merchant[]) => void;
}

export const useMerchantStore = create<MerchantStore>((set) => ({
  merchantId: null,
  merchantList: [],

  setMerchantId: (id: number) => {
    // Update the merchant_user cookie to reflect the new merchant
    const raw = Cookies.get("merchant_user");
    if (raw) {
      try {
        const user = JSON.parse(raw);
        Cookies.set(
          "merchant_user",
          JSON.stringify({ ...user, merchant_id: id }),
          { expires: new Date(Date.now() + 4 * 60 * 60 * 1000) }
        );
      } catch {
        // ignore parse errors
      }
    }
    set({ merchantId: id });
  },

  setMerchantList: (list: Merchant[]) => set({ merchantList: list }),
}));

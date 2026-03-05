import { HashcaseMerchantClient } from "@hashcase/merchant-sdk";

const client = new HashcaseMerchantClient(
  process.env.NEXT_PUBLIC_MERCHANT_API_KEY!,
  // "http://localhost:8000",
);

export default client;

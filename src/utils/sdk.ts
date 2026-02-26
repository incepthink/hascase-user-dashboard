import { HashcaseMerchantClient } from "@hashcase/merchant-sdk";

const client = new HashcaseMerchantClient(process.env.NEXT_PUBLIC_MERCHANT_API_KEY || "");

export default client;
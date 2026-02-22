export interface RewardLabelInput {
  type: string;
  discountType?: string | null;
  discountValue?: string | null;
  productName?: string | null;
}

export function getRewardLabel(reward: RewardLabelInput): string {
  const { type, discountType, discountValue, productName } = reward;
  const value = discountValue ? parseFloat(discountValue) : 0;

  if (type === "DISCOUNT_ON_TOTAL") {
    if (discountType === "PERCENTAGE") {
      return `Get ${value}% Discount on your total bill amount`;
    }
    if (discountType === "FIXED_AMOUNT") {
      return `Get ${value} INR off on your total bill amount`;
    }
  }

  if (type === "DISCOUNT_ON_ITEM") {
    const item = productName ?? "item";
    if (discountType === "PERCENTAGE") {
      return `Get ${value}% Discount on ${item}`;
    }
    if (discountType === "FIXED_AMOUNT") {
      return `Get ${value} INR off on ${item}`;
    }
  }

  if (type === "GENERIC_FREE_PRODUCT") {
    return `Get Free ${productName ?? "Product"}!`;
  }

  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

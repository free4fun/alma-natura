export type CouponRule = {
  code: string;
  percent: number;
  minQty: number;
};

type PricingInput = {
  basePrice: number;
  quantity: number;
  discountPercent?: number | null;
  coupons?: CouponRule[] | null;
  couponCode?: string | null;
};

type PricingResult = {
  unitPrice: number;
  basePrice: number;
  discountPercent: number;
  couponPercent: number;
  subtotal: number;
};

export function calculatePricing({
  basePrice,
  quantity,
  discountPercent,
  coupons,
  couponCode,
}: PricingInput): PricingResult {
  const safeBase = Number(basePrice) || 0;
  const safeQty = Math.max(1, Number(quantity) || 1);
  const baseDiscount = Math.max(0, Math.min(100, Number(discountPercent) || 0));

  let unit = safeBase;
  if (baseDiscount > 0) {
    unit = Math.round(unit * (1 - baseDiscount / 100));
  }

  let couponPercent = 0;
  const normalizedCode = (couponCode || "").trim().toLowerCase();
  if (normalizedCode && Array.isArray(coupons)) {
    const match = coupons.find(
      (rule) =>
        rule.code?.trim().toLowerCase() === normalizedCode &&
        safeQty >= Math.max(1, Number(rule.minQty) || 1)
    );
    if (match) {
      couponPercent = Math.max(0, Math.min(100, Number(match.percent) || 0));
    }
  }

  if (couponPercent > 0) {
    unit = Math.round(unit * (1 - couponPercent / 100));
  }

  const subtotal = unit * safeQty;

  return {
    unitPrice: unit,
    basePrice: safeBase,
    discountPercent: baseDiscount,
    couponPercent,
    subtotal,
  };
}

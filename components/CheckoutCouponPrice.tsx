"use client";

import { useMemo, useState } from "react";
import { calculatePricing, type CouponRule } from "@/lib/pricing";

type CheckoutCouponPriceProps = {
  basePrice: number;
  discountPercent?: number | null;
  coupons?: CouponRule[] | null;
};

export default function CheckoutCouponPrice({
  basePrice,
  discountPercent,
  coupons,
}: CheckoutCouponPriceProps) {
  const [coupon, setCoupon] = useState("");

  const pricing = useMemo(
    () =>
      calculatePricing({
        basePrice,
        quantity: 1,
        discountPercent: discountPercent ?? 0,
        coupons: coupons ?? [],
        couponCode: coupon,
      }),
    [basePrice, discountPercent, coupons, coupon]
  );

  return (
    <div className="mt-4 grid gap-2">
      {pricing.discountPercent || pricing.couponPercent ? (
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-red-500 line-through">
            UYU {pricing.basePrice}
          </p>
          {pricing.discountPercent ? (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              -{pricing.discountPercent}%
            </span>
          ) : null}
          {pricing.couponPercent ? (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              cupón -{pricing.couponPercent}%
            </span>
          ) : null}
        </div>
      ) : null}
      <p className="text-lg font-bold text-black">UYU {pricing.unitPrice}</p>
      <div>
        <label className="text-xs font-semibold text-text/70">
          Cupón (opcional)
        </label>
        <input
          name="coupon"
          className="mt-2 w-full rounded-xl border border-text/10 bg-background px-4 py-2 text-sm"
          placeholder="Código de cupón"
          value={coupon}
          onChange={(event) => setCoupon(event.target.value)}
        />
        {pricing.couponPercent ? (
          <p className="mt-2 text-xs text-text/60">
            Cupón aplicado: -{pricing.couponPercent}%
          </p>
        ) : null}
      </div>
    </div>
  );
}
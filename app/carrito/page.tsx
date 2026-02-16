"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Section from "@/components/Section";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import { useCart } from "@/components/CartProvider";
import { calculatePricing, type CouponRule } from "@/lib/pricing";

export default function CarritoPage() {
  const { items, updateQuantity, updateCoupon, removeItem, clearCart } = useCart();
  const [products, setProducts] = useState<Array<{
    slug: string;
    title: string;
    description: string;
    price: number;
    image: string;
    discountPercent?: number | null;
    coupons?: CouponRule[] | null;
  }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!items.length) {
      setProducts([]);
      setIsLoading(false);
      return;
    }
    const slugs = items.map((item) => item.slug).join(",");
    setIsLoading(true);
    fetch(`/api/products?slugs=${encodeURIComponent(slugs)}`)
      .then(async (res) => {
        if (!res.ok) return [];
        try {
          const data = await res.json();
          return Array.isArray(data) ? data : [];
        } catch {
          return [];
        }
      })
      .then((data) => setProducts(data))
      .finally(() => setIsLoading(false));
  }, [items]);

  const detailedItems = items
    .map((item) => {
      const product = products.find((p) => p.slug === item.slug);
      if (!product) return null;
      const pricing = calculatePricing({
        basePrice: product.price,
        quantity: item.quantity,
        discountPercent: product.discountPercent ?? 0,
        coupons: product.coupons ?? [],
        couponCode: item.couponCode,
      });
      return {
        ...product,
        slug: item.slug,
        quantity: item.quantity,
        couponCode: item.couponCode || "",
        pricing,
      };
    })
    .filter(Boolean);

  const total = detailedItems.reduce(
    (acc, item) => acc + (item ? item.pricing.subtotal : 0),
    0
  );

  return (
    <div>
      <Section title="Carrito" subtitle="Revisá tus elementos antes de pagar.">
        {isLoading ? (
          <div className="rounded-2xl border border-text/10 bg-surface/80 p-6 text-center text-text/70">
            <p>Cargando carrito...</p>
          </div>
        ) : detailedItems.length === 0 ? (
          <div className="rounded-2xl border border-text/10 bg-surface/80 p-6 text-center text-text/70">
            <p>Tu carrito está vacío.</p>
            <Button href="/elementos" className="mt-4">
              Ver elementos
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              {detailedItems.map((item) => (
                <div
                  key={item?.slug}
                  className="flex flex-col gap-4 rounded-2xl border border-text/10 bg-surface/80 p-4 shadow-soft sm:flex-row sm:items-center"
                >
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-text/10 bg-surface sm:w-40">
                    {item?.image ? (
                      <Image
                        src={item.image}
                        alt={item?.title || ""}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-text/50">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-text/60">{item?.title}</p>
                        <p className="mt-1 text-sm text-text/70">
                          {item?.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item?.slug || "")}
                        className="text-sm text-text/50 hover:text-text"
                      >
                        Quitar
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-text/10 bg-background px-3 py-1">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item?.slug || "",
                              Math.max(1, (item?.quantity || 1) - 1)
                            )
                          }
                          className="flex h-6 w-6 items-center justify-center text-text"
                        >
                          −
                        </button>
                        <span className="text-sm font-semibold">
                          {item?.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item?.slug || "",
                              (item?.quantity || 1) + 1
                            )
                          }
                          className="flex h-6 w-6 items-center justify-center text-text"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        {item?.pricing.discountPercent || item?.pricing.couponPercent ? (
                          <div className="flex flex-wrap items-center justify-end gap-2">
                            <p className="text-xs font-semibold text-red-500 line-through">
                              UYU {item?.pricing.basePrice * item?.quantity}
                            </p>
                            {item?.pricing.discountPercent ? (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                -{item.pricing.discountPercent}%
                              </span>
                            ) : null}
                            {item?.pricing.couponPercent ? (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                                cupón -{item.pricing.couponPercent}%
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                        <span className="text-base font-bold text-black">
                          UYU {item?.pricing.subtotal}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 grid gap-2">
                      <label className="text-xs text-text/60">Cupón</label>
                      <input
                        className="w-full rounded-xl border border-text/10 bg-background px-3 py-2 text-sm"
                        placeholder="Código de cupón"
                        value={item?.couponCode || ""}
                        onChange={(event) =>
                          updateCoupon(item?.slug || "", event.target.value)
                        }
                      />
                      {item?.pricing.couponPercent ? (
                        <p className="text-xs text-text/60">
                          Cupón aplicado: -{item?.pricing.couponPercent}%
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-text/10 bg-surface/80 p-6 shadow-soft">
              <p className="text-sm uppercase tracking-[0.2em] text-text/60">
                Resumen
              </p>
              <div className="mt-4 flex items-center justify-between text-sm text-text/70">
                <span>Total</span>
                <span className="text-lg font-semibold text-text">UYU {total}</span>
              </div>
              <Button href="/checkout" className="mt-6 w-full">
                Ir al checkout
              </Button>
              <button
                type="button"
                onClick={clearCart}
                className="mt-4 w-full rounded-full border border-text/20 px-4 py-2 text-sm text-text/70 transition hover:text-text"
              >
                Vaciar carrito
              </button>
              <Link
                href="/elementos"
                className="mt-4 inline-flex items-center gap-2 text-sm text-text/70 transition hover:text-text"
              >
                <Icon name="arrow" className="h-4 w-4" />
                Seguir explorando
              </Link>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Section from "@/components/Section";
import Button from "@/components/Button";
import { useCart } from "@/components/CartProvider";
import { calculatePricing, type CouponRule } from "@/lib/pricing";

export default function CheckoutCartPage() {
  const { items, clearCart } = useCart();
  const [showDownloads, setShowDownloads] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [products, setProducts] = useState<Array<{
    slug: string;
    title: string;
    description: string;
    price: number;
    image: string;
    discountPercent?: number | null;
    coupons?: CouponRule[] | null;
    fileUrl?: string;
    access?: string;
  }>>([]);

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

  const itemsPayload = JSON.stringify(
    detailedItems.map((item) => ({
      slug: item?.slug,
      quantity: item?.quantity,
      couponCode: item?.couponCode || "",
    }))
  );

  return (
    <div>
      <Section
        title="Checkout"
        subtitle="Confirmá tu compra y finalizá con MercadoPago."
      >
        {isLoading ? (
          <div className="rounded-2xl border border-text/10 bg-surface/80 p-6 text-center text-text/70">
            <p>Cargando carrito...</p>
          </div>
        ) : detailedItems.length === 0 ? (
          <div className="rounded-2xl border border-text/10 bg-surface/80 p-6 text-center text-text/70">
            <p>No hay productos en tu carrito.</p>
            <Button href="/elementos" className="mt-4">
              Volver a elementos
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
                    <p className="text-sm font-semibold text-text">
                      {item?.title}
                    </p>
                    <p className="mt-2 text-sm text-text/70">
                      {item?.description}
                    </p>
                    <p className="mt-3 text-sm text-text/70">
                      Cantidad: <strong>{item?.quantity}</strong>
                    </p>
                    {item?.couponCode ? (
                      <p className="mt-2 text-xs text-text/60">
                        Cupón: {item.couponCode}
                      </p>
                    ) : null}
                    {item?.pricing.couponPercent ? (
                      <p className="mt-1 text-xs text-text/60">
                        Cupón aplicado: -{item.pricing.couponPercent}%
                      </p>
                    ) : null}
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
                    <div className="text-base font-bold text-black">
                      UYU {item?.pricing.subtotal}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-text/10 bg-surface/80 p-6 shadow-soft">
              <p className="text-sm uppercase tracking-[0.2em] text-text/60">
                Total a pagar
              </p>
              <p className="mt-4 text-2xl font-semibold text-text">UYU {total}</p>
              <p className="mt-3 text-xs text-text/60">
                Si tu compra incluye objetos físicos, podés coordinar retiro o
                el envío se abona por separado por quien compra.
              </p>
              <form
                ref={formRef}
                className="mt-6 grid gap-4"
                action="/api/checkout-cart"
                method="post"
              >
                <input type="hidden" name="items" value={itemsPayload} readOnly />
                <div className="grid gap-3">
                  <div>
                    <label className="text-xs font-semibold text-text/70">
                      Nombre y apellido
                    </label>
                    <input
                      name="name"
                      required
                      className="mt-2 w-full rounded-xl border border-text/10 bg-background px-4 py-2 text-sm"
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-text/70">
                        Email
                      </label>
                      <input
                        name="email"
                        type="email"
                        required
                        className="mt-2 w-full rounded-xl border border-text/10 bg-background px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-text/70">
                        Teléfono
                      </label>
                      <input
                        name="phone"
                        type="tel"
                        required
                        className="mt-2 w-full rounded-xl border border-text/10 bg-background px-4 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-text/70">
                        Documento
                      </label>
                      <input
                        name="document"
                        required
                        className="mt-2 w-full rounded-xl border border-text/10 bg-background px-4 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-text/70">
                        Ciudad
                      </label>
                      <input
                        name="city"
                        required
                        className="mt-2 w-full rounded-xl border border-text/10 bg-background px-4 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text/70">
                      Dirección
                    </label>
                    <input
                      name="address"
                      required
                      className="mt-2 w-full rounded-xl border border-text/10 bg-background px-4 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text/70">
                      Aclaraciones
                    </label>
                    <textarea
                      name="notes"
                      rows={3}
                      className="mt-2 w-full rounded-xl border border-text/10 bg-background px-4 py-2 text-sm"
                      placeholder="Ej: horarios de retiro, detalles de envío, referencias"
                    />
                  </div>
                </div>
                {total > 0 ? (
                  <Button type="submit" className="w-full">
                    Pagar con MercadoPago
                  </Button>
                ) : (
                  <Button
                    type="button"
                    className="w-full"
                    onClick={async () => {
                      if (!formRef.current?.reportValidity()) return;
                      const formData = new FormData(formRef.current);
                      let items: Array<{ slug: string; quantity: number }> = [];
                      try {
                        const trimmed = (itemsPayload || "").trim();
                        items = trimmed ? JSON.parse(trimmed) : [];
                      } catch (error) {
                        setIsRecording(false);
                        return;
                      }
                      const payload = {
                        name: String(formData.get("name") || ""),
                        email: String(formData.get("email") || ""),
                        items,
                      };
                      setIsRecording(true);
                      const response = await fetch("/api/downloads/record", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                      });
                      setIsRecording(false);
                      if (response.ok) {
                        setShowDownloads(true);
                      }
                    }}
                  >
                    {isRecording ? "Registrando..." : "Confirmar y descargar"}
                  </Button>
                )}
              </form>
              {showDownloads && total === 0 && (
                <div className="mt-6 rounded-2xl border border-text/10 bg-background p-4 text-sm text-text/80">
                  <p className="font-semibold">Descargas disponibles</p>
                  <ul className="mt-3 space-y-2">
                    {detailedItems.map((item) => {
                      const fileUrl = item?.fileUrl;
                      if (!fileUrl) return null;
                      return (
                        <li key={item?.slug}>
                          <a
                            href={fileUrl}
                            className="text-accent2 hover:text-accent1"
                          >
                            {item?.title}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="mt-4 w-full rounded-full border border-text/20 px-4 py-2 text-xs text-text/70 transition hover:text-text"
                  >
                    Finalizar y vaciar carrito
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={clearCart}
                className="mt-4 w-full rounded-full border border-text/20 px-4 py-2 text-sm text-text/70 transition hover:text-text"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}

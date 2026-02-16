"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { checkoutCatalog } from "@/lib/content";

export default function CartToast() {
  const { lastAddedSlug, noticeVisible } = useCart();

  if (!noticeVisible || !lastAddedSlug) return null;

  const item = checkoutCatalog[lastAddedSlug as keyof typeof checkoutCatalog];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-[260px] rounded-2xl border border-text/10 bg-surface/95 p-4 text-sm text-text shadow-soft">
      <p className="font-semibold">Agregado al carrito</p>
      <p className="mt-1 text-text/70">{item?.title}</p>
      <Link
        href="/carrito"
        className="mt-3 inline-flex text-sm font-semibold text-accent2 hover:text-accent1"
      >
        Ver carrito
      </Link>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Icon from "@/components/Icon";
import Section from "@/components/Section";
import { useCart } from "@/components/CartProvider";

type DownloadData = {
  slug: string;
  title: string;
  description: string;
  details?: string | null;
  highlights?: string[];
  access: string;
  price: number;
  discountPercent?: number | null;
  image?: string | null;
};

export default function DescargableDetallePage() {
  const params = useParams<{ slug: string }>();
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  const [data, setData] = useState<DownloadData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/descargables/${encodeURIComponent(slug)}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((item) => {
        if (!cancelled) setData(item);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <Section title="Descargable" subtitle="Cargando detalle...">
        <p className="text-sm text-text/70">Cargando...</p>
      </Section>
    );
  }

  if (!data) {
    return (
      <Section title="Descargable" subtitle="No encontrado">
        <p className="text-sm text-text/70">No se encontró el descargable.</p>
        <Link
          href="/descargables"
          className="mt-4 inline-flex items-center gap-2 text-sm text-text/70 transition hover:text-text"
        >
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
          Volver
        </Link>
      </Section>
    );
  }

  return <DownloadDetail {...data} />;
}

function DownloadDetail({
  slug,
  title,
  description,
  details,
  highlights,
  access,
  price,
  discountPercent,
  image,
}: DownloadData) {
  const { addItem } = useCart();
  const safeHighlights = Array.isArray(highlights) ? highlights : [];
  const resolvedDiscount = Math.max(0, Math.min(100, Number(discountPercent) || 0));
  const discountedPrice = resolvedDiscount
    ? Math.round(price * (1 - resolvedDiscount / 100))
    : price;
  const isFree = discountedPrice === 0;

  return (
    <Section title={title} subtitle={description}>
      <Link
        href="/descargables"
        className="inline-flex items-center gap-2 text-sm !text-accent1/70 transition hover:!text-accent1"
      >
        <Icon name="arrow" className="h-4 w-4 rotate-180" />
        Atrás
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="rounded-2xl ">
          {image ? (
            <div className="overflow-hidden rounded-xl">
              <img src={image} alt={title} className="h-72 w-full object-cover" />
            </div>
          ) : (
            <div className="flex h-72 w-full items-center justify-center rounded-xl border border-accent2/30 bg-accent2/10 py-16 text-sm text-text/50">
              Sin imagen
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-accent2/30 bg-accent2/10 p-6 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm uppercase tracking-[0.2em] text-text/60">
              {isFree ? "Gratis" : access}
            </p>
            <div className="text-right">
              {resolvedDiscount > 0 ? (
                <div className="flex items-center justify-end gap-2">
                  <p className="text-xs font-semibold text-red-500 line-through">
                    $ {price}
                  </p>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    -{resolvedDiscount}%
                  </span>
                </div>
              ) : null}
              <p className="text-base font-bold text-black">$ {discountedPrice}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-text/70">{description}</p>
          {safeHighlights.length ? (
            <ul className="mt-4 flex flex-wrap gap-2 text-xs">
              {safeHighlights.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-accent1/20 bg-accent1 px-3 py-1 text-xs font-medium uppercase tracking-wide text-background shadow-soft"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
          {details ? (
            <div className="mt-4 rounded-xl border border-accent2/30 bg-background p-4 text-sm text-text/80">
              {details}
            </div>
          ) : null}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => addItem(slug, 1)}
              aria-label={`Agregar ${title} al carrito`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-buy1 text-background shadow-soft transition hover:bg-buy2"
            >
              <span className="cart-add-wiggle">
                <Icon name="add" className="h-6 w-6" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}

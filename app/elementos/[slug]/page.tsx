"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Icon from "@/components/Icon";
import Section from "@/components/Section";
import { useCart } from "@/components/CartProvider";

type ElementData = {
  slug: string;
  name: string;
  description: string;
  details?: string | null;
  images?: Array<{ src: string; alt: string }>;
  discountPercent?: number | null;
  price: number;
  image: string;
  category?: string | null;
};

export default function ElementoDetallePage() {
  const params = useParams<{ slug: string }>();
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  const [data, setData] = useState<ElementData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/elementos/${encodeURIComponent(slug)}`, { cache: "no-store" })
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
      <Section title="Elemento" subtitle="Cargando detalle...">
        <p className="text-sm text-text/70">Cargando...</p>
      </Section>
    );
  }

  if (!data) {
    return (
      <Section title="Elemento" subtitle="No encontrado">
        <p className="text-sm text-text/70">No se encontró el elemento.</p>
        <Link
          href="/elementos"
          className="mt-4 inline-flex items-center gap-2 text-sm text-text/70 transition hover:text-text"
        >
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
          Volver
        </Link>
      </Section>
    );
  }

  return <ElementDetail {...data} />;
}

function ElementDetail({
  slug,
  name,
  description,
  details,
  images,
  discountPercent,
  price,
  image,
  category,
}: ElementData) {
  const { addItem } = useCart();
  const carouselRef = useMemo(() => ({ current: null as HTMLDivElement | null }), []);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const gallery = [
    ...(image ? [{ src: image, alt: name }] : []),
    ...(Array.isArray(images) ? images.filter((img) => img?.src) : []),
  ];
  const resolvedDiscount = Math.max(0, Math.min(100, Number(discountPercent) || 0));
  const discountedPrice = resolvedDiscount
    ? Math.round(price * (1 - resolvedDiscount / 100))
    : price;

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;
    const update = () => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      setCanScrollLeft(container.scrollLeft > 4);
      setCanScrollRight(container.scrollLeft < maxScrollLeft - 4);
    };
    update();
    container.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      container.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [carouselRef]);

  const scrollByAmount = (direction: -1 | 1) => {
    const container = carouselRef.current;
    if (!container) return;
    const amount = container.clientWidth * 0.9;
    container.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  return (
    <Section title={name} subtitle={description}>
      <Link
        href="/elementos"
        className="inline-flex items-center gap-2 text-sm !text-accent1/70 transition hover:!text-accent1 pb-6"
      >
        <Icon name="arrow" className="h-4 w-4 rotate-180" />
        Atrás
      </Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div className="space-y-3">
          {gallery.length ? (
            <div className="overflow-hidden rounded-2xl">
              <div
                ref={(el) => {
                  carouselRef.current = el;
                }}
                className="no-scrollbar flex w-full gap-4 overflow-x-auto scroll-smooth px-4 py-4 snap-x snap-mandatory"
                style={{ scrollPaddingLeft: 16, scrollPaddingRight: 16 }}
              >
                {gallery.map((item) => (
                  <div
                    key={item.src}
                    className="flex-none w-[80%] max-w-[420px] snap-center overflow-hidden rounded-xl"
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="h-72 w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-xl border border-text/10 bg-surface py-16 text-sm text-text/50">
              Sin imagen
            </div>
          )}
          {gallery.length > 1 ? (
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => scrollByAmount(-1)}
                aria-label="Imagen anterior"
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-accent2/30 bg-accent2/10 text-accent1 shadow-soft transition hover:text-accent2 ${
                  canScrollLeft ? "" : "pointer-events-none opacity-40"
                }`}
              >
                <Icon name="arrow" className="h-4 w-4 rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => scrollByAmount(1)}
                aria-label="Siguiente imagen"
                className={`flex h-9 w-9 items-center justify-center rounded-full border border-accent2/30 bg-accent2/10 text-accent1 shadow-soft transition hover:text-accent2 ${
                  canScrollRight ? "" : "pointer-events-none opacity-40"
                }`}
              >
                <Icon name="arrow" className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
        <div className="rounded-2xl border border-accent2/30 bg-accent2/10 p-6 shadow-soft">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm uppercase tracking-[0.2em] text-text/60">
              {category || "Elemento"}
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
          {details ? (
            <div className="mt-4 rounded-xl border border-text/10 bg-background p-4 text-sm text-text/90">
              {details}
            </div>
          ) : null}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => addItem(slug, 1)}
              aria-label={`Agregar ${name} al carrito`}
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

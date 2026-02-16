"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Section from "@/components/Section";
import { useCart } from "@/components/CartProvider";

type ExperienceData = {
  slug: string;
  title: string;
  intro: string;
  summary?: string;
  details?: string;
  highlights?: string[];
  price?: number;
  discountPercent?: number | null;
  bullets: string[];
  outcomes: string[];
  images: Array<{ src: string; alt: string }>;
};

export default function ExperienciaDetallePage() {
  const params = useParams<{ slug: string }>();
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  const [data, setData] = useState<ExperienceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/experiencias/${encodeURIComponent(slug)}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((item) => {
        if (!cancelled) {
          setData(item);
        }
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
      <Section title="Experiencia" subtitle="Cargando detalle...">
        <p className="text-sm text-text/70">Cargando...</p>
      </Section>
    );
  }

  if (!data) {
    return (
      <Section title="Experiencia" subtitle="No encontrada">
        <p className="text-sm text-text/70">No se encontró la experiencia.</p>
        <Link
          href="/experiencias"
          className="mt-4 inline-flex items-center gap-2 text-sm text-text/70 transition hover:text-text"
        >
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
          Volver
        </Link>
      </Section>
    );
  }

  return <ExperienceDetail {...data} />;
}

function ExperienceDetail({
  slug,
  title,
  intro,
  summary,
  details,
  highlights,
  price,
  discountPercent,
  bullets,
  outcomes,
  images,
}: ExperienceData) {
  const { addItem } = useCart();
  const carouselRef = useMemo(() => ({ current: null as HTMLDivElement | null }), []);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const safeBullets = Array.isArray(bullets) ? bullets : [];
  const safeOutcomes = Array.isArray(outcomes) ? outcomes : [];
  const safeHighlights = Array.isArray(highlights) ? highlights : [];
  const safeImages = Array.isArray(images) ? images : [];
  const resolvedPrice = typeof price === "number" ? price : null;
  const resolvedDiscount = Math.max(0, Math.min(100, Number(discountPercent) || 0));
  const discountedPrice =
    resolvedPrice !== null && resolvedDiscount > 0
      ? Math.round(resolvedPrice * (1 - resolvedDiscount / 100))
      : resolvedPrice;

  const outcomeIcons: Record<
    string,
    Array<
      | "spark"
      | "focus"
      | "compass"
      | "handshake"
      | "route"
      | "message"
      | "workshop"
      | "people"
    >
  > = {
    charlas: ["focus", "route", "spark"],
    talleres: ["workshop", "compass", "route"],
    "sesiones-1-a-1": ["focus", "compass", "route"],
    "sesiones-grupales": ["route", "people", "handshake"],
  };

  const fallbackIcons: Array<"spark" | "focus" | "compass"> = [
    "spark",
    "focus",
    "compass",
  ];

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
    <div>
      <Section title={title} subtitle={intro}>
        <Link
          href="/experiencias"
          className="inline-flex items-center gap-2 text-sm !text-accent1/70 transition hover:!text-accent1 pb-6"
        >
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
          Atrás
        </Link>
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="order-2 space-y-6 lg:order-1">
            {summary ? <p className="text-sm text-text/70 uppercase tracking-[0.2em]">{summary}</p> : null}
            {details ? <p className="text-base text-text/80">{details}</p> : null}
            {safeHighlights.length ? (
              <ul className="flex flex-wrap gap-2 text-xs">
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
            <div className="rounded-2xl border border-accent2/30 bg-accent2/10 px-6 py-4 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm uppercase tracking-[0.2em] text-text/60">Experiencia</p>
                {discountedPrice !== null ? (
                  <div className="text-right">
                    {resolvedDiscount > 0 && resolvedPrice !== null ? (
                      <div className="flex items-center justify-end gap-2">
                        <p className="text-xs font-semibold text-red-500 line-through">
                          $ {resolvedPrice}
                        </p>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          -{resolvedDiscount}%
                        </span>
                      </div>
                    ) : null}
                    <p className="text-base font-bold text-black">$ {discountedPrice}</p>
                  </div>
                ) : null}
              </div>
              <ul className="mt-3 space-y-3 text-text/80">
                {safeBullets.map((bullet) => (
                  <li key={bullet}>• {bullet}</li>
                ))}
              </ul>
              <div className="mt-4 flex items-end justify-between gap-3">
                <Button
                  href={`/contacto?experiencia=${encodeURIComponent(title)}`}
                  variant="outline"
                >
                  Consultar
                </Button>
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
          <div className="order-1 space-y-4 lg:order-2">
            <div className="overflow-hidden rounded-2xl shadow-soft">
              <div
                ref={(el) => {
                  carouselRef.current = el;
                }}
                className="no-scrollbar flex w-full gap-4 overflow-x-auto scroll-smooth px-4 py-4 snap-x snap-mandatory"
                style={{ scrollPaddingLeft: 16, scrollPaddingRight: 16 }}
              >
                {safeImages.map((image) => (
                  <div
                    key={image.src}
                    className="flex-none w-[80%] max-w-[420px] snap-center overflow-hidden rounded-xl"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-64 w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            {safeImages.length > 1 ? (
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
        </div>
      </Section>

      <Section
        title="Resultados esperables"
        subtitle="Esta experiencia genera un avance concreto y medible dentro del proceso."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {safeOutcomes.map((outcome, index) => (
            <div
              key={outcome}
              className="rounded-2xl border border-accent2/30 bg-accent2/10 p-5 text-text/80"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 aspect-square items-center justify-center rounded-full bg-accent2/30 text-accent2">
                  <Icon
                    name={(outcomeIcons[slug] || fallbackIcons)[
                      index % (outcomeIcons[slug] || fallbackIcons).length
                    ]}
                    className="h-4 w-4"
                  />
                </span>
                <p>{outcome}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

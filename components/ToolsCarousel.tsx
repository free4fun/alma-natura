"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import { useCart } from "@/components/CartProvider";

type ToolItem = {
  slug: string;
  image: string;
  name: string;
  description: string;
  price: number;
  discountPercent?: number;
};

type ToolsCategory = {
  title: string;
  description: string;
  items: ToolItem[];
};

type ToolsCarouselProps = {
  category: ToolsCategory;
};

export default function ToolsCarousel({ category }: ToolsCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef(0);
  const dragDeltaRef = useRef(0);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const isPointerCapturedRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const currentIndexRef = useRef(0);
  const realIndexRef = useRef(0);
  const lastNavRef = useRef(0);
  const [itemsPerView, setItemsPerView] = useState(1);
  const [slideWidth, setSlideWidth] = useState(0);
  const [slideStep, setSlideStep] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const { addItem } = useCart();
  const itemsCount = category.items.length;
  const slideGap = itemsPerView >= 4 ? 12 : 8;
  const mobileInset = 20;
  const canLoop = itemsCount > itemsPerView;
  const buffer = canLoop ? itemsPerView + 2 : 0;

  const trackItems = useMemo(() => {
    if (!canLoop) return category.items;
    const left = category.items.slice(-buffer);
    const right = category.items.slice(0, buffer);
    return [...left, ...category.items, ...right];
  }, [buffer, canLoop, category.items]);

  useEffect(() => {
    const update = () => {
      const next = window.innerWidth >= 1024 ? 4 : 1;
      setItemsPerView(next);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!viewportRef.current) return;
    const element = viewportRef.current;
    const measure = () => {
      if (isAnimatingRef.current) return;
      const cards = trackRef.current?.querySelectorAll<HTMLElement>("[data-carousel-card]");
      if (!cards || cards.length === 0) return;
      const first = cards[0];
      const second = cards[1];
      const firstRect = first.getBoundingClientRect();
      const width = firstRect.width;
      const step = second
        ? second.offsetLeft - first.offsetLeft
        : width + slideGap;
      const dpr = window.devicePixelRatio || 1;
      const snappedStep = Math.round(step * dpr) / dpr;
      setSlideWidth(width);
      setSlideStep(snappedStep);
    };
    const observer = new ResizeObserver(() => {
      if (isAnimatingRef.current) return;
      requestAnimationFrame(measure);
    });
    observer.observe(element);
    requestAnimationFrame(measure);
    return () => observer.disconnect();
  }, [itemsPerView, slideGap]);

  useEffect(() => {
    if (!itemsCount) return;
    realIndexRef.current = realIndexRef.current >= itemsCount ? 0 : realIndexRef.current;
    if (!canLoop) {
      setCurrentIndex(0);
      currentIndexRef.current = 0;
      return;
    }
    setIsTransitioning(false);
    const nextIndex = buffer + realIndexRef.current;
    setCurrentIndex(nextIndex);
    currentIndexRef.current = nextIndex;
    requestAnimationFrame(() => {
      trackRef.current?.offsetHeight;
      requestAnimationFrame(() => setIsTransitioning(true));
    });
  }, [itemsCount]);

  useEffect(() => {
    if (!itemsCount) return;
    if (!canLoop) {
      setIsTransitioning(false);
      setCurrentIndex(realIndexRef.current);
      currentIndexRef.current = realIndexRef.current;
      requestAnimationFrame(() => {
        trackRef.current?.offsetHeight;
        requestAnimationFrame(() => setIsTransitioning(true));
      });
      return;
    }
    if (isAnimatingRef.current) return;
    setIsTransitioning(false);
    const nextIndex = buffer + realIndexRef.current;
    setCurrentIndex(nextIndex);
    currentIndexRef.current = nextIndex;
    requestAnimationFrame(() => {
      trackRef.current?.offsetHeight;
      requestAnimationFrame(() => setIsTransitioning(true));
    });
  }, [buffer, canLoop, itemsPerView]);

  const moveBy = (delta: number) => {
    if (itemsCount <= itemsPerView) return;
    const now = Date.now();
    if (now - lastNavRef.current < 200) return;
    lastNavRef.current = now;
    isAnimatingRef.current = true;
    setIsTransitioning(true);
    setCurrentIndex((prev) => {
      const nextIndex = prev + delta;
      currentIndexRef.current = nextIndex;
      return nextIndex;
    });
    realIndexRef.current = (realIndexRef.current + delta + itemsCount) % itemsCount;
  };

  const handlePrev = () => {
    if (itemsCount <= itemsPerView) return;
    moveBy(-1);
  };

  const handleNext = () => {
    if (itemsCount <= itemsPerView) return;
    moveBy(1);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (itemsCount <= itemsPerView) return;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    isPointerCapturedRef.current = false;
    dragStartXRef.current = event.clientX;
    dragDeltaRef.current = 0;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const delta = event.clientX - dragStartXRef.current;
    dragDeltaRef.current = delta;
    if (!hasDraggedRef.current && Math.abs(delta) > 5) {
      hasDraggedRef.current = true;
      if (!isPointerCapturedRef.current) {
        event.currentTarget.setPointerCapture(event.pointerId);
        isPointerCapturedRef.current = true;
      }
    }
  };

  const endDrag = (event?: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const delta = dragDeltaRef.current;
    isDraggingRef.current = false;
    if (event) {
      if (isPointerCapturedRef.current && event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    }
    isPointerCapturedRef.current = false;
    setIsTransitioning(true);
    if (!hasDraggedRef.current) return;
    const threshold = Math.max(30, (slideStep || slideWidth) * 0.2);
    if (delta > threshold) {
      moveBy(-1);
    } else if (delta < -threshold) {
      moveBy(1);
    }
  };

  const handleTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.currentTarget !== trackRef.current) return;
    if (event.propertyName !== "transform") return;
    if (!canLoop || !isAnimatingRef.current) return;
    const index = currentIndexRef.current;
    if (index < buffer) {
      const nextIndex = index + itemsCount;
      const track = trackRef.current;
      if (track) {
        track.style.transition = "none";
        track.style.transform = `translateX(${-(nextIndex * (slideStep || slideWidth))}px)`;
        track.offsetHeight;
        track.style.transition = "";
      }
      setCurrentIndex(nextIndex);
      currentIndexRef.current = nextIndex;
    } else if (index >= buffer + itemsCount) {
      const nextIndex = index - itemsCount;
      const track = trackRef.current;
      if (track) {
        track.style.transition = "none";
        track.style.transform = `translateX(${-(nextIndex * (slideStep || slideWidth))}px)`;
        track.offsetHeight;
        track.style.transition = "";
      }
      setCurrentIndex(nextIndex);
      currentIndexRef.current = nextIndex;
    }
    isAnimatingRef.current = false;
  };

  return (
    <section className="space-y-6 overflow-x-hidden">
      <div>
        <h3 className="text-2xl font-semibold text-text">{category.title}</h3>
        <p className="mt-2 text-sm text-text/70">{category.description}</p>
      </div>
      <div className="relative mx-auto w-full max-w-[1048px]">
        <div
          ref={viewportRef}
          className="overflow-hidden"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={(event) => endDrag(event)}
          onPointerLeave={(event) => endDrag(event)}
        >
          <div
            ref={trackRef}
            onTransitionEnd={handleTransitionEnd}
            className={`flex w-full touch-pan-y ${
              isTransitioning ? "transition-transform duration-500 ease-out" : ""
            }`}
            style={{
              gap: slideGap,
              transform: `translateX(${-(currentIndex * (slideStep || slideWidth))}px)`,
            }}
          >
            {trackItems.map((item, index) => (
              <article
                key={`${item.slug}-${index}`}
                data-carousel-card
                className="relative flex min-h-[270px] min-w-0 flex-col rounded-2xl border border-accent2/30 bg-accent2/10 p-4 shadow-soft transition-shadow hover:shadow-md sm:min-h-[290px]"
                style={{
                  flex: itemsPerView === 1
                    ? `0 0 calc(100% - ${mobileInset}px)`
                    : `0 0 calc((100% - ${slideGap * (itemsPerView - 1)}px) / ${itemsPerView})`,
                }}
              >
                <Link
                  href={`/elementos/${item.slug}`}
                  aria-label={`Ver detalles de ${item.name}`}
                  className="absolute inset-0 z-10"
                />
                <div className="relative z-20 flex h-full flex-col pointer-events-none">
                  <div className="aspect-[4/3] overflow-hidden rounded-xl border border-accent2/30 bg-accent2/10">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-text/50">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <h4 className="mt-3 text-base font-semibold text-text">
                    {item.name}
                  </h4>
                  <p
                    className="mt-2 text-xs text-text/70"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {item.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="text-right">
                      {item.discountPercent ? (
                        <div className="flex items-center justify-end gap-1">
                          <p className="text-[10px] font-semibold text-red-500 line-through">
                            $ {item.price}
                          </p>
                          <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700">
                            -{Math.min(100, item.discountPercent)}%
                          </span>
                        </div>
                      ) : null}
                      <span className="text-xs font-bold text-black">
                        $ {item.discountPercent
                          ? Math.round(
                              item.price * (1 - Math.min(100, item.discountPercent) / 100)
                            )
                          : item.price}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => addItem(item.slug, 1)}
                      aria-label={`Agregar ${item.name} al carrito`}
                      className="pointer-events-auto relative z-20 flex h-10 w-10 items-center justify-center rounded-full bg-buy1 text-background shadow-soft transition hover:bg-buy2"
                    >
                      <Icon name="add" className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={handlePrev}
            aria-label={`Desplazar ${category.title} hacia la izquierda`}
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-accent2/30 bg-accent2/10 text-accent1 shadow-soft transition hover:text-accent2 ${
              itemsCount > itemsPerView ? "" : "pointer-events-none opacity-40"
            }`}
          >
            <Icon name="arrow" className="h-4 w-4 rotate-180" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label={`Desplazar ${category.title} hacia la derecha`}
            className={`flex h-9 w-9 items-center justify-center rounded-full border border-accent2/30 bg-accent2/10 text-accent1 shadow-soft transition hover:text-accent2 ${
              itemsCount > itemsPerView ? "" : "pointer-events-none opacity-40"
            }`}
          >
            <Icon name="arrow" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

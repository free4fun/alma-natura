"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "@/components/Icon";

export type LightboxItem = {
  src: string;
  alt: string;
};

type LightboxProps = {
  items: LightboxItem[];
  initialIndex: number;
  onClose: () => void;
};

export default function Lightbox({ items, initialIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowRight") {
        setIndex((prev) => Math.min(items.length - 1, prev + 1));
      }
      if (event.key === "ArrowLeft") {
        setIndex((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items.length, onClose]);

  const item = items[index];
  if (!item) return null;

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black/80"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-3 top-3 z-10 rounded-full border border-white/30 bg-black/60 px-3 py-1 text-xs text-white"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ✕
        </button>
        {items.length > 1 ? (
          <>
            <button
              type="button"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/30 bg-black/60 px-3 py-2 text-white"
              onClick={() => setIndex((prev) => Math.max(0, prev - 1))}
              disabled={index === 0}
              aria-label="Anterior"
            >
              <Icon name="arrow" className="h-4 w-4 rotate-180" />
            </button>
            <button
              type="button"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/30 bg-black/60 px-3 py-2 text-white"
              onClick={() => setIndex((prev) => Math.min(items.length - 1, prev + 1))}
              disabled={index === items.length - 1}
              aria-label="Siguiente"
            >
              <Icon name="arrow" className="h-4 w-4" />
            </button>
          </>
        ) : null}
        <div className="relative h-[70vh] w-full">
          <img src={item.src} alt={item.alt} className="h-full w-full object-contain" />
        </div>
        {items.length > 1 ? (
          <div className="flex items-center justify-center gap-2 py-3 text-xs text-white/70">
            {index + 1} / {items.length}
          </div>
        ) : null}
      </div>
    </div>,
    document.body
  );
}

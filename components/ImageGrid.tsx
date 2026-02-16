"use client";

import { useState } from "react";
import Image from "next/image";
import Icon from "@/components/Icon";
import Lightbox, { type LightboxItem } from "@/components/Lightbox";

type ImageItem = {
  src: string;
  alt: string;
};

type ImageGridProps = {
  items: ImageItem[];
};

export default function ImageGrid({ items }: ImageGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const safeItems = items.filter((item) => item.src);
  const lightboxItems: LightboxItem[] = safeItems.map((item) => ({
    src: item.src,
    alt: item.alt,
  }));

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {safeItems.map((item, index) => (
          <button
            key={`${item.src}-${index}`}
            type="button"
            className="relative aspect-square overflow-hidden rounded-2xl border border-text/10 bg-surface"
            onClick={() => setOpenIndex(index)}
            aria-label={`Abrir imagen ${index + 1}`}
          >
            <span
              className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-sm text-white"
              aria-hidden="true"
            >
              <Icon name="zoom" className="h-4 w-4" />
            </span>
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
      {openIndex !== null ? (
        <Lightbox
          items={lightboxItems}
          initialIndex={openIndex}
          onClose={() => setOpenIndex(null)}
        />
      ) : null}
    </>
  );
}

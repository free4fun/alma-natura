"use client";

import { useSearchParams } from "next/navigation";
import DownloadsGrid from "@/components/DownloadsGrid";
import Paginator from "@/components/Paginator";
import Section from "@/components/Section";
import { useMemo } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";

export default function DownloadsListClient({ items }: { items: any[] }) {
  const searchParams = useSearchParams();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const pageSize = isDesktop ? 2 : 1;
  const currentPage = Math.max(1, Number(searchParams.get("page") || 1) || 1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const visibleItems = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize]
  );

  return (
    <Section
      title="Descargables"
      subtitle="Materiales en PDF con acceso inmediato y uso práctico."
    >
      <DownloadsGrid
        items={visibleItems.map((item) => ({
          slug: item.slug,
          title: item.title,
          description: item.description,
          access: item.access,
          price: item.price,
          discountPercent:
            "discountPercent" in item && typeof item.discountPercent === "number"
              ? item.discountPercent
              : 0,
        }))}
      />
      {items.length > 0 && totalPages > 1 ? (
        <div className="mt-6 flex items-center justify-center">
          <Paginator safePage={safePage} totalPages={totalPages} basePath="/descargables" />
        </div>
      ) : null}
    </Section>
  );
}

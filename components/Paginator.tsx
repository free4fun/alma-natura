"use client";

import Link from "next/link";
import Icon from "@/components/Icon";


type PaginatorProps = {
  safePage: number;
  totalPages: number;
  basePath?: string; // default: "/notas"
};

export default function Paginator({ safePage, totalPages, basePath = "/notas" }: PaginatorProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const prevDisabled = safePage === 1;
  const nextDisabled = safePage >= totalPages;

  return (
    <div className="mx-auto mt-6 flex w-full max-w-5xl items-center justify-center text-xs text-text/60">
      <div className="flex items-center gap-3">
        <Link
          href={`${basePath}?page=${Math.max(1, safePage - 1)}`}
          aria-label="Página anterior"
          className={`flex h-8 w-8 items-center justify-center rounded-full border border-accent2/30 bg-accent2/10 !text-accent1 shadow-soft transition hover:text-accent2 ${
            prevDisabled ? "pointer-events-none opacity-40" : ""
          }`}
        >
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
        </Link>

        <nav className="flex items-center gap-2" aria-label="Paginación">
          {pages.map((p) => (
            <Link
              key={p}
              href={`${basePath}?page=${p}`}
              aria-current={p === safePage ? "page" : undefined}
              className={`px-2 py-1 font-semibold uppercase tracking-[0.2em] transition-colors focus:outline-none ${
                p === safePage ? "!text-accent1" : "text-text/60 hover:text-accent1"
              }`}
            >
              {p}
            </Link>
          ))}
        </nav>

        <Link
          href={`${basePath}?page=${Math.min(totalPages, safePage + 1)}`}
          aria-label="Página siguiente"
          className={`flex h-8 w-8 items-center justify-center rounded-full border border-accent2/30 bg-accent2/10 !text-accent1 shadow-soft transition hover:text-accent2 ${
            nextDisabled ? "pointer-events-none opacity-40" : ""
          }`}
        >
          <Icon name="arrow" className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

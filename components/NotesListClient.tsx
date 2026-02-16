"use client";

import { useSearchParams } from "next/navigation";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Section from "@/components/Section";
import Paginator from "@/components/Paginator";
import Image from "next/image";
import { useMemo } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";

// Recibe los posts como prop (ya filtrados y ordenados)
export default function NotesListClient({ posts }: { posts: any[] }) {
  const searchParams = useSearchParams();
  // sm: 640px (tailwind)
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const pageSize = isDesktop ? 3 : 1;
  const currentPage = Math.max(1, Number(searchParams.get("page") || 1) || 1);
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const visiblePosts = useMemo(
    () => posts.slice((safePage - 1) * pageSize, safePage * pageSize),
    [posts, safePage, pageSize]
  );

  const getExcerpt = (content: string) => {
    const text = content
      .replace(/[\n#>*_`-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return text.length > 120 ? `${text.slice(0, 120)}…` : text;
  };

  return (
    <Section title="Notas" subtitle="Artículos, guías y reflexiones para tu práctica.">
      <section className="mx-auto grid w-full max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visiblePosts.map((post) => (
          <Card
            key={post.id}
            title={post.title}
            titleClassName="line-clamp-3 min-h-[4.5rem] leading-tight"
          >
            {post.coverImage ? (
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl border border-text/10">
                <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
              </div>
            ) : null}
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-text/90">
              <span className="font-semibold text-accent1">{post.category}</span>
              <span>
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : ""}
              </span>
            </div>
            <p className="text-sm text-text/70">{getExcerpt(post.content)}</p>
            <div className="mt-auto flex justify-end">
              <Button href={`/notas/${post.slug}`} variant="outline">
                Leer
              </Button>
            </div>
          </Card>
        ))}
        {posts.length === 0 ? (
          <p className="text-sm text-text/60">No hay artículos publicados.</p>
        ) : null}
      </section>
      {posts.length > 0 && totalPages > 1 ? (
        <Paginator safePage={safePage} totalPages={totalPages} basePath="/notas" />
      ) : null}
    </Section>
  );
}

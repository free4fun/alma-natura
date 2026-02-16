import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import Icon from "@/components/Icon";
import Section from "@/components/Section";
import { getPostBySlug } from "@/lib/posts";

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status?.toLowerCase() !== "publicado") {
    notFound();
  }

  const { content } = await compileMDX({
    source: post.content,
    options: { parseFrontmatter: false },
  });

  return (
    <Section title={post.title}>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <Link
          href="/notas"
          className="inline-flex items-center gap-2 text-sm !text-accent1/70 transition hover:!text-accent1 pb-2"
        >
          <Icon name="arrow" className="h-4 w-4 rotate-180" />
          Atrás
        </Link>
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-text/50">
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
        {post.coverImage ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-text/10">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
          </div>
        ) : null}
        <div className="space-y-4 text-text/80 leading-relaxed [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-accent2 [&_a]:hover:text-accent1">
          {content}
        </div>
      </div>
    </Section>
  );
}

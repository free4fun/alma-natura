"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const emptyForm = {
  id: "",
  slug: "",
  title: "",
  category: "",
  status: "borrador",
  coverImage: "",
  publishedAt: "",
  content: "",
};

type PostItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: string;
  coverImage?: string;
  publishedAt?: string;
  content: string;
};

export default function BackendNotas() {
  const [items, setItems] = useState<PostItem[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const load = async () => {
    const res = await fetch("/api/admin/posts", { cache: "no-store" });
    if (!res.ok) {
      setItems([]);
      return;
    }
    try {
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [items, pageSize]);

  const handleEdit = (item: PostItem) => {
    setForm({
      id: item.id,
      slug: item.slug,
      title: item.title,
      category: item.category,
      status: item.status,
      coverImage: item.coverImage || "",
      publishedAt: item.publishedAt ? item.publishedAt.slice(0, 16) : "",
      content: item.content,
    });
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/admin/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const payload = {
        id: form.id || undefined,
        slug: form.slug.trim(),
        title: form.title.trim(),
        category: form.category.trim(),
        status: form.status,
        coverImage: form.coverImage.trim(),
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : "",
        content: form.content,
      };
      const res = await fetch("/api/admin/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "No se pudo guardar.");
      }
      setForm({ ...emptyForm });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    setError(null);
    const file = imageInputRef.current?.files?.[0];
    if (!file) {
      setError("Selecciona una imagen.");
      return;
    }

    const body = new FormData();
    body.append("file", file);
    body.append("kind", "image");

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error || "No se pudo subir la imagen.");
      return;
    }

    const data = await res.json();
    setForm((prev) => ({ ...prev, coverImage: data.url || prev.coverImage }));
  };

  return (
    <main className="px-6 py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-accent-1">Notas</h1>
          <p className="mt-2 text-sm text-muted">Gestiona artículos en Markdown/MDX.</p>
        </div>
        <Link href="/backend" className="text-sm text-accent-2 hover:text-accent-1">
          Volver al panel
        </Link>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-text/10 bg-background/80 p-6">
          <h2 className="text-lg font-semibold text-accent-1">Nuevo artículo</h2>
          {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
          <div className="mt-4 grid gap-3">
            <label htmlFor="nota-slug" className="text-xs text-text/70">
              Slug
            </label>
            <input
              id="nota-slug"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Slug"
              value={form.slug}
              onChange={(event) => setForm({ ...form, slug: event.target.value })}
            />
            <label htmlFor="nota-titulo" className="text-xs text-text/70">
              Título
            </label>
            <input
              id="nota-titulo"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Título"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />
            <label htmlFor="nota-categoria" className="text-xs text-text/70">
              Categoría
            </label>
            <input
              id="nota-categoria"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Categoría"
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
            />
            <label htmlFor="nota-estado" className="text-xs text-text/70">
              Estado
            </label>
            <select
              id="nota-estado"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value })}
            >
              <option value="borrador">Borrador</option>
              <option value="publicado">Publicado</option>
            </select>
            <label htmlFor="nota-publicado" className="text-xs text-text/70">
              Fecha de publicación
            </label>
            <input
              type="datetime-local"
              id="nota-publicado"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              value={form.publishedAt}
              onChange={(event) => setForm({ ...form, publishedAt: event.target.value })}
            />
            <label htmlFor="nota-imagen" className="text-xs text-text/70">
              Imagen de portada (URL)
            </label>
            <input
              id="nota-imagen"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Imagen de portada (URL)"
              value={form.coverImage}
              onChange={(event) => setForm({ ...form, coverImage: event.target.value })}
            />
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="nota-imagen-archivo" className="text-xs text-text/70">
                Archivo de imagen
              </label>
              <input
                id="nota-imagen-archivo"
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="rounded-full border border-black/30 px-3 py-1 text-xs text-black"
              />
              <button
                type="button"
                className="rounded-full border border-black/70 px-3 py-1 text-xs text-black hover:border-black"
                onClick={handleImageUpload}
              >
                Subir imagen
              </button>
            </div>
            <label htmlFor="nota-contenido" className="text-xs text-text/70">
              Contenido
            </label>
            <textarea
              id="nota-contenido"
              className="min-h-[220px] rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm font-mono"
              placeholder="Contenido en Markdown/MDX"
              value={form.content}
              onChange={(event) => setForm({ ...form, content: event.target.value })}
            />
          </div>
            <button
              type="button"
              className="mt-4 rounded-full bg-[#2A4D3C] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#3A6F8F]"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
        </div>

        <div className="rounded-2xl border border-text/10 bg-background/80 p-6">
          <h2 className="text-lg font-semibold text-accent-1">Listado</h2>
          <div className="mt-4 grid gap-3">
            {items
              .slice((page - 1) * pageSize, page * pageSize)
              .map((item) => (
              <div key={item.id} className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-muted">/{item.slug}</p>
                    <p className="text-xs text-muted">{item.status} · {item.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-text/20 px-3 py-1 text-xs text-text hover:border-accent-2"
                      onClick={() => handleEdit(item)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="rounded-full border border-red-400/50 px-3 py-1 text-xs text-red-300 hover:border-red-400"
                      onClick={() => handleDelete(item.id)}
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              </div>
              ))}
            {items.length === 0 ? (
              <p className="text-sm text-muted">No hay artículos aún.</p>
            ) : null}
          </div>
          {items.length > 0 ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
              <span>
                Página {page} de {totalPages}
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-full border border-text/20 px-3 py-1 text-xs text-text disabled:opacity-40"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                >
                  Anterior
                </button>
                {pages.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    className={`rounded-full border px-3 py-1 text-xs ${
                      pageNumber === page
                        ? "border-accent-2 text-accent-1"
                        : "border-text/20 text-text"
                    }`}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  type="button"
                  className="rounded-full border border-text/20 px-3 py-1 text-xs text-text disabled:opacity-40"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={page >= totalPages}
                >
                  Siguiente
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

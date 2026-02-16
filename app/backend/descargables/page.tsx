"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const emptyForm = {
  slug: "",
  title: "",
  description: "",
  details: "",
  showOnHome: false,
  access: "",
  fileUrl: "",
  image: "",
  price: 0,
};

type DownloadItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  details?: string;
  showOnHome?: boolean;
  access: string;
  fileUrl: string;
  image: string;
  price: number;
};

export default function BackendDownloads() {
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const load = async () => {
    const res = await fetch("/api/admin/downloads", { cache: "no-store" });
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

  const handleEdit = (item: DownloadItem) => {
    setForm({
      slug: item.slug,
      title: item.title,
      description: item.description,
      details: item.details || "",
      showOnHome: Boolean(item.showOnHome),
      access: item.access,
      fileUrl: item.fileUrl,
      image: item.image,
      price: item.price,
    });
  };

  const handleDelete = async (slug: string) => {
    await fetch("/api/admin/downloads", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    load();
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const payload = {
        slug: form.slug.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        details: form.details.trim(),
        showOnHome: Boolean(form.showOnHome),
        access: form.access.trim(),
        fileUrl: form.fileUrl.trim(),
        image: form.image.trim(),
        price: Number(form.price) || 0,
      };

      const res = await fetch("/api/admin/downloads", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json();
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
    setForm((prev) => ({ ...prev, image: data.url || prev.image }));
  };

  const handlePdfUpload = async () => {
    setError(null);
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Selecciona un PDF.");
      return;
    }

    const body = new FormData();
    body.append("file", file);
    body.append("kind", "pdf");

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body,
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error || "No se pudo subir el PDF.");
      return;
    }

    const data = await res.json();
    setForm((prev) => ({ ...prev, fileUrl: data.url || prev.fileUrl }));
  };

  return (
    <main className="px-6 py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-accent-1">Descargables</h1>
          <p className="mt-2 text-sm text-muted">Gestiona archivos descargables.</p>
        </div>
        <Link href="/backend" className="text-sm text-accent-2 hover:text-accent-1">
          Volver al panel
        </Link>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-text/10 bg-background/80 p-6">
          <h2 className="text-lg font-semibold text-accent-1">Nuevo descargable</h2>
          {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
          <div className="mt-4 grid gap-3">
            <label htmlFor="descargable-slug" className="text-xs text-text/70">
              Slug
            </label>
            <input
              id="descargable-slug"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Slug"
              value={form.slug}
              onChange={(event) => setForm({ ...form, slug: event.target.value })}
            />
            <label htmlFor="descargable-titulo" className="text-xs text-text/70">
              Título
            </label>
            <input
              id="descargable-titulo"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Título"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />
            <label htmlFor="descargable-descripcion" className="text-xs text-text/70">
              Descripción
            </label>
            <textarea
              id="descargable-descripcion"
              className="min-h-[120px] rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Descripción"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
            <label htmlFor="descargable-detalle" className="text-xs text-text/70">
              Descripción larga
            </label>
            <textarea
              id="descargable-detalle"
              className="min-h-[140px] rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Descripción larga"
              value={form.details}
              onChange={(event) => setForm({ ...form, details: event.target.value })}
            />
            <label htmlFor="descargable-home" className="text-xs text-text/70">
              Mostrar en inicio
            </label>
            <label className="flex items-center gap-2 text-sm text-text/70">
              <input
                id="descargable-home"
                type="checkbox"
                checked={Boolean(form.showOnHome)}
                onChange={(event) =>
                  setForm({ ...form, showOnHome: event.target.checked })
                }
                className="h-4 w-4 rounded border border-black/30"
              />
              Mostrar descargable en la home
            </label>
            <label htmlFor="descargable-acceso" className="text-xs text-text/70">
              Acceso (texto corto)
            </label>
            <input
              id="descargable-acceso"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Acceso (texto corto)"
              value={form.access}
              onChange={(event) => setForm({ ...form, access: event.target.value })}
            />
            <label htmlFor="descargable-url" className="text-xs text-text/70">
              URL archivo
            </label>
            <input
              id="descargable-url"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="URL archivo"
              value={form.fileUrl}
              onChange={(event) => setForm({ ...form, fileUrl: event.target.value })}
            />
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="descargable-pdf" className="text-xs text-text/70">
                Archivo PDF
              </label>
              <input
                id="descargable-pdf"
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="rounded-full border border-black/30 px-3 py-1 text-xs text-black"
              />
              <button
                type="button"
                className="rounded-full border border-black/70 px-3 py-1 text-xs text-black hover:border-black"
                onClick={handlePdfUpload}
              >
                Subir PDF
              </button>
            </div>
            <label htmlFor="descargable-imagen" className="text-xs text-text/70">
              Imagen (URL)
            </label>
            <input
              id="descargable-imagen"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Imagen (URL)"
              value={form.image}
              onChange={(event) => setForm({ ...form, image: event.target.value })}
            />
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="descargable-imagen-archivo" className="text-xs text-text/70">
                Archivo de imagen
              </label>
              <input
                id="descargable-imagen-archivo"
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
            <label htmlFor="descargable-precio" className="text-xs text-text/70">
              Precio
            </label>
            <input
              id="descargable-precio"
              type="number"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Precio"
              value={form.price}
              onChange={(event) => setForm({ ...form, price: Number(event.target.value) })}
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
              <div
                key={item.id}
                className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-muted">/{item.slug}</p>
                    {item.details ? (
                      <p className="mt-2 text-xs text-muted line-clamp-3">
                        {item.details}
                      </p>
                    ) : null}
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
                      onClick={() => handleDelete(item.slug)}
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              </div>
              ))}
            {items.length === 0 ? (
              <p className="text-sm text-muted">No hay descargables cargados.</p>
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

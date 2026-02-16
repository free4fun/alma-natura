"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const emptyForm = {
  slug: "",
  title: "",
  summary: "",
  details: "",
  intro: "",
  icon: "",
  price: 0,
  discountPercent: 0,
  coupons: [] as Array<{ code: string; percent: number; minQty: number }>,
  highlights: "[]",
  bullets: "[]",
  outcomes: "[]",
  images: [] as Array<{ src: string; alt: string }>,
};

type Experience = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  details?: string;
  discountPercent?: number;
  coupons?: Array<{ code: string; percent: number; minQty: number }>;
  intro: string;
  highlights: unknown;
  bullets: unknown;
  outcomes: unknown;
  images: unknown;
  icon: string;
  price: number;
  createdAt: string;
};

export default function BackendExperiences() {
  const [items, setItems] = useState<Experience[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const pageSize = 6;
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponPercent, setCouponPercent] = useState(10);
  const [couponMinQty, setCouponMinQty] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const parseJsonField = (value: string, label: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return [];
    }
    try {
      return JSON.parse(trimmed);
    } catch (err) {
      throw new Error(`JSON inválido en ${label}.`);
    }
  };

  const load = async () => {
    const res = await fetch("/api/admin/experiences", { cache: "no-store" });
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

  const handleEdit = (item: Experience) => {
    setForm({
      slug: item.slug,
      title: item.title,
      summary: item.summary,
      details: item.details || "",
      intro: item.intro,
      icon: item.icon,
      price: item.price,
      discountPercent: item.discountPercent ?? 0,
      coupons: Array.isArray(item.coupons) ? item.coupons : [],
      highlights: JSON.stringify(item.highlights ?? [], null, 2),
      bullets: JSON.stringify(item.bullets ?? [], null, 2),
      outcomes: JSON.stringify(item.outcomes ?? [], null, 2),
      images: Array.isArray(item.images)
        ? (item.images as Array<{ src: string; alt: string }>)
        : [],
    });
    setImageUrl("");
    setImageAlt("");
    setCouponCode("");
    setCouponPercent(10);
    setCouponMinQty(1);
  };

  const handleDelete = async (slug: string) => {
    await fetch("/api/admin/experiences", {
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
        summary: form.summary.trim(),
        details: form.details.trim(),
        intro: form.intro.trim(),
        icon: form.icon.trim(),
        price: Number(form.price) || 0,
        discountPercent: Number(form.discountPercent) || 0,
        coupons: form.coupons,
        highlights: parseJsonField(form.highlights, "highlights"),
        bullets: parseJsonField(form.bullets, "bullets"),
        outcomes: parseJsonField(form.outcomes, "outcomes"),
        images: form.images,
      };

      const res = await fetch("/api/admin/experiences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body?.error || "No se pudo guardar.");
      }

      setForm({ ...emptyForm });
      setImageUrl("");
      setImageAlt("");
      setCouponCode("");
      setCouponPercent(10);
      setCouponMinQty(1);
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
    const url = data?.url as string | undefined;
    if (!url) return;

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, { src: url, alt: imageAlt.trim() }],
    }));
    setImageAlt("");
  };

  const handleAddImage = () => {
    setError(null);
    const url = imageUrl.trim();
    if (!url) {
      setError("Ingresa una URL de imagen.");
      return;
    }
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, { src: url, alt: imageAlt.trim() }],
    }));
    setImageUrl("");
    setImageAlt("");
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index),
    }));
  };

  const handleUpdateImageAlt = (index: number, alt: string) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((item, idx) => (idx === index ? { ...item, alt } : item)),
    }));
  };

  const handleAddCoupon = () => {
    const code = couponCode.trim();
    if (!code) {
      setError("Ingresa un código de cupón.");
      return;
    }
    const percent = Math.max(0, Math.min(100, Number(couponPercent) || 0));
    const minQty = Math.max(1, Number(couponMinQty) || 1);
    setForm((prev) => ({
      ...prev,
      coupons: [...prev.coupons, { code, percent, minQty }],
    }));
    setCouponCode("");
    setCouponPercent(10);
    setCouponMinQty(1);
  };

  const handleRemoveCoupon = (index: number) => {
    setForm((prev) => ({
      ...prev,
      coupons: prev.coupons.filter((_, idx) => idx !== index),
    }));
  };

  return (
    <main className="px-6 py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-accent-1">Experiencias</h1>
          <p className="mt-2 text-sm text-muted">Crear y editar experiencias.</p>
        </div>
        <Link href="/backend" className="text-sm text-accent-2 hover:text-accent-1">
          Volver al panel
        </Link>
      </header>

      <section className="grid gap-6">
        <div className="min-w-0 rounded-2xl border border-text/10 bg-background/80 p-6">
          <h2 className="text-lg font-semibold text-accent-1">Nueva experiencia</h2>
          {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
          <div className="mt-4 grid gap-3">
            <label htmlFor="exp-slug" className="text-xs text-text/70">
              Slug
            </label>
            <input
              id="exp-slug"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Slug"
              value={form.slug}
              onChange={(event) => setForm({ ...form, slug: event.target.value })}
            />
            <label htmlFor="exp-titulo" className="text-xs text-text/70">
              Título
            </label>
            <input
              id="exp-titulo"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Título"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />
            <label htmlFor="exp-icono" className="text-xs text-text/70">
              Icono (nombre)
            </label>
            <input
              id="exp-icono"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Icono (nombre)"
              value={form.icon}
              onChange={(event) => setForm({ ...form, icon: event.target.value })}
            />
            <label htmlFor="exp-precio" className="text-xs text-text/70">
              Precio
            </label>
            <input
              type="number"
              id="exp-precio"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Precio"
              value={form.price}
              onChange={(event) => setForm({ ...form, price: Number(event.target.value) })}
            />
            <label htmlFor="exp-descuento" className="text-xs text-text/70">
              Descuento (%)
            </label>
            <input
              type="number"
              id="exp-descuento"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="0"
              value={form.discountPercent}
              onChange={(event) =>
                setForm({ ...form, discountPercent: Number(event.target.value) })
              }
            />
            <label htmlFor="exp-resumen" className="text-xs text-text/70">
              Resumen
            </label>
            <textarea
              id="exp-resumen"
              className="min-h-[90px] rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Resumen"
              value={form.summary}
              onChange={(event) => setForm({ ...form, summary: event.target.value })}
            />
            <label htmlFor="exp-detalles" className="text-xs text-text/70">
              Detalles (descripción larga)
            </label>
            <textarea
              id="exp-detalles"
              className="min-h-[140px] rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Detalles o descripción larga"
              value={form.details}
              onChange={(event) => setForm({ ...form, details: event.target.value })}
            />
            <label htmlFor="exp-intro" className="text-xs text-text/70">
              Intro
            </label>
            <textarea
              id="exp-intro"
              className="min-h-[120px] rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Intro"
              value={form.intro}
              onChange={(event) => setForm({ ...form, intro: event.target.value })}
            />
            <label htmlFor="exp-highlights" className="text-xs text-text/70">
              Highlights JSON
            </label>
            <textarea
              id="exp-highlights"
              className="min-h-[120px] rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm font-mono"
              placeholder='Highlights JSON (ej: ["uno","dos"])'
              value={form.highlights}
              onChange={(event) => setForm({ ...form, highlights: event.target.value })}
            />
            <label htmlFor="exp-bullets" className="text-xs text-text/70">
              Bullets JSON
            </label>
            <textarea
              id="exp-bullets"
              className="min-h-[120px] rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm font-mono"
              placeholder='Bullets JSON'
              value={form.bullets}
              onChange={(event) => setForm({ ...form, bullets: event.target.value })}
            />
            <label htmlFor="exp-outcomes" className="text-xs text-text/70">
              Outcomes JSON
            </label>
            <textarea
              id="exp-outcomes"
              className="min-h-[120px] rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm font-mono"
              placeholder='Outcomes JSON'
              value={form.outcomes}
              onChange={(event) => setForm({ ...form, outcomes: event.target.value })}
            />
            <label className="text-xs text-text/70">Imágenes</label>
            <div className="grid gap-2 rounded-xl border border-black/20 bg-black/5 p-3">
              <div className="grid gap-2 md:grid-cols-[2fr_1fr_auto]">
                <input
                  id="exp-image-url"
                  className="rounded-lg border border-black/30 bg-transparent px-3 py-2 text-sm"
                  placeholder="URL de imagen"
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                />
                <input
                  id="exp-image-alt"
                  className="rounded-lg border border-black/30 bg-transparent px-3 py-2 text-sm"
                  placeholder="Texto alternativo"
                  value={imageAlt}
                  onChange={(event) => setImageAlt(event.target.value)}
                />
                <button
                  type="button"
                  className="rounded-full border border-black/70 px-4 py-2 text-xs text-black hover:border-black"
                  onClick={handleAddImage}
                >
                  Agregar
                </button>
              </div>
              {form.images.length > 0 ? (
                <div className="grid gap-2">
                  {form.images.map((image, index) => (
                    <div
                      key={`${image.src}-${index}`}
                      className="flex flex-wrap items-center gap-2 rounded-lg border border-black/20 bg-white/5 p-2"
                    >
                      <img
                        src={image.src}
                        alt={image.alt || "Imagen"}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                      <div className="flex min-w-[200px] flex-1 flex-col gap-2">
                        <span className="text-xs text-text/70 break-all">{image.src}</span>
                        <input
                          className="rounded-md border border-black/30 bg-transparent px-2 py-1 text-xs"
                          placeholder="Texto alternativo"
                          value={image.alt}
                          onChange={(event) => handleUpdateImageAlt(index, event.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        className="rounded-full border border-red-400/50 px-3 py-1 text-xs text-red-400 hover:border-red-400"
                        onClick={() => handleRemoveImage(index)}
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text/60">No hay imágenes cargadas.</p>
              )}
            </div>
            <label className="text-xs text-text/70">Cupones</label>
            <div className="grid gap-2 rounded-xl border border-black/20 bg-black/5 p-3">
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,0.7fr)_auto]">
                <div className="min-w-0">
                  <label htmlFor="exp-cupon-codigo" className="text-xs text-text/70">
                    Código
                  </label>
                  <input
                    id="exp-cupon-codigo"
                    className="mt-2 w-full rounded-lg border border-black/30 bg-transparent px-3 py-2 text-sm"
                    placeholder="Código"
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                  />
                </div>
                <div className="min-w-0">
                  <label htmlFor="exp-cupon-descuento" className="text-xs text-text/70">
                    Descuento %
                  </label>
                  <input
                    id="exp-cupon-descuento"
                    type="number"
                    className="mt-2 w-full rounded-lg border border-black/30 bg-transparent px-3 py-2 text-sm"
                    placeholder="%"
                    value={couponPercent}
                    onChange={(event) => setCouponPercent(Number(event.target.value))}
                  />
                </div>
                <div className="min-w-0">
                  <label htmlFor="exp-cupon-minimo" className="text-xs text-text/70">
                    Cant. mínima
                  </label>
                  <input
                    id="exp-cupon-minimo"
                    type="number"
                    className="mt-2 w-full rounded-lg border border-black/30 bg-transparent px-3 py-2 text-sm"
                    placeholder="Cant. mínima"
                    value={couponMinQty}
                    onChange={(event) => setCouponMinQty(Number(event.target.value))}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    className="w-full rounded-full border border-black/70 px-4 py-2 text-xs text-black hover:border-black md:w-auto"
                    onClick={handleAddCoupon}
                  >
                    Agregar
                  </button>
                </div>
              </div>
              {form.coupons.length ? (
                <div className="grid gap-2">
                  {form.coupons.map((coupon, index) => (
                    <div
                      key={`${coupon.code}-${index}`}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-black/20 bg-white/5 p-2 text-xs"
                    >
                      <span className="text-text/80">
                        {coupon.code} · {coupon.percent}% · mínimo {coupon.minQty}
                      </span>
                      <button
                        type="button"
                        className="rounded-full border border-red-400/50 px-3 py-1 text-xs text-red-400 hover:border-red-400"
                        onClick={() => handleRemoveCoupon(index)}
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text/60">No hay cupones cargados.</p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="exp-imagen-archivo" className="text-xs text-text/70">
                Archivo de imagen
              </label>
              <input
                id="exp-imagen-archivo"
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
              <p className="text-sm text-muted">No hay experiencias cargadas.</p>
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
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
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

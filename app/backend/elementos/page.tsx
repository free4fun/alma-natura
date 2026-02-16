"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const emptyForm = {
  slug: "",
  name: "",
  category: "",
  categoryDescription: "",
  description: "",
  details: "",
  discountPercent: 0,
  coupons: [] as Array<{ code: string; percent: number; minQty: number }>,
  image: "",
  images: [] as Array<{ src: string; alt: string }>,
  price: 0,
};

type ElementItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  details?: string;
  discountPercent?: number;
  coupons?: Array<{ code: string; percent: number; minQty: number }>;
  image: string;
  images?: Array<{ src: string; alt: string }>;
  price: number;
};

type ElementCategory = {
  id: string;
  title: string;
  description: string;
};

export default function BackendElements() {
  const [items, setItems] = useState<ElementItem[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [categories, setCategories] = useState<ElementCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const secondaryImageInputRef = useRef<HTMLInputElement | null>(null);
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const categoryTitles = categories.map((category) => category.title);
  const [secondaryImageUrl, setSecondaryImageUrl] = useState("");
  const [secondaryImageAlt, setSecondaryImageAlt] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponPercent, setCouponPercent] = useState(10);
  const [couponMinQty, setCouponMinQty] = useState(1);

  const load = async () => {
    try {
      const [elementsRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/elements", { cache: "no-store" }),
        fetch("/api/admin/element-categories", { cache: "no-store" }),
      ]);

      if (!elementsRes.ok) {
        setItems([]);
      } else {
        const elementsData = await elementsRes.json();
        setItems(Array.isArray(elementsData) ? elementsData : []);
      }

      if (!categoriesRes.ok) {
        setCategories([]);
      } else {
        const categoriesData = await categoriesRes.json();
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      }
    } catch {
      setItems([]);
      setCategories([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [items, pageSize]);

  const handleEdit = (item: ElementItem) => {
    setForm({
      slug: item.slug,
      name: item.name,
      category: item.category,
      categoryDescription: "",
      description: item.description,
      details: item.details || "",
      image: item.image,
      images: Array.isArray(item.images) ? item.images : [],
      discountPercent: item.discountPercent ?? 0,
      coupons: Array.isArray(item.coupons) ? item.coupons : [],
      price: item.price,
    });
    setSecondaryImageUrl("");
    setSecondaryImageAlt("");
    setCouponCode("");
    setCouponPercent(10);
    setCouponMinQty(1);
  };


  const handleDelete = async (slug: string) => {
    await fetch("/api/admin/elements", {
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
        name: form.name.trim(),
        category: {
          title: form.category.trim(),
        },
        description: form.description.trim(),
        details: form.details.trim(),
        discountPercent: Number(form.discountPercent) || 0,
        coupons: form.coupons,
        image: form.image.trim(),
        images: form.images,
        price: Number(form.price) || 0,
      };

      const res = await fetch("/api/admin/elements", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body?.error || "No se pudo guardar.");
      }

      setForm({ ...emptyForm });
      setSecondaryImageUrl("");
      setSecondaryImageAlt("");
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
    setForm((prev) => ({ ...prev, image: data.url || prev.image }));
  };

  const handleSecondaryImageUpload = async () => {
    setError(null);
    const file = secondaryImageInputRef.current?.files?.[0];
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
    const url = data.url as string | undefined;
    if (!url) return;
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, { src: url, alt: secondaryImageAlt.trim() }],
    }));
    setSecondaryImageAlt("");
  };

  const handleAddSecondaryImage = () => {
    setError(null);
    const url = secondaryImageUrl.trim();
    if (!url) {
      setError("Ingresa una URL de imagen.");
      return;
    }
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, { src: url, alt: secondaryImageAlt.trim() }],
    }));
    setSecondaryImageUrl("");
    setSecondaryImageAlt("");
  };

  const handleRemoveSecondaryImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index),
    }));
  };

  const handleUpdateSecondaryAlt = (index: number, alt: string) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((img, idx) => (idx === index ? { ...img, alt } : img)),
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
          <h1 className="text-3xl font-semibold text-accent-1">Elementos</h1>
          <p className="mt-2 text-sm text-muted">Gestiona productos de la tienda.</p>
        </div>
        <Link href="/backend" className="text-sm text-accent-2 hover:text-accent-1">
          Volver al panel
        </Link>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-text/10 bg-background/80 p-6">
          <h2 className="text-lg font-semibold text-accent-1">Nuevo elemento</h2>
          {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
          <div className="mt-4 grid gap-3">
            <label htmlFor="elemento-slug" className="text-xs text-text/70">
              Slug
            </label>
            <input
              id="elemento-slug"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Slug"
              value={form.slug}
              onChange={(event) => setForm({ ...form, slug: event.target.value })}
            />
            <label htmlFor="elemento-nombre" className="text-xs text-text/70">
              Nombre
            </label>
            <input
              id="elemento-nombre"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Nombre"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
            <label htmlFor="elemento-categoria" className="text-xs text-text/70">
              Categoría
            </label>
            <select
              id="elemento-categoria"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
            >
              <option value="">Selecciona una categoría</option>
              {categoryTitles.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <label htmlFor="elemento-descripcion" className="text-xs text-text/70">
              Descripción
            </label>
            <textarea
              id="elemento-descripcion"
              className="min-h-[120px] rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Descripción"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
            <label htmlFor="elemento-detalles" className="text-xs text-text/70">
              Detalles (descripción larga)
            </label>
            <textarea
              id="elemento-detalles"
              className="min-h-[140px] rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Detalles o descripción larga"
              value={form.details}
              onChange={(event) => setForm({ ...form, details: event.target.value })}
            />
            <label htmlFor="elemento-imagen" className="text-xs text-text/70">
              Imagen (URL)
            </label>
            <input
              id="elemento-imagen"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Imagen (URL)"
              value={form.image}
              onChange={(event) => setForm({ ...form, image: event.target.value })}
            />
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="elemento-imagen-archivo" className="text-xs text-text/70">
                Archivo de imagen
              </label>
              <input
                id="elemento-imagen-archivo"
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
            <label htmlFor="elemento-precio" className="text-xs text-text/70">
              Precio
            </label>
            <input
              id="elemento-precio"
              type="number"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Precio"
              value={form.price}
              onChange={(event) => setForm({ ...form, price: Number(event.target.value) })}
            />
            <label htmlFor="elemento-descuento" className="text-xs text-text/70">
              Descuento (%)
            </label>
            <input
              id="elemento-descuento"
              type="number"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="0"
              value={form.discountPercent}
              onChange={(event) =>
                setForm({ ...form, discountPercent: Number(event.target.value) })
              }
            />
            <label className="text-xs text-text/70">Imágenes secundarias</label>
            <div className="grid gap-2 rounded-xl border border-black/20 bg-black/5 p-3">
              <div className="grid gap-2 md:grid-cols-[2fr_1fr_auto]">
                <input
                  className="rounded-lg border border-black/30 bg-transparent px-3 py-2 text-sm"
                  placeholder="URL de imagen"
                  value={secondaryImageUrl}
                  onChange={(event) => setSecondaryImageUrl(event.target.value)}
                />
                <input
                  className="rounded-lg border border-black/30 bg-transparent px-3 py-2 text-sm"
                  placeholder="Texto alternativo"
                  value={secondaryImageAlt}
                  onChange={(event) => setSecondaryImageAlt(event.target.value)}
                />
                <button
                  type="button"
                  className="rounded-full border border-black/70 px-4 py-2 text-xs text-black hover:border-black"
                  onClick={handleAddSecondaryImage}
                >
                  Agregar
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label htmlFor="elemento-imagen-secundaria" className="text-xs text-text/70">
                  Subir imagen secundaria
                </label>
                <input
                  id="elemento-imagen-secundaria"
                  ref={secondaryImageInputRef}
                  type="file"
                  accept="image/*"
                  className="rounded-full border border-black/30 px-3 py-1 text-xs text-black"
                />
                <button
                  type="button"
                  className="rounded-full border border-black/70 px-3 py-1 text-xs text-black hover:border-black"
                  onClick={handleSecondaryImageUpload}
                >
                  Subir
                </button>
              </div>
              {form.images.length ? (
                <div className="grid gap-2">
                  {form.images.map((img, index) => (
                    <div
                      key={`${img.src}-${index}`}
                      className="flex flex-wrap items-center gap-2 rounded-lg border border-black/20 bg-white/5 p-2"
                    >
                      <img
                        src={img.src}
                        alt={img.alt || "Imagen"}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                      <div className="flex min-w-[200px] flex-1 flex-col gap-2">
                        <span className="text-xs text-text/70 break-all">{img.src}</span>
                        <input
                          className="rounded-md border border-black/30 bg-transparent px-2 py-1 text-xs"
                          placeholder="Texto alternativo"
                          value={img.alt}
                          onChange={(event) => handleUpdateSecondaryAlt(index, event.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        className="rounded-full border border-red-400/50 px-3 py-1 text-xs text-red-400 hover:border-red-400"
                        onClick={() => handleRemoveSecondaryImage(index)}
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text/60">No hay imágenes secundarias.</p>
              )}
            </div>
            <label className="text-xs text-text/70">Cupones</label>
            <div className="grid gap-2 rounded-xl border border-black/20 bg-black/5 p-3">
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)_minmax(0,0.7fr)_auto]">
                <div className="min-w-0">
                  <label htmlFor="el-cupon-codigo" className="text-xs text-text/70">
                    Código
                  </label>
                  <input
                    id="el-cupon-codigo"
                    className="mt-2 w-full rounded-lg border border-black/30 bg-transparent px-3 py-2 text-sm"
                    placeholder="Código"
                    value={couponCode}
                    onChange={(event) => setCouponCode(event.target.value)}
                  />
                </div>
                <div className="min-w-0">
                  <label htmlFor="el-cupon-descuento" className="text-xs text-text/70">
                    Descuento %
                  </label>
                  <input
                    id="el-cupon-descuento"
                    type="number"
                    className="mt-2 w-full rounded-lg border border-black/30 bg-transparent px-3 py-2 text-sm"
                    placeholder="%"
                    value={couponPercent}
                    onChange={(event) => setCouponPercent(Number(event.target.value))}
                  />
                </div>
                <div className="min-w-0">
                  <label htmlFor="el-cupon-minimo" className="text-xs text-text/70">
                    Cant. mínima
                  </label>
                  <input
                    id="el-cupon-minimo"
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
                    <p className="text-sm font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-muted">/{item.slug}</p>
                    <p className="text-xs text-muted">{item.category}</p>
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
              <p className="text-sm text-muted">No hay elementos cargados.</p>
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

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ElementCategory = {
  id: string;
  title: string;
  description: string;
};

export default function BackendElementCategories() {
  const [items, setItems] = useState<ElementCategory[]>([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin/element-categories", { cache: "no-store" });
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

  const handleEdit = (item: ElementCategory) => {
    setForm({ title: item.title, description: item.description });
  };

  const handleDelete = async (title: string) => {
    await fetch("/api/admin/element-categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    load();
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
      };

      const res = await fetch("/api/admin/element-categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body?.error || "No se pudo guardar la categoría.");
      }

      setForm({ title: "", description: "" });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="px-6 py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-accent-1">Categorías de elementos</h1>
          <p className="mt-2 text-sm text-muted">
            Crea, edita o elimina categorías para organizar los elementos.
          </p>
        </div>
        <Link href="/backend" className="text-sm text-accent-2 hover:text-accent-1">
          Volver al panel
        </Link>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-text/10 bg-background/80 p-6">
          <h2 className="text-lg font-semibold text-accent-1">Nueva categoría</h2>
          {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
          <div className="mt-4 grid gap-3">
            <label htmlFor="categoria-titulo" className="text-xs text-text/70">
              Título
            </label>
            <input
              id="categoria-titulo"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Título de la categoría"
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />
            <label htmlFor="categoria-descripcion" className="text-xs text-text/70">
              Descripción
            </label>
            <textarea
              id="categoria-descripcion"
              className="min-h-[100px] rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Descripción breve"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
            <button
              type="button"
              className="rounded-full bg-[#2A4D3C] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#3A6F8F]"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-text/10 bg-background/80 p-6">
          <h2 className="text-lg font-semibold text-accent-1">Listado</h2>
          <div className="mt-4 grid gap-3">
            {items.length ? (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-start justify-between gap-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-muted">{item.description}</p>
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
                      onClick={() => handleDelete(item.title)}
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">No hay categorías cargadas.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

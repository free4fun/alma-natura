"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Subscriber = {
  id: string;
  email: string;
  status: string;
  source?: string;
  createdAt?: string;
};

const emptyForm = {
  id: "",
  email: "",
  status: "activo",
  source: "Manual",
};

export default function BackendNewsletter() {
  const [items, setItems] = useState<Subscriber[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const metrics = items.reduce(
    (acc, item) => {
      acc.total += 1;
      if (item.status === "activo") acc.active += 1;
      if (item.status === "inactivo") acc.inactive += 1;
      if (item.source) {
        acc.sources[item.source] = (acc.sources[item.source] || 0) + 1;
      }
      return acc;
    },
    { total: 0, active: 0, inactive: 0, sources: {} as Record<string, number> }
  );
  const topSources = Object.entries(metrics.sources)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const load = async () => {
    const res = await fetch("/api/admin/newsletter", { cache: "no-store" });
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

  const handleEdit = (item: Subscriber) => {
    setForm({
      id: item.id,
      email: item.email,
      status: item.status,
      source: item.source || "Manual",
    });
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/admin/newsletter", {
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
        email: form.email.trim(),
        status: form.status,
        source: form.source.trim() || "Manual",
      };
      const res = await fetch("/api/admin/newsletter", {
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

  const formatTimestamp = (value?: string) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toISOString().replace("T", " ").slice(0, 16);
  };

  return (
    <main className="px-6 py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-accent-1">Newsletter</h1>
          <p className="mt-2 text-sm text-muted">Gestiona suscriptores y estado.</p>
        </div>
        <Link href="/backend" className="text-sm text-accent-2 hover:text-accent-1">
          Volver al panel
        </Link>
      </header>

      <div className="mb-6 grid gap-4 rounded-2xl border border-text/10 bg-background/80 p-4 text-sm text-muted sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs text-text/60">Suscriptores</p>
          <p className="mt-1 text-lg font-semibold text-white">{metrics.total}</p>
        </div>
        <div>
          <p className="text-xs text-text/60">Activos</p>
          <p className="mt-1 text-lg font-semibold text-white">{metrics.active}</p>
        </div>
        <div>
          <p className="text-xs text-text/60">Inactivos</p>
          <p className="mt-1 text-lg font-semibold text-white">{metrics.inactive}</p>
        </div>
        <div>
          <p className="text-xs text-text/60">Origen principal</p>
          <p className="mt-1 text-lg font-semibold text-white">
            {topSources[0] ? `${topSources[0][0]} (${topSources[0][1]})` : "-"}
          </p>
        </div>
        {topSources.slice(1).map(([source, count]) => (
          <div key={source}>
            <p className="text-xs text-text/60">Origen</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {source} ({count})
            </p>
          </div>
        ))}
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-text/10 bg-background/80 p-6">
          <h2 className="text-lg font-semibold text-accent-1">Nuevo suscriptor</h2>
          {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
          <div className="mt-4 grid gap-3">
            <label htmlFor="newsletter-email" className="text-xs text-text/70">
              Email
            </label>
            <input
              id="newsletter-email"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
            <label htmlFor="newsletter-estado" className="text-xs text-text/70">
              Estado
            </label>
            <select
              id="newsletter-estado"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value })}
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
            <label htmlFor="newsletter-origen" className="text-xs text-text/70">
              Origen
            </label>
            <input
              id="newsletter-origen"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Origen"
              value={form.source}
              onChange={(event) => setForm({ ...form, source: event.target.value })}
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
                    <p className="text-sm font-semibold text-white">{item.email}</p>
                    <p className="text-xs text-muted">{item.status} · {item.source || "-"}</p>
                    <p className="text-xs text-muted">{formatTimestamp(item.createdAt)}</p>
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
              <p className="text-sm text-muted">No hay suscriptores todavía.</p>
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

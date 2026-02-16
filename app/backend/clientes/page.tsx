"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Customer = {
  id: string;
  name?: string | null;
  email: string;
  phone?: string | null;
  city?: string | null;
  totalOrders?: number;
  totalSpent?: number;
  lastOrderAt?: string | null;
};

const emptyForm = {
  id: "",
  name: "",
  email: "",
  phone: "",
  city: "",
};

export default function BackendCustomers() {
  const [items, setItems] = useState<Customer[]>([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const metrics = items.reduce(
    (acc, item) => {
      acc.totalCustomers += 1;
      acc.totalOrders += item.totalOrders ?? 0;
      acc.totalSpent += item.totalSpent ?? 0;
      return acc;
    },
    { totalCustomers: 0, totalOrders: 0, totalSpent: 0 }
  );
  const avgOrders = metrics.totalCustomers
    ? Math.round(metrics.totalOrders / metrics.totalCustomers)
    : 0;
  const avgSpent = metrics.totalCustomers
    ? Math.round(metrics.totalSpent / metrics.totalCustomers)
    : 0;

  const load = async () => {
    const res = await fetch("/api/admin/customers", { cache: "no-store" });
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

  const handleEdit = (item: Customer) => {
    setForm({
      id: item.id,
      name: item.name || "",
      email: item.email || "",
      phone: item.phone || "",
      city: item.city || "",
    });
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/admin/customers", {
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
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
      };
      const res = await fetch("/api/admin/customers", {
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

  const formatTimestamp = (value?: string | null) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toISOString().replace("T", " ").slice(0, 16);
  };

  return (
    <main className="px-6 py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-accent-1">Clientes</h1>
          <p className="mt-2 text-sm text-muted">Gestiona contactos y compras.</p>
        </div>
        <Link href="/backend" className="text-sm text-accent-2 hover:text-accent-1">
          Volver al panel
        </Link>
      </header>

      <div className="mb-6 grid gap-4 rounded-2xl border border-text/10 bg-background/80 p-4 text-sm text-muted sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs text-text/60">Clientes totales</p>
          <p className="mt-1 text-lg font-semibold text-white">{metrics.totalCustomers}</p>
        </div>
        <div>
          <p className="text-xs text-text/60">Pedidos totales</p>
          <p className="mt-1 text-lg font-semibold text-white">{metrics.totalOrders}</p>
        </div>
        <div>
          <p className="text-xs text-text/60">Total gastado</p>
          <p className="mt-1 text-lg font-semibold text-white">${metrics.totalSpent}</p>
        </div>
        <div>
          <p className="text-xs text-text/60">Promedio por cliente</p>
          <p className="mt-1 text-lg font-semibold text-white">${avgSpent}</p>
        </div>
        <div>
          <p className="text-xs text-text/60">Pedidos promedio</p>
          <p className="mt-1 text-lg font-semibold text-white">{avgOrders}</p>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-text/10 bg-background/80 p-6">
          <h2 className="text-lg font-semibold text-accent-1">Nuevo cliente</h2>
          {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
          <div className="mt-4 grid gap-3">
            <label htmlFor="cliente-nombre" className="text-xs text-text/70">
              Nombre
            </label>
            <input
              id="cliente-nombre"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Nombre"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
            <label htmlFor="cliente-email" className="text-xs text-text/70">
              Email
            </label>
            <input
              id="cliente-email"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
            <label htmlFor="cliente-telefono" className="text-xs text-text/70">
              Teléfono
            </label>
            <input
              id="cliente-telefono"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Teléfono"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
            />
            <label htmlFor="cliente-ciudad" className="text-xs text-text/70">
              Ciudad
            </label>
            <input
              id="cliente-ciudad"
              className="rounded-xl border border-black/30 bg-transparent px-3 py-2 text-sm"
              placeholder="Ciudad"
              value={form.city}
              onChange={(event) => setForm({ ...form, city: event.target.value })}
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
                    <p className="text-sm font-semibold text-white">{item.name || "Sin nombre"}</p>
                    <p className="text-xs text-muted">{item.email}</p>
                    <p className="text-xs text-muted">Último pedido: {formatTimestamp(item.lastOrderAt)}</p>
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
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted">
                  <span>Pedidos: {item.totalOrders ?? 0}</span>
                  <span>Gastado: ${item.totalSpent ?? 0}</span>
                  <span>Teléfono: {item.phone || "-"}</span>
                  <span>Ciudad: {item.city || "-"}</span>
                </div>
              </div>
              ))}
            {items.length === 0 ? (
              <p className="text-sm text-muted">No hay clientes cargados.</p>
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

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const statusOptions = [
  "pendiente",
  "pagado",
  "en_proceso",
  "completado",
  "cancelado",
];

type OrderItem = {
  id: string;
  productSlug: string;
  title: string;
  price: number;
  quantity: number;
};

type DownloadAccess = {
  id: string;
  fileSlug: string;
  email?: string | null;
  name?: string | null;
  createdAt: string;
};

type Order = {
  id: string;
  createdAt: string;
  status: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  document?: string | null;
  city?: string | null;
  address?: string | null;
  notes?: string | null;
  total: number;
  items: OrderItem[];
  downloadAccess: DownloadAccess[];
};

export default function BackendOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [draftStatus, setDraftStatus] = useState<Record<string, string>>({});
  const pageSize = 4;
  const [statusFilter, setStatusFilter] = useState("todos");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const formatTimestamp = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toISOString().replace("T", " ").slice(0, 16);
  };

  const load = async () => {
    const res = await fetch("/api/admin/orders", { cache: "no-store" });
    if (!res.ok) {
      setOrders([]);
      return;
    }
    try {
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setDraftStatus({});
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const from = fromDate ? new Date(`${fromDate}T00:00:00`) : null;
    const to = toDate ? new Date(`${toDate}T23:59:59.999`) : null;

    return orders.filter((order) => {
      if (statusFilter !== "todos" && order.status !== statusFilter) return false;
      const created = new Date(order.createdAt);
      if (from && created < from) return false;
      if (to && created > to) return false;
      return true;
    });
  }, [orders, statusFilter, fromDate, toDate]);

  const totals = useMemo(() => {
    return filteredOrders.reduce((acc, order) => acc + order.total, 0);
  }, [filteredOrders]);

  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
    const paidCount = orders.filter((order) =>
      ["pagado", "completado"].includes(order.status)
    ).length;
    const pendingCount = orders.filter((order) =>
      ["pendiente", "en_proceso"].includes(order.status)
    ).length;
    const avgTicket = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;
    return { totalOrders, totalRevenue, paidCount, pendingCount, avgTicket };
  }, [orders]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [filteredOrders.length, pageSize]);

  const updateStatus = async (id: string, status: string) => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body?.error || "No se pudo actualizar el estado.");
      }
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
          <h1 className="text-3xl font-semibold text-accent-1">Pedidos</h1>
          <p className="mt-2 text-sm text-muted">Gestiona compras y accesos.</p>
        </div>
        <Link href="/backend" className="text-sm text-accent-2 hover:text-accent-1">
          Volver al panel
        </Link>
      </header>

      {error ? <p className="mb-4 text-sm text-red-400">{error}</p> : null}

      <div className="mb-6 grid gap-4 rounded-2xl border border-text/10 bg-background/80 p-4 text-sm text-muted sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs text-text/60">Pedidos totales</p>
          <p className="mt-1 text-lg font-semibold text-white">{metrics.totalOrders}</p>
        </div>
        <div>
          <p className="text-xs text-text/60">Ventas totales</p>
          <p className="mt-1 text-lg font-semibold text-white">${metrics.totalRevenue}</p>
        </div>
        <div>
          <p className="text-xs text-text/60">Pagados / completados</p>
          <p className="mt-1 text-lg font-semibold text-white">{metrics.paidCount}</p>
        </div>
        <div>
          <p className="text-xs text-text/60">Pendientes / en proceso</p>
          <p className="mt-1 text-lg font-semibold text-white">{metrics.pendingCount}</p>
        </div>
        <div>
          <p className="text-xs text-text/60">Ticket promedio</p>
          <p className="mt-1 text-lg font-semibold text-white">${metrics.avgTicket}</p>
        </div>
        <div>
          <p className="text-xs text-text/60">Total filtrado</p>
          <p className="mt-1 text-lg font-semibold text-white">${totals}</p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 rounded-2xl border border-text/10 bg-background/80 p-4 text-sm text-muted md:grid-cols-3">
        <div className="grid gap-2">
          <label htmlFor="orders-status" className="text-xs text-text/70">
            Estado
          </label>
          <select
            id="orders-status"
            className="rounded-full border border-text/20 bg-transparent px-3 py-1 text-xs text-text"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="todos">Todos</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <label htmlFor="orders-from" className="text-xs text-text/70">
            Desde
          </label>
          <input
            id="orders-from"
            type="date"
            className="rounded-full border border-text/20 bg-transparent px-3 py-1 text-xs text-text"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="orders-to" className="text-xs text-text/70">
            Hasta
          </label>
          <input
            id="orders-to"
            type="date"
            className="rounded-full border border-text/20 bg-transparent px-3 py-1 text-xs text-text"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
          />
        </div>
      </div>

      <section className="grid gap-4">
        {filteredOrders
          .slice((page - 1) * pageSize, page * pageSize)
          .map((order) => (
          <article
            key={order.id}
            className="rounded-2xl border border-text/10 bg-background/80 p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Pedido #{order.id.slice(0, 6)}</h2>
                <p className="text-xs text-muted">{formatTimestamp(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  className="rounded-full border border-text/20 bg-transparent px-3 py-1 text-xs text-text"
                  value={draftStatus[order.id] ?? order.status}
                  onChange={(event) =>
                    setDraftStatus((prev) => ({
                      ...prev,
                      [order.id]: event.target.value,
                    }))
                  }
                  disabled={loading}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="rounded-full border border-text/20 px-3 py-1 text-xs text-text disabled:opacity-40"
                  onClick={() =>
                    updateStatus(order.id, draftStatus[order.id] ?? order.status)
                  }
                  disabled={
                    loading || (draftStatus[order.id] ?? order.status) === order.status
                  }
                >
                  Guardar
                </button>
                <span className="text-sm font-semibold text-accent-1">${order.total}</span>
              </div>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-text/10 bg-surface/60 p-4 text-sm">
                <h3 className="text-sm font-semibold text-accent-1">Cliente</h3>
                <p className="mt-2 text-muted">
                  {order.name || "Sin nombre"} · {order.email || "Sin email"}
                </p>
                <p className="text-muted">{order.phone || "Sin teléfono"}</p>
                <p className="text-muted">{order.document || "Sin documento"}</p>
                <p className="text-muted">
                  {order.city || "Sin ciudad"} · {order.address || "Sin dirección"}
                </p>
                {order.notes ? <p className="mt-2 text-muted">Notas: {order.notes}</p> : null}
              </div>
              <div className="rounded-xl border border-text/10 bg-surface/60 p-4 text-sm">
                <h3 className="text-sm font-semibold text-accent-1">Items</h3>
                <ul className="mt-2 grid gap-2 text-muted">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between">
                      <span>{item.title}</span>
                      <span>x{item.quantity}</span>
                    </li>
                  ))}
                </ul>
                {order.downloadAccess.length ? (
                  <div className="mt-4">
                    <h4 className="text-xs font-semibold text-accent-2">Accesos descargables</h4>
                    <ul className="mt-2 grid gap-1 text-xs text-muted">
                      {order.downloadAccess.map((access) => (
                        <li key={access.id}>
                          {access.fileSlug} · {access.email || "Sin email"}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </article>
          ))}
        {filteredOrders.length === 0 ? (
          <p className="text-sm text-muted">No hay pedidos con ese filtro.</p>
        ) : null}
      </section>
      {filteredOrders.length > 0 ? (
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
                setPage((prev) =>
                  Math.min(totalPages, prev + 1)
                )
              }
              disabled={page >= totalPages}
            >
              Siguiente
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}

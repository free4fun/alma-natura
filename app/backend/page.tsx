import Link from "next/link";

export const metadata = {
  title: "Backend | Alma Natura",
};

export default function BackendHome() {
  return (
    <main className="px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-accent-1">Panel de administración</h1>
        <p className="mt-2 text-sm text-muted">
          Accesos rápidos para gestionar experiencias, elementos, descargables y pedidos.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          href="/backend/experiencias"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-accent-2"
        >
          <h2 className="text-lg font-semibold text-accent-1">Experiencias</h2>
          <p className="mt-2 text-sm text-muted">Crear, editar o eliminar experiencias.</p>
        </Link>
        <Link
          href="/backend/elementos"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-accent-2"
        >
          <h2 className="text-lg font-semibold text-accent-1">Elementos</h2>
          <p className="mt-2 text-sm text-muted">Gestionar productos de la tienda.</p>
        </Link>
        <Link
          href="/backend/elementos-categorias"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-accent-2"
        >
          <h2 className="text-lg font-semibold text-accent-1">Categorías</h2>
          <p className="mt-2 text-sm text-muted">Crear, editar o eliminar categorías de elementos.</p>
        </Link>
        <Link
          href="/backend/descargables"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-accent-2"
        >
          <h2 className="text-lg font-semibold text-accent-1">Descargables</h2>
          <p className="mt-2 text-sm text-muted">Subir o editar archivos descargables.</p>
        </Link>
        <Link
          href="/backend/pedidos"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-accent-2"
        >
          <h2 className="text-lg font-semibold text-accent-1">Pedidos</h2>
          <p className="mt-2 text-sm text-muted">Revisar compras y accesos.</p>
        </Link>
        <Link
          href="/backend/clientes"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-accent-2"
        >
          <h2 className="text-lg font-semibold text-accent-1">Clientes</h2>
          <p className="mt-2 text-sm text-muted">Gestionar contactos y compras.</p>
        </Link>
        <Link
          href="/backend/newsletter"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-accent-2"
        >
          <h2 className="text-lg font-semibold text-accent-1">Newsletter</h2>
          <p className="mt-2 text-sm text-muted">Gestionar suscripciones.</p>
        </Link>
        <Link
          href="/backend/notas"
          className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-accent-2"
        >
          <h2 className="text-lg font-semibold text-accent-1">Notas</h2>
          <p className="mt-2 text-sm text-muted">Publicar y editar artículos.</p>
        </Link>
      </section>
    </main>
  );
}

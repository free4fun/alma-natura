import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/backend", label: "Panel" },
  { href: "/backend/experiencias", label: "Experiencias" },
  { href: "/backend/elementos", label: "Elementos" },
  { href: "/backend/descargables", label: "Descargables" },
  { href: "/backend/pedidos", label: "Pedidos" },
  { href: "/backend/clientes", label: "Clientes" },
  { href: "/backend/newsletter", label: "Newsletter" },
  { href: "/backend/notas", label: "Notas" },
  { href: "/backend/elementos-categorias", label: "Categorías" }
];

export default function BackendLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden">
      <div className="mx-auto w-full max-w-4xl px-3 pb-16 pt-8">
        <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
          <aside className="rounded-2xl bg-text p-5 text-background shadow-soft lg:sticky lg:top-28 lg:h-fit">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-background/50">
                  Admin
                </p>
                <p className="mt-1 text-lg font-semibold">Alma Natura</p>
              </div>
              <Link
                href="/"
                className="text-xs text-background/60 transition hover:text-background"
              >
                Ver sitio
              </Link>
            </div>
            <nav className="mt-6 grid gap-2 text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3 py-2 text-background/80 transition hover:bg-background/10 hover:text-background"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <div className="min-w-0 rounded-2xl border border-text/10 bg-surface/80 shadow-soft">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

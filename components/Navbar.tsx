"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Icon from "@/components/Icon";
import { useCart } from "@/components/CartProvider";

const navItems = [
  { href: "/experiencias", label: "Experiencias" },
  { href: "/descargables", label: "Descargables" },
  { href: "/elementos", label: "Elementos" },
  { href: "/notas", label: "Notas" },
  { href: "/acerca-de", label: "Acerca de" },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const linkClasses = (href: string) => {
    const isActive = pathname === href || pathname.startsWith(`${href}/`);
    return `relative inline-flex items-center transition-colors md:after:absolute md:after:left-0 md:after:-bottom-1 md:after:h-[2px] md:after:w-full md:after:origin-left md:after:scale-x-0 md:after:bg-accent2 md:after:transition-transform md:after:duration-200 md:hover:after:scale-x-100 ${
      isActive
        ? "!text-accent2 md:text-background md:after:scale-x-70"
        : "text-background/80 md:hover:text-background"
    }`;
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-background/10 bg-text text-background">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-12 py-2 md:py-4 sm:px-14 lg:px-24">
        <Link href="/" className="flex items-center gap-3 text-xl md:text-2xl font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-accent2">
            <Icon name="leaf" className="h-5 w-5" />
          </span>
          Alma Natura
        </Link>
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkClasses(item.href)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/carrito"
            className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-background text-background transition-all hover:border-buy2 hover:bg-buy2"
            aria-label="Ver carrito"
          >
            <Icon name="cart" className="h-5 w-5 text-background transition-colors group-hover:text-text" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-buy1 px-1 text-[10px] font-semibold text-background">
                {totalItems}
              </span>
            )}
          </Link>
          <Link
            href="/contacto"
            className="hidden h-10 items-center justify-center gap-2 rounded-full border border-background/30 px-4 text-sm font-semibold text-background/90 transition-all hover:text-accent2 hover:border-background hover:bg-background md:flex"
          >
            <span>Contacto</span>
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-background/30 text-background/90 transition-all hover:border-background hover:bg-background md:hidden"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <Icon name="menu" className="h-5 w-5 text-background/90 transition-colors group-hover:text-accent2" />
          </button>
        </div>
      </div>
      <div
        id="mobile-menu"
        className={`px-12 pb-4 sm:px-14 lg:px-24 md:hidden ${isOpen ? "block" : "hidden"}`}
      >
        <nav className="flex flex-col gap-3 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkClasses(item.href)}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contacto"
            className={linkClasses("/contacto")}
            onClick={() => setIsOpen(false)}
          >
            Contacto
          </Link>
        </nav>
      </div>
    </header>
  );
}

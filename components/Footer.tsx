import Link from "next/link";
import Icon from "@/components/Icon";
import { shortDisclaimer } from "@/lib/content";
import { contactEmail, socialLinks } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-background/10 bg-text text-background">
      <div className="mx-auto w-full max-w-6xl px-12 py-10 text-center sm:px-14 sm:text-left lg:px-24">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="flex items-center gap-3 text-xl font-semibold justify-center sm:justify-start">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-accent2">
                <Icon name="leaf" className="h-5 w-5" />
              </span>
              Alma Natura
            </p>
            <p className="mt-3 text-sm text-background/70 max-w-xs mx-auto sm:mx-0">
              {shortDisclaimer}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm justify-items-center sm:justify-items-start">
            <Link
              href="/experiencias"
              className="flex items-center gap-2 text-background/70 hover:text-background transition-colors"
            >
              <Icon name="compass" className="h-4 w-4 text-accent2" />
              Experiencias
            </Link>
            <Link
              href="/descargables"
              className="flex items-center gap-2 text-background/70 hover:text-background transition-colors"
            >
              <Icon name="download" className="h-4 w-4 text-accent2" />
              Descargables
            </Link>
            <Link
              href="/elementos"
              className="flex items-center gap-2 text-background/70 hover:text-background transition-colors"
            >
              <Icon name="tools" className="h-4 w-4 text-accent2" />
              Elementos
            </Link>
            <Link
              href="/notas"
              className="flex items-center gap-2 text-background/70 hover:text-background transition-colors"
            >
              <Icon name="message" className="h-4 w-4 text-accent2" />
              Notas
            </Link>
            <Link
              href="/acerca-de"
              className="flex items-center gap-2 text-background/70 hover:text-background transition-colors"
            >
              <Icon name="people" className="h-4 w-4 text-accent2" />
              Acerca de
            </Link>
            <Link
              href="/contacto"
              className="flex items-center gap-2 text-background/70 hover:text-background transition-colors"
            >
              <Icon name="mail" className="h-4 w-4 text-accent2" />
              Contacto
            </Link>
          </div>
          <div className="flex h-full flex-col justify-between text-sm items-center sm:items-start">
            <p className="flex items-center gap-2 text-sm text-background/70 justify-center sm:justify-start">
              <Icon name="pin" className="h-4 w-4" />
              Las Toscas, Uruguay
            </p>
            <div className="mt-6 grid gap-4 justify-items-center sm:justify-items-start">
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-2 text-background/70 hover:text-background transition-colors"
              >
                <Icon name="mail" className="h-4 w-4" />
                {contactEmail}
              </a>
              <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-background/70 hover:text-background transition-colors"
                  >
                    <Icon name={link.icon} className="h-4 w-4" />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="mt-10 text-center text-xs text-background/50">
          <span className="block md:inline">
            © {new Date().getFullYear()} Alma Natura.
          </span>{" "}
          <span className="block md:inline">Todos los derechos reservados.</span>
        </p>
      </div>
    </footer>
  );
}

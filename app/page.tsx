import type { Metadata } from "next";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Icon, { type IconName } from "@/components/Icon";
import NewsletterForm from "@/components/NewsletterForm";
import Section from "@/components/Section";
import { shortDefinition } from "@/lib/content";
import { getDownloads, getExperiences } from "@/lib/data";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Prácticas basadas en la naturaleza para la introspección personal con un marco simple y cercano.",
  openGraph: {
    title: "Inicio",
    description:
      "Prácticas basadas en la naturaleza para la introspección personal con un marco simple y cercano.",
    url: "/",
  },
};

export default async function Home() {
  const experiences = await getExperiences();
  const downloads = await getDownloads();
  return (
    <div>
      <section className="pt-20 md:pt-28 pb-12">
        <div className="mx-auto w-full max-w-8xl px-12 sm:px-16 lg:px-28">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="max-w-3xl">
            <p className="text-xl uppercase tracking-[0.4em] text-text/60 font-semibold underline decoration-accent1 decoration-[0.18em] underline-offset-8">
              Alma Natura
            </p>
            <h1 className="mt-6 text-2xl md:text-5xl leading-tight text-text font-semibold">
              Prácticas basadas en la naturaleza para la introspección personal.
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-text/90 font-medium">
              Un espacio para explorar, reflexionar y habitar el mundo interior con prácticas simples y cercanas.
            </p>
            <p className="mt-6 text-lg text-text/80">{shortDefinition}</p>
            </div>
            <div className="lg:justify-self-end">
              <div className="w-full overflow-hidden rounded-3xl sm:max-w-xl lg:max-w-none h-64 sm:h-80 lg:h-[28rem]">
                <img
                  src="/images/hero.webp"
                  alt="Ilustración de prácticas en la naturaleza"
                  className="h-full w-full rounded-3xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section
        title="Experiencias"
        subtitle="Elegí una experiencia y avanzá con un plan claro. Cada opción tiene detalle completo."
      >
        <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
            {experiences.map((item) => {
              const imageList = Array.isArray(item.images)
                ? (item.images as Array<{ src: string; alt?: string }>)
                : [];
              const image = imageList[0];

              return (
                <Card
                  key={item.title}
                  title={item.title}
                  icon={<Icon name={item.icon as IconName} className="h-5 w-5" />}
                >
                  <div className="flex h-full flex-col items-center gap-4 sm:flex-row sm:items-start">
                    {image?.src ? (
                      <div className="h-40 w-full max-w-[12rem] shrink-0 overflow-hidden rounded-2xl sm:h-32 sm:w-32 sm:max-w-none lg:h-40 lg:w-40">
                        <img
                          src={image.src}
                          alt={image.alt || item.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : null}
                    <div className="flex-1 min-w-0 flex flex-col gap-3 h-full">
                      <div className="space-y-3 md:min-h-[6rem]">
                        <p>{item.summary}</p>
                      </div>
                      <div className="md:min-h-[5.5rem]">
                        <ul className="space-y-2 text-sm text-text/70">
                          {(item.highlights as string[]).map((highlight) => (
                            <li key={highlight}>• {highlight}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex justify-end sm:justify-start mt-auto">
                        <Button href={`/experiencias/${item.slug}`} variant="primary" className="mt-2">
                          Ver experiencia
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>
      </Section>

      <Section
        title="Descargables"
        subtitle="Materiales en PDF con acceso directo. Elegí gratis o compra inmediata."
      >
        <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
          {downloads
            .filter((item) => "showOnHome" in item && Boolean(item.showOnHome))
            .map((item) => {
            const discountPercent =
              "discountPercent" in item && typeof item.discountPercent === "number"
                ? item.discountPercent
                : 0;
            const safeDiscount = Math.min(100, discountPercent);
            const discountedPrice = discountPercent
              ? Math.round(item.price * (1 - safeDiscount / 100))
              : item.price;
            const isFree = discountedPrice === 0;

            return (
              <Card
                key={item.title}
                title={item.title}
                icon={<Icon name="download" className="h-5 w-5" />}
              >
                <div className="flex-1">
                  <p>{item.description}</p>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  {isFree ? (
                    <span className="text-xs uppercase tracking-[0.2em] text-text/60">
                      Gratis
                    </span>
                  ) : (
                    <span />
                  )}
                  <Button href={`/descargables/${item.slug}`} variant="primary">
                    Ver detalles
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
        <div className="mt-16 flex justify-center">
          <Button href="/descargables" variant="outline">
            Ver todos los descargables
          </Button>
        </div>
      </Section>

      <Section
        title="Newsletter"
        subtitle="Recibí recursos concretos, prácticas breves y novedades. Un envío al mes."
      >
        <div className="flex justify-center">
          <div className="w-full max-w-3xl rounded-2xl border border-accent2/30 bg-accent2/10 p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 aspect-square items-center justify-center rounded-full bg-accent2/30 text-accent2">
                <Icon name="mail" className="h-5 w-5" />
              </span>
              <p className="text-sm text-text/70">Alta inmediata y sin pasos extra.</p>
            </div>
            <div className="mt-4">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Iniciá tu consulta"
        subtitle="Activá el contacto y recibí una respuesta en 24–48h con propuestas posibles."
      >
        <div className="flex justify-end sm:justify-start">
          <Button href="/contacto">Iniciar contacto</Button>
        </div>
      </Section>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Section from "@/components/Section";
import CheckoutCouponPrice from "@/components/CheckoutCouponPrice";
import { getAllProductSlugs, getProductBySlug } from "@/lib/data";

type PageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = params.slug;
  const item = await getProductBySlug(slug);

  if (!item) {
    return { title: "Checkout" };
  }

  return {
    title: `Checkout | ${item.title}`,
    description: item.description ?? undefined,
    openGraph: {
      title: `Checkout | ${item.title}`,
      description: item.description ?? undefined,
      url: `/checkout/${slug}`,
    },
  };
}

export default async function CheckoutPage({ params }: PageProps) {
  const slug = params.slug;
  const item = await getProductBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <div>
      <Section
        title="Checkout"
        subtitle="Confirmá la compra y accedé al contenido de inmediato."
      >
        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div className="rounded-2xl border border-text/10 bg-surface/80 p-6 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent1/15 text-accent2">
                  <Icon name="spark" className="h-5 w-5" />
                </div>
                <p className="text-sm uppercase tracking-[0.2em] text-text/60">
                  {item.title}
                </p>
              </div>
            </div>
            <p className="mt-4 text-text/80">{item.description ?? undefined}</p>
            <CheckoutCouponPrice
              basePrice={item.price ?? 0}
              discountPercent={item.discountPercent ?? 0}
              coupons={(item.coupons as Array<{ code: string; percent: number; minQty: number }>) || []}
            />
            <p className="mt-3 text-xs text-text/60">
              En productos físicos podés coordinar retiro o el envío queda a
              cargo de la persona compradora.
            </p>
            <form
              className="mt-6 grid gap-4"
              action="/api/checkout"
              method="post"
            >
              <input type="hidden" name="slug" value={slug} />
              <div className="grid gap-3">
                <div>
                  <label className="text-xs font-semibold text-text/70">
                    Nombre y apellido
                  </label>
                  <input
                    name="name"
                    required
                    className="mt-2 w-full rounded-xl border border-text/10 bg-background px-4 py-2 text-sm"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-text/70">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="mt-2 w-full rounded-xl border border-text/10 bg-background px-4 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text/70">
                      Teléfono
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      className="mt-2 w-full rounded-xl border border-text/10 bg-background px-4 py-2 text-sm"
                    />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-text/70">
                      Documento
                    </label>
                    <input
                      name="document"
                      required
                      className="mt-2 w-full rounded-xl border border-text/10 bg-background px-4 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text/70">
                      Ciudad
                    </label>
                    <input
                      name="city"
                      required
                      className="mt-2 w-full rounded-xl border border-text/10 bg-background px-4 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-text/70">
                    Dirección
                  </label>
                  <input
                    name="address"
                    required
                    className="mt-2 w-full rounded-xl border border-text/10 bg-background px-4 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text/70">
                    Aclaraciones
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    className="mt-2 w-full rounded-xl border border-text/10 bg-background px-4 py-2 text-sm"
                    placeholder="Ej: horarios de retiro, detalles de envío, referencias"
                  />
                </div>
              </div>
              <Button type="submit">Pagar con MercadoPago</Button>
            </form>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-text/10 bg-surface">
            <Image
              src={item.image ?? "/placeholder.png"}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </Section>
    </div>
  );
}

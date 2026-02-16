"use client";

import Button from "@/components/Button";
import Card from "@/components/Card";
import Icon, { type IconName } from "@/components/Icon";
import { useCart } from "@/components/CartProvider";

type ExperienceSummary = {
  title: string;
  slug: string;
  summary: string;
  highlights: string[];
  icon: IconName;
  image?: { src: string; alt?: string };
};

type ExperiencesGridProps = {
  items: ExperienceSummary[];
};

export default function ExperiencesGrid({ items }: ExperiencesGridProps) {
  const { addItem } = useCart();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((item) => (
        <Card
          key={item.title}
          title={item.title}
          icon={<Icon name={item.icon} className="h-5 w-5" />}
        >
          {item.image?.src ? (
            <div className="overflow-hidden rounded-2xl md:max-w-[50%] md:mx-auto">
              <img
                src={item.image.src}
                alt={item.image.alt || item.title}
                className="h-40 w-full object-cover md:h-20"
              />
            </div>
          ) : null}
          <p>{item.summary}</p>
          <ul className="space-y-2 text-sm text-text/70">
            {item.highlights.map((highlight) => (
              <li key={highlight}>• {highlight}</li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button href={`/experiencias/${item.slug}`} variant="outline">
              Detalles
            </Button>
            <button
              type="button"
              onClick={() => addItem(item.slug, 1)}
              aria-label={`Agregar ${item.title} al carrito`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-buy1 text-background shadow-soft transition hover:bg-buy2"
            >
              <span className="cart-add-wiggle">
                <Icon name="add" className="h-6 w-6" />
              </span>
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
}

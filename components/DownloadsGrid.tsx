"use client";

import Button from "@/components/Button";
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import { useCart } from "@/components/CartProvider";

type DownloadItem = {
  slug: string;
  title: string;
  description: string;
  access: string;
  price: number;
  discountPercent?: number | null;
};

type DownloadsGridProps = {
  items: DownloadItem[];
};

export default function DownloadsGrid({ items }: DownloadsGridProps) {
  const { addItem } = useCart();

  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
      {items.map((item) => (
        <Card
          key={item.title}
          title={item.title}
          icon={<Icon name="download" className="h-5 w-5" />}
        >
          {(() => {
            const safeDiscount = Math.min(100, Number(item.discountPercent) || 0);
            const discountedPrice = safeDiscount
              ? Math.round(item.price * (1 - safeDiscount / 100))
              : item.price;
            const isFree = discountedPrice === 0;

            return (
              <>
          <div className="flex-1">
            <p>{item.description}</p>
          </div>
          <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
            {isFree ? (
              <span className="text-xs uppercase tracking-[0.2em] text-text/60">
                Gratis
              </span>
            ) : (
              <span />
            )}
            <div className="text-right">
              {item.discountPercent ? (
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <p className="text-xs font-semibold text-red-500 line-through">
                    $ {item.price}
                  </p>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    -{Math.min(100, item.discountPercent)}%
                  </span>
                </div>
              ) : null}
              <p className="text-base font-bold text-black">
                $ {discountedPrice}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <Button href={`/descargables/${item.slug}`} variant="outline">
              Detalles
            </Button>
            <button
              type="button"
              onClick={() => addItem(item.slug, 1)}
              aria-label={`Agregar ${item.title} al carrito`}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-buy1 text-background transition hover:bg-buy2"
            >
              <span className="cart-add-wiggle">
                <Icon name="add" className="h-6 w-6" />
              </span>
            </button>
          </div>
              </>
            );
          })()}
        </Card>
      ))}
    </div>
  );
}

import type { Metadata } from "next";
import Section from "@/components/Section";
import ToolsCarousel from "@/components/ToolsCarousel";
import { getElements } from "@/lib/data";
import { Element as ElementModel } from "@prisma/client";

export const metadata: Metadata = {
  title: "Elementos",
  description:
    "Elementos con compra directa para sostener la práctica.",
  openGraph: {
    title: "Elementos",
    description:
      "Elementos con compra directa para sostener la práctica.",
    url: "/elementos",
  },
};

export default async function ElementosPage() {
  const rawElements = await getElements();
  const elements = rawElements.map((item: any) => ({
    ...item,
    details: item.details ?? null,
    image: item.image ?? null,
    name: item.name ?? null,
    id: item.id ?? null,
    slug: item.slug ?? null,
    discountPercent: item.discountPercent ?? null,
    coupons: item.coupons ?? null,
    images: item.images ?? null,
    price: item.price ?? null,
    createdAt: item.createdAt ?? null,
    updatedAt: item.updatedAt ?? null,
    description: item.description ?? null,
    category: item.category ?? null,
    categoryDescription: item.categoryDescription ?? null,
  })) as Array<ElementModel & { categoryDescription?: string | null }>;
  const categories = elements.reduce<
    Record<
      string,
      {
        title: string;
        description: string;
        items: Array<ElementModel & { categoryDescription?: string | null }>;
      }
    >
  >((acc, item) => {
      const key = item.category ?? "Sin categoría";
      if (!acc[key]) {
        acc[key] = {
          title: key,
          description:
            "categoryDescription" in item && item.categoryDescription
              ? item.categoryDescription
              : "Elementos seleccionados para sostener la práctica.",
          items: [],
        };
      }
      acc[key].items.push(item);
      return acc;
    }, {});

  const categoryList = Object.values(categories);

  return (
    <div>
      <Section
        title="Elementos"
        subtitle="Seleccioná elementos naturales y compralos directo. Todo llega listo para usar."
      >
        <div className="grid gap-10">
          {categoryList.map((category) => (
            <ToolsCarousel
              key={category.title}
              category={{
                title: category.title,
                description: category.description,
                items: category.items.map((item) => ({
                  slug: item.slug,
                  name: item.name ?? "",
                  price: item.price ?? 0,
                  discountPercent: item.discountPercent ?? 0,
                  description: item.description ?? "",
                  image: item.image ?? "",
                })),
              }}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}

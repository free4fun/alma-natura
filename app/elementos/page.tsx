import type { Metadata } from "next";
import type { Element } from "@prisma/client";
import Section from "@/components/Section";
import ToolsCarousel from "@/components/ToolsCarousel";
import { getElements } from "@/lib/data";

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
  const elements = (await getElements()) as Array<
    Element & { categoryDescription?: string | null }
  >;
  const categories = elements.reduce<
    Record<
      string,
      {
        title: string;
        description: string;
        items: Array<Element & { categoryDescription?: string | null }>;
      }
    >
  >((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = {
          title: item.category,
          description:
            "categoryDescription" in item && item.categoryDescription
              ? item.categoryDescription
              : "Elementos seleccionados para sostener la práctica.",
          items: [],
        };
      }
      acc[item.category].items.push(item);
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
                  name: item.name,
                  price: item.price,
                  discountPercent: item.discountPercent ?? 0,
                  description: item.description,
                  image: item.image,
                })),
              }}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}

import type { Metadata } from "next";
import Section from "@/components/Section";
import ExperiencesGrid from "@/components/ExperiencesGrid";
import type { IconName } from "@/components/Icon";
import { getExperiences } from "@/lib/data";

export const metadata: Metadata = {
  title: "Experiencias",
  description:
    "Experiencias claras y accionables. Elegí la que mejor se ajusta a tu objetivo.",
  openGraph: {
    title: "Experiencias",
    description:
      "Experiencias claras y accionables. Elegí la que mejor se ajusta a tu objetivo.",
    url: "/experiencias",
  },
};

export default async function ExperienciasPage() {
  const items = (await getExperiences()) as Array<{
    title: string;
    slug: string;
    summary: string;
    highlights: string[];
    icon: IconName;
    images?: Array<{ src: string; alt?: string }>;
  }>;

  return (
    <div>
      <Section
        title="Experiencias"
        subtitle="Elegí una experiencia, accedé al detalle completo y activá una consulta directa."
      >
        <ExperiencesGrid
          items={items.map((item) => ({
            title: item.title ?? "",
            slug: item.slug ?? "",
            summary: item.summary ?? "",
            highlights: item.highlights as string[],
            icon: item.icon as IconName,
            image: Array.isArray(item.images)
              ? (item.images as Array<{ src: string; alt?: string }>)[0]
              : undefined,
          }))}
        />
      </Section>
    </div>
  );
}

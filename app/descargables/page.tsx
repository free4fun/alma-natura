import type { Metadata } from "next";
import DownloadsListClient from "@/components/DownloadsListClient";
import { getDownloads } from "@/lib/data";

export const metadata: Metadata = {
  title: "Descargables",
  description:
    "Descargables en PDF con acceso inmediato. Elegí gratis o compra directa.",
  openGraph: {
    title: "Descargables",
    description:
      "Descargables en PDF con acceso inmediato. Elegí gratis o compra directa.",
    url: "/descargables",
  },
};

export default async function DescargablesPage() {
  const items = await getDownloads();
  return <DownloadsListClient items={items} />;
}

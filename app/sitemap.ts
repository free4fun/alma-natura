import type { MetadataRoute } from "next";
import { getAllProductSlugs, getElements, getExperiences } from "@/lib/data";
import { getPosts } from "@/lib/posts";
import { siteMetadata } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteMetadata.siteUrl;
  const lastModified = new Date();

  const slugs = await getAllProductSlugs();
  const elements = await getElements();
  const experiences = await getExperiences();
  const posts = await getPosts();
  const elementUrls = elements.map((item) => ({
    url: `${base}/elementos/${item.slug}`,
    lastModified,
  }));
  const experienceUrls = experiences.map((item) => ({
    url: `${base}/experiencias/${item.slug}`,
    lastModified,
  }));
  const noteUrls = posts
    .filter((post) => post.status === "publicado")
    .map((post) => ({
      url: `${base}/notas/${post.slug}`,
      lastModified,
    }));
  const checkoutUrls = slugs.map((slug) => ({
    url: `${base}/checkout/${slug}`,
    lastModified,
  }));

  return [
    { url: `${base}/`, lastModified },
    { url: `${base}/experiencias`, lastModified },
    { url: `${base}/experiencias/charlas`, lastModified },
    { url: `${base}/experiencias/talleres`, lastModified },
    { url: `${base}/experiencias/sesiones-1-a-1`, lastModified },
    { url: `${base}/experiencias/sesiones-grupales`, lastModified },
    ...experienceUrls,
    { url: `${base}/descargables`, lastModified },
    { url: `${base}/elementos`, lastModified },
    ...elementUrls,
    { url: `${base}/carrito`, lastModified },
    { url: `${base}/checkout`, lastModified },
    ...checkoutUrls,
    { url: `${base}/notas`, lastModified },
    ...noteUrls,
    { url: `${base}/herramientas`, lastModified },
    { url: `${base}/acerca-de`, lastModified },
    { url: `${base}/como-funciona`, lastModified },
    { url: `${base}/disclaimer`, lastModified },
    { url: `${base}/contacto`, lastModified },
  ];
}

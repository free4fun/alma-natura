import { PrismaClient, Element as ElementModel } from "@prisma/client";
const prisma = new PrismaClient();
import { getMockStore } from "@/lib/mockStore";
import { downloads as contentDownloads } from "@/lib/content";

const demoMode = process.env.DEMO_MODE === "true";

const normalizeExperienceDetails = <T extends { summary?: string; details?: string | null }>(
  item: T
) => {
  if (!item) return item;
  if (!item.details) {
    return { ...item, details: item.summary || "" };
  }
  return item;
};

const downloadHighlightsMap = new Map(
  contentDownloads.map((item) => [item.slug, "highlights" in item ? item.highlights : []])
);

const normalizeDownloadHighlights = <T extends { slug: string; highlights?: string[] | null }>(
  item: T
) => {
  if (!item) return item;
  if (!item.highlights || !item.highlights.length) {
    const highlights = downloadHighlightsMap.get(item.slug) || [];
    return { ...item, highlights };
  }
  return item;
};

export async function getExperiences() {
  if (demoMode) {
    return getMockStore().experiences.map((item) => normalizeExperienceDetails(item));
  }
  try {
    const items = await prisma.experience.findMany({ orderBy: { createdAt: "asc" } });
    return items.map((item) => normalizeExperienceDetails({ ...item, summary: item.summary ?? "" }));
  } catch (error) {
    console.warn("DB no disponible: getExperiences", error);
    return getMockStore().experiences.map((item) => normalizeExperienceDetails(item));
  }
}

export async function getExperienceBySlug(slug: string) {
  if (demoMode) {
    const item = getMockStore().experiences.find((item) => item.slug === slug) || null;
    return item ? normalizeExperienceDetails({ ...item, summary: item.summary ?? "" }) : null;
  }
  try {
    const item = await prisma.experience.findUnique({ where: { slug } });
    return item ? normalizeExperienceDetails({ ...item, summary: item.summary ?? "" }) : null;
  } catch (error) {
    console.warn("DB no disponible: getExperienceBySlug", error);
    const item = getMockStore().experiences.find((item) => item.slug === slug) || null;
    return item ? normalizeExperienceDetails({ ...item, summary: item?.summary ?? "" }) : null;
  }
}

export async function getElements() {
  if (demoMode) {
    return getMockStore().elements;
  }
  try {
    const prismaCategory = prisma as unknown as {
      elementCategory: {
        findMany: (args: { orderBy: { title: "asc" | "desc" } }) => Promise<
          Array<{ title: string; description: string }>
        >;
      };
    };
    const [elements, categories] = await Promise.all([
      prisma.element.findMany({ orderBy: { category: "asc" } }) as Promise<ElementModel[]>,
      prismaCategory.elementCategory.findMany({ orderBy: { title: "asc" } }),
    ]);
    const categoryMap = new Map<string, string>(
      categories.map((category) => [category.title, category.description])
    );
    return elements.map((item) =>
      item.category && categoryMap.has(item.category)
        ? { ...item, categoryDescription: categoryMap.get(item.category) }
        : item
    );
  } catch (error) {
    console.warn("DB no disponible: getElements", error);
    return getMockStore().elements;
  }
}

export async function getElementBySlug(slug: string) {
  if (demoMode) {
    return getMockStore().elements.find((item) => item.slug === slug) || null;
  }
  try {
    const item = await prisma.element.findUnique({ where: { slug } });
    if (item) return item;
  } catch (error) {
    console.warn("DB no disponible: getElementBySlug", error);
  }
  return getMockStore().elements.find((item) => item.slug === slug) || null;
}

export async function getDownloads() {
  if (demoMode) {
    return getMockStore().downloads.map((item) => normalizeDownloadHighlights(item));
  }
  try {
    const items = await prisma.download.findMany({ orderBy: { createdAt: "asc" } });
    return items.map((item) => normalizeDownloadHighlights(item));
  } catch (error) {
    console.warn("DB no disponible: getDownloads", error);
    return getMockStore().downloads.map((item) => normalizeDownloadHighlights(item));
  }
}

export async function getDownloadBySlug(slug: string) {
  if (demoMode) {
    const item = getMockStore().downloads.find((item) => item.slug === slug) || null;
    return item ? normalizeDownloadHighlights(item) : null;
  }
  try {
    const item = await prisma.download.findUnique({ where: { slug } });
    if (item) return normalizeDownloadHighlights(item);
  } catch (error) {
    console.warn("DB no disponible: getDownloadBySlug", error);
  }
  const item = getMockStore().downloads.find((item) => item.slug === slug) || null;
  return item ? normalizeDownloadHighlights(item) : null;
}

export async function getProductBySlug(slug: string) {
  const resolveDiscountPercent = (item: unknown) => {
    const value = (item as { discountPercent?: number | null }).discountPercent;
    return typeof value === "number" ? value : 0;
  };

  const resolveCoupons = (item: unknown) => {
    const value = (item as { coupons?: unknown }).coupons;
    return Array.isArray(value) ? value : [];
  };

  const resolveFromStore = () => {
    const store = getMockStore();
    const experience = store.experiences.find((item) => item.slug === slug);
    const element = store.elements.find((item) => item.slug === slug);
    const download = store.downloads.find((item) => item.slug === slug);

    if (experience) {
      return {
        slug: experience.slug,
        title: experience.title,
        description: experience.summary,
        price: experience.price,
        discountPercent: resolveDiscountPercent(experience),
        coupons: resolveCoupons(experience),
        image: (experience.images as Array<{ src: string }>)[0]?.src || "",
        type: "experience" as const,
      };
    }

    if (element) {
      return {
        slug: element.slug,
        title: element.name,
        description: element.description,
        price: element.price,
        discountPercent: resolveDiscountPercent(element),
        coupons: resolveCoupons(element),
        image: element.image,
        type: "element" as const,
      };
    }

    if (download) {
      return {
        slug: download.slug,
        title: download.title,
        description: download.description,
        price: download.price,
        image: download.image,
        type: "download" as const,
        fileUrl: download.fileUrl,
        access: download.access,
      };
    }

    return null;
  };

  if (demoMode) {
    return resolveFromStore();
  }

  let experience = null;
  let element = null;
  let download = null;

  try {
    [experience, element, download] = await Promise.all([
      prisma.experience.findUnique({ where: { slug } }),
      prisma.element.findUnique({ where: { slug } }),
      prisma.download.findUnique({ where: { slug } }),
    ]);
  } catch (error) {
    console.warn("DB no disponible: getProductBySlug", error);
    return resolveFromStore();
  }

  if (experience) {
    return {
      slug: experience.slug,
      title: experience.title,
      description: experience.summary,
      price: experience.price,
      discountPercent: resolveDiscountPercent(experience),
      coupons: resolveCoupons(experience),
      image: Array.isArray(experience.images) ? (experience.images as Array<{ src: string }>)[0]?.src || "" : "",
      type: "experience" as const,
    };
  }

  if (element) {
    return {
      slug: element.slug,
      title: element.name,
      description: element.description,
      price: element.price,
      discountPercent: resolveDiscountPercent(element),
      coupons: resolveCoupons(element),
      image: element.image,
      type: "element" as const,
    };
  }

  if (download) {
    return {
      slug: download.slug,
      title: download.title,
      description: download.description,
      price: download.price,
      image: download.image,
      type: "download" as const,
      fileUrl: download.fileUrl,
      access: download.access,
    };
  }

  return null;
}

export async function getAllProductSlugs() {
  if (demoMode) {
    const store = getMockStore();
    return [
      ...store.experiences.map((item) => item.slug),
      ...store.elements.map((item) => item.slug),
      ...store.downloads.map((item) => item.slug),
    ];
  }
  let experiences: Array<{ slug: string }> = [];
  let elements: Array<{ slug: string }> = [];
  let downloads: Array<{ slug: string }> = [];

  try {
    [experiences, elements, downloads] = await Promise.all([
      prisma.experience.findMany({ select: { slug: true } }),
      prisma.element.findMany({ select: { slug: true } }),
      prisma.download.findMany({ select: { slug: true } }),
    ]);
  } catch (error) {
    console.warn("DB no disponible: getAllProductSlugs", error);
    const store = getMockStore();
    return [
      ...store.experiences.map((item) => item.slug),
      ...store.elements.map((item) => item.slug),
      ...store.downloads.map((item) => item.slug),
    ];
  }

  return [
    ...experiences.map((item) => item.slug),
    ...elements.map((item) => item.slug),
    ...downloads.map((item) => item.slug),
  ];
}

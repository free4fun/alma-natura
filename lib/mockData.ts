import {
  checkoutCatalog,
  downloads as legacyDownloads,
  formatPages,
  formatSummaries,
  toolsCategories,
} from "@/lib/content";

const fixedDate = (index: number) => {
  const base = new Date("2025-01-01T12:00:00.000Z");
  const date = new Date(base.getTime() + index * 86400000);
  return date.toISOString();
};

export const mockExperiences = formatSummaries.map((summary, index) => {
  const page = formatPages[summary.slug as keyof typeof formatPages];
  const checkout = checkoutCatalog[summary.slug as keyof typeof checkoutCatalog];

  return {
    id: `exp_${summary.slug}`,
    slug: summary.slug,
    title: summary.title,
    summary: summary.summary,
    details: page?.details || summary.summary,
    discountPercent: 0,
    coupons: [],
    intro: page?.intro ?? "",
    highlights: summary.highlights ?? [],
    bullets: page?.bullets ?? [],
    outcomes: page?.outcomes ?? [],
    images: page?.images ?? [],
    icon: summary.icon,
    price: checkout?.price ?? 0,
    createdAt: fixedDate(index),
    updatedAt: fixedDate(index),
  };
});

export const mockElements = toolsCategories.flatMap((category, index) =>
  category.items.map((item, itemIndex) => ({
    id: `el_${item.slug}`,
    slug: item.slug,
    name: item.name,
    category: category.title,
    categoryDescription: category.description,
    description: item.description,
    details: item.description,
    discountPercent: 0,
    coupons: [],
    image: item.image,
    images: [],
    price: item.price,
    createdAt: fixedDate(index + itemIndex),
    updatedAt: fixedDate(index + itemIndex),
  }))
);

export const mockElementCategories = toolsCategories.map((category, index) => ({
  id: `cat_${category.title.toLowerCase().replace(/\s+/g, "-")}`,
  title: category.title,
  description: category.description,
  createdAt: fixedDate(index),
  updatedAt: fixedDate(index),
}));

export const mockDownloads = legacyDownloads.map((item, index) => ({
  id: `dl_${item.slug}`,
  slug: item.slug,
  title: item.title,
  description: item.description,
  details: "details" in item ? item.details : "",
  highlights: "highlights" in item ? item.highlights : [],
  showOnHome: "showOnHome" in item ? item.showOnHome : false,
  access: item.access,
  fileUrl: item.fileUrl || "",
  image: "",
  price: item.access.toLowerCase().includes("gratis") ? 0 : 120,
  createdAt: fixedDate(index),
  updatedAt: fixedDate(index),
}));

export const mockOrders = Array.from({ length: 20 }).map((_, index) => {
  const product = mockElements[index % mockElements.length] || mockExperiences[0];
  const quantity = (index % 3) + 1;
  const total = product.price * quantity;

  return {
    id: `ord_${index + 1}`,
    createdAt: fixedDate(index + 1),
    status: index % 2 === 0 ? "pagado" : "pendiente",
    name: `Cliente Demo ${index + 1}`,
    email: `cliente${index + 1}@demo.local`,
    phone: "000000000",
    document: `DOC-${index + 1}`,
    city: "Montevideo",
    address: "Sin dirección",
    notes: "Pedido de demostración.",
    total,
    items: [
      {
        id: `item_${index + 1}`,
        productSlug: product.slug,
        title: "title" in product ? product.title : product.name,
        price: product.price,
        quantity,
      },
    ],
    downloadAccess: [],
  };
});

export const mockCustomers = Array.from({ length: 12 }).map((_, index) => ({
  id: `cus_${index + 1}`,
  name: `Cliente Demo ${index + 1}`,
  email: `cliente${index + 1}@demo.local`,
  phone: "000000000",
  city: "Montevideo",
  totalOrders: Math.max(1, (index % 4) + 1),
  totalSpent: 1000 + index * 75,
  lastOrderAt: fixedDate(index + 2),
}));

export const mockSubscribers = Array.from({ length: 12 }).map((_, index) => ({
  id: `sub_${index + 1}`,
  email: `suscriptor${index + 1}@demo.local`,
  status: index % 3 === 0 ? "inactivo" : "activo",
  source: index % 2 === 0 ? "Formulario" : "Landing",
  createdAt: fixedDate(index + 1),
}));

export const mockPosts = [
  {
    id: "post_1",
    slug: "rituales-diarios",
    title: "Rituales diarios para sostener tu práctica",
    category: "Prácticas",
    status: "publicado",
    coverImage: "/images/posts/rituales.svg",
    publishedAt: "2025-01-20T10:00:00.000Z",
    content: `# Rituales diarios\n\nUn ritual simple puede ayudarte a sostener la práctica sin esfuerzo.\n\n## Idea base\n- Elegí un momento fijo.\n- Empezá con 5 minutos.\n- Registrá una frase breve.\n`,
  },
  {
    id: "post_2",
    slug: "respiracion-consciente",
    title: "Respiración consciente: un ancla cotidiana",
    category: "Guías",
    status: "publicado",
    coverImage: "/images/posts/respiracion.svg",
    publishedAt: "2025-02-02T09:00:00.000Z",
    content: `# Respiración consciente\n\nUna práctica breve para bajar el ritmo y volver al cuerpo.\n\n## Paso a paso\n1. Inhalá 4 tiempos.\n2. Sostené 2 tiempos.\n3. Exhalá 6 tiempos.\n`,
  },
  {
    id: "post_3",
    slug: "bitacora-personal",
    title: "Bitácora personal: cómo registrar tu proceso",
    category: "Herramientas",
    status: "borrador",
    coverImage: "/images/posts/bitacora.svg",
    publishedAt: "2025-02-10T08:00:00.000Z",
    content: `# Bitácora personal\n\nUsá una hoja breve para observar patrones y avances.\n`,
  },
  {
    id: "post_4",
    slug: "ciclos-estacionales",
    title: "Ciclos estacionales y práctica interna",
    category: "Temporadas",
    status: "publicado",
    coverImage: "/images/posts/ciclos.svg",
    publishedAt: "2025-02-15T11:30:00.000Z",
    content: `# Ciclos estacionales\n\nCada ciclo sugiere un ritmo distinto. Elegí un foco simple para cada mes.\n`,
  },
];

import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getMockStore } from "@/lib/mockStore";

export async function GET() {
  const demoMode = process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL;
  if (demoMode) {
    return NextResponse.json(getMockStore().elements);
  }
  try {
    const items = await prisma.element.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(getMockStore().elements);
  }
}

export async function PUT(request: Request) {
  try {
    const payload = await request.json();
    const {
      slug,
      name,
      category,
      categoryDescription,
      description,
      details,
      discountPercent,
      coupons,
      image,
      images,
      price,
    } = payload;

    if (!slug || !name) {
      return NextResponse.json({ error: "Slug y nombre requeridos." }, { status: 400 });
    }

    const demoMode = process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL;
    const resolvedCategoryTitle =
      category && typeof category === "object"
        ? String((category as { title?: string }).title || "").trim()
        : String(category || "").trim();
    const resolvedCategoryDescription =
      category && typeof category === "object"
        ? String((category as { description?: string }).description || "").trim()
        : String(categoryDescription || "").trim();

    const resolveCategoryDescription = async () => {
      if (resolvedCategoryDescription) return resolvedCategoryDescription;
      if (!resolvedCategoryTitle) return "";
      if (demoMode) {
        const store = getMockStore();
        return (
          store.elementCategories.find(
            (item) => item.title.toLowerCase() === resolvedCategoryTitle.toLowerCase()
          )?.description || ""
        );
      }
      try {
        const item = await prisma.elementCategory.findUnique({
          where: { title: resolvedCategoryTitle },
        });
        return item?.description || "";
      } catch {
        return "";
      }
    };

    const resolvedCategory = {
      title: resolvedCategoryTitle,
      description: await resolveCategoryDescription(),
    };

    if (demoMode) {
      const store = getMockStore();
      const existingIndex = store.elements.findIndex((item) => item.slug === slug);
      const base = {
        slug,
        name,
        category: resolvedCategory.title,
        categoryDescription: resolvedCategory.description,
        description,
        details,
        discountPercent,
        coupons,
        image,
        images,
        price,
        updatedAt: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        store.elements[existingIndex] = { ...store.elements[existingIndex], ...base };
        return NextResponse.json(store.elements[existingIndex]);
      }

      const item = {
        id: `el_${slug}`,
        createdAt: new Date().toISOString(),
        ...base,
      };
      store.elements.unshift(item);
      return NextResponse.json(item);
    }

    const item = await prisma.element.upsert({
      where: { slug },
      update: {
        name,
        category: resolvedCategory.title,
        categoryDescription: resolvedCategory.description,
        description,
        details,
        discountPercent,
        coupons,
        image,
        images,
        price,
      },
      create: {
        slug,
        name,
        category: resolvedCategory.title,
        categoryDescription: resolvedCategory.description,
        description,
        details,
        discountPercent,
        coupons,
        image,
        images,
        price,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "No se pudo guardar." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { slug } = await request.json();
    if (!slug) {
      return NextResponse.json({ error: "Slug requerido." }, { status: 400 });
    }
    const demoMode = process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL;
    if (demoMode) {
      const store = getMockStore();
      store.elements = store.elements.filter((item) => item.slug !== slug);
      return NextResponse.json({ ok: true });
    }
    await prisma.element.delete({ where: { slug } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "No se pudo borrar." }, { status: 500 });
  }
}

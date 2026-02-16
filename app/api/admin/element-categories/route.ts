import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getMockStore } from "@/lib/mockStore";

const prismaCategory = prisma as unknown as {
  elementCategory: {
    findMany: (args: { orderBy: { title: "asc" | "desc" } }) => Promise<unknown[]>;
    upsert: (args: {
      where: { title: string };
      update: { description: string };
      create: { title: string; description: string };
    }) => Promise<unknown>;
    delete: (args: { where: { title: string } }) => Promise<unknown>;
  };
};

export async function GET() {
  const demoMode = process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL;
  if (demoMode) {
    return NextResponse.json(getMockStore().elementCategories || []);
  }
  try {
    const items = await prismaCategory.elementCategory.findMany({
      orderBy: { title: "asc" },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const payload = await request.json();
    const title = String(payload?.title || "").trim();
    const description = String(payload?.description || "").trim();

    if (!title) {
      return NextResponse.json({ error: "Título requerido." }, { status: 400 });
    }

    const demoMode = process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL;
    if (demoMode) {
      const store = getMockStore();
      const existingIndex = store.elementCategories.findIndex(
        (item) => item.title.toLowerCase() === title.toLowerCase()
      );
      const base = {
        title,
        description,
        updatedAt: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        store.elementCategories[existingIndex] = {
          ...store.elementCategories[existingIndex],
          ...base,
        };
        return NextResponse.json(store.elementCategories[existingIndex]);
      }

      const item = {
        id: `cat_${title.toLowerCase().replace(/\s+/g, "-")}`,
        createdAt: new Date().toISOString(),
        ...base,
      };
      store.elementCategories.unshift(item);
      return NextResponse.json(item);
    }

    const item = await prismaCategory.elementCategory.upsert({
      where: { title },
      update: { description },
      create: { title, description },
    });

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "No se pudo guardar." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { title } = await request.json();
    const resolvedTitle = String(title || "").trim();
    if (!resolvedTitle) {
      return NextResponse.json({ error: "Título requerido." }, { status: 400 });
    }
    const demoMode = process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL;
    if (demoMode) {
      const store = getMockStore();
      store.elementCategories = store.elementCategories.filter(
        (item) => item.title.toLowerCase() !== resolvedTitle.toLowerCase()
      );
      return NextResponse.json({ ok: true });
    }
    await prismaCategory.elementCategory.delete({ where: { title: resolvedTitle } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "No se pudo borrar." }, { status: 500 });
  }
}

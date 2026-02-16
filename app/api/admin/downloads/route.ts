import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { getMockStore } from "@/lib/mockStore";

export async function GET() {
  const demoMode = process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL;
  if (demoMode) {
    return NextResponse.json(getMockStore().downloads);
  }
  try {
    const items = await prisma.download.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(getMockStore().downloads);
  }
}

export async function PUT(request: Request) {
  try {
    const payload = await request.json();
    const { slug, title, description, details, showOnHome, access, fileUrl, image, price } = payload;

    if (!slug || !title) {
      return NextResponse.json({ error: "Slug y título requeridos." }, { status: 400 });
    }

    const demoMode = process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL;
    if (demoMode) {
      const store = getMockStore();
      const existingIndex = store.downloads.findIndex((item) => item.slug === slug);
      const base = {
        slug,
        title,
        description,
        details,
        showOnHome: Boolean(showOnHome),
        access,
        fileUrl,
        image,
        price,
        updatedAt: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        store.downloads[existingIndex] = { ...store.downloads[existingIndex], ...base };
        return NextResponse.json(store.downloads[existingIndex]);
      }

      const item = {
        id: `dl_${slug}`,
        createdAt: new Date().toISOString(),
        highlights: [],
        ...base,
      };
      store.downloads.unshift(item);
      return NextResponse.json(item);
    }

    const updateData = {
      title,
      description,
      details,
      showOnHome: Boolean(showOnHome),
      access,
      fileUrl,
      image,
      price,
    };
    const createData = {
      slug,
      title,
      description,
      details,
      showOnHome: Boolean(showOnHome),
      access,
      fileUrl,
      image,
      price,
    };
    const item = await prisma.download.upsert({
      where: { slug },
      update: updateData,
      create: createData,
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
      store.downloads = store.downloads.filter((item) => item.slug !== slug);
      return NextResponse.json({ ok: true });
    }
    await prisma.download.delete({ where: { slug } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "No se pudo borrar." }, { status: 500 });
  }
}

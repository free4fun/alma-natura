import { NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();
import { getMockStore } from "@/lib/mockStore";

export async function GET() {
  const demoMode = process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL;
  if (demoMode) {
    return NextResponse.json(getMockStore().experiences);
  }
  try {
    const items = await prisma.experience.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(getMockStore().experiences);
  }
}

export async function PUT(request: Request) {
  try {
    const payload = await request.json();
    const {
      slug,
      title,
      summary,
      details,
      discountPercent,
      coupons,
      intro,
      highlights,
      bullets,
      outcomes,
      images,
      icon,
      price,
    } = payload;

    if (!slug || !title) {
      return NextResponse.json({ error: "Slug y título requeridos." }, { status: 400 });
    }

    const demoMode = process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL;
    if (demoMode) {
      const store = getMockStore();
      const existingIndex = store.experiences.findIndex((item) => item.slug === slug);
      const base = {
        slug,
        title,
        summary,
        details,
        discountPercent,
        coupons,
        intro,
        highlights,
        bullets,
        outcomes,
        images,
        icon,
        price,
        updatedAt: new Date().toISOString(),
      };

      if (existingIndex >= 0) {
        store.experiences[existingIndex] = {
          ...store.experiences[existingIndex],
          ...base,
        };
        return NextResponse.json(store.experiences[existingIndex]);
      }

      const item = {
        id: `exp_${slug}`,
        createdAt: new Date().toISOString(),
        ...base,
      };
      store.experiences.unshift(item);
      return NextResponse.json(item);
    }

    const updateData = {
      title,
      summary,
      details,
      discountPercent,
      coupons,
      intro,
      highlights,
      bullets,
      outcomes,
      images,
      icon,
      price,
    } as Prisma.ExperienceUncheckedUpdateInput;

    const createData = {
      slug,
      title,
      summary,
      details,
      discountPercent,
      coupons,
      intro,
      highlights,
      bullets,
      outcomes,
      images,
      icon,
      price,
    } as Prisma.ExperienceUncheckedCreateInput;

    const item = await prisma.experience.upsert({
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
      store.experiences = store.experiences.filter((item) => item.slug !== slug);
      return NextResponse.json({ ok: true });
    }
    await prisma.experience.delete({ where: { slug } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "No se pudo borrar." }, { status: 500 });
  }
}

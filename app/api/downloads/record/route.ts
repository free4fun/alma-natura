import { NextResponse } from "next/server";
import prisma from "@/lib/db";

type DownloadPayload = {
  name?: string;
  email?: string;
  items: Array<{ slug: string; quantity?: number }>;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as DownloadPayload;
    const items = Array.isArray(payload.items) ? payload.items : [];

    if (!items.length) {
      return NextResponse.json({ error: "Sin descargas." }, { status: 400 });
    }

    const records = items.map((item) => ({
      fileSlug: item.slug,
      email: payload.email,
      name: payload.name,
    }));

    await prisma.downloadAccess.createMany({ data: records });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudo registrar la descarga." },
      { status: 500 }
    );
  }
}

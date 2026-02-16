import { NextResponse } from "next/server";
import { getMockStore } from "@/lib/mockStore";

export async function GET() {
  return NextResponse.json(getMockStore().posts);
}

export async function PUT(request: Request) {
  try {
    const payload = await request.json();
    const { id, slug, title, category, status, coverImage, publishedAt, content } = payload;

    if (!slug || !title) {
      return NextResponse.json({ error: "Slug y título requeridos." }, { status: 400 });
    }

    const store = getMockStore();
    const existingIndex = store.posts.findIndex((item) => item.id === id || item.slug === slug);
    const base = {
      slug,
      title,
      category: category || "General",
      status: status || "borrador",
      coverImage: coverImage || "",
      publishedAt: publishedAt || new Date("2025-02-01T12:00:00.000Z").toISOString(),
      content: content || "",
    };

    if (existingIndex >= 0) {
      store.posts[existingIndex] = { ...store.posts[existingIndex], ...base };
      return NextResponse.json(store.posts[existingIndex]);
    }

    const item = {
      id: id || `post_${Date.now()}`,
      ...base,
    };

    store.posts.unshift(item);
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "No se pudo guardar el artículo." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID requerido." }, { status: 400 });
    }
    const store = getMockStore();
    store.posts = store.posts.filter((item) => item.id !== id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "No se pudo borrar el artículo." }, { status: 500 });
  }
}

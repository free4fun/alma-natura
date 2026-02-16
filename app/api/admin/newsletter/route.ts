import { NextResponse } from "next/server";
import { getMockStore } from "@/lib/mockStore";

export async function GET() {
  return NextResponse.json(getMockStore().subscribers);
}

export async function PUT(request: Request) {
  try {
    const payload = await request.json();
    const { id, email, status, source } = payload;

    if (!email) {
      return NextResponse.json({ error: "Email requerido." }, { status: 400 });
    }

    const store = getMockStore();
    const existingIndex = store.subscribers.findIndex((item) => item.id === id || item.email === email);
    const base = {
      email,
      status: status || "activo",
      source: source || "Manual",
    };

    if (existingIndex >= 0) {
      store.subscribers[existingIndex] = { ...store.subscribers[existingIndex], ...base };
      return NextResponse.json(store.subscribers[existingIndex]);
    }

    const item = {
      id: id || `sub_${Date.now()}`,
      createdAt: new Date("2025-02-01T12:00:00.000Z").toISOString(),
      ...base,
    };

    store.subscribers.unshift(item);
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "No se pudo guardar el suscriptor." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID requerido." }, { status: 400 });
    }
    const store = getMockStore();
    store.subscribers = store.subscribers.filter((item) => item.id !== id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "No se pudo borrar el suscriptor." }, { status: 500 });
  }
}

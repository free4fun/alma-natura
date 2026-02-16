import { NextResponse } from "next/server";
import { getMockStore } from "@/lib/mockStore";

export async function GET() {
  return NextResponse.json(getMockStore().customers);
}

export async function PUT(request: Request) {
  try {
    const payload = await request.json();
    const { id, name, email, phone, city } = payload;

    if (!email) {
      return NextResponse.json({ error: "Email requerido." }, { status: 400 });
    }

    const store = getMockStore();
    const existingIndex = store.customers.findIndex((item) => item.id === id);
    const base = {
      name,
      email,
      phone,
      city,
    };

    if (existingIndex >= 0) {
      store.customers[existingIndex] = { ...store.customers[existingIndex], ...base };
      return NextResponse.json(store.customers[existingIndex]);
    }

    const item = {
      id: id || `cus_${Date.now()}`,
      totalOrders: 0,
      totalSpent: 0,
      lastOrderAt: "",
      ...base,
    };

    store.customers.unshift(item);
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "No se pudo guardar el cliente." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID requerido." }, { status: 400 });
    }
    const store = getMockStore();
    store.customers = store.customers.filter((item) => item.id !== id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "No se pudo borrar el cliente." }, { status: 500 });
  }
}

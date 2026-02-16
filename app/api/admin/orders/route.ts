import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { getMockStore } from "@/lib/mockStore";

export async function GET() {
  const demoMode = process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL;
  if (demoMode) {
    return NextResponse.json(getMockStore().orders);
  }
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true, downloadAccess: true },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(getMockStore().orders);
  }
}

export async function POST() {
  const demoMode = process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL;
  if (demoMode) {
    return NextResponse.json({ ok: true });
  }
  try {
    const order = await prisma.order.create({
      data: {
        status: "test",
        name: "Pedido de prueba",
        email: "test@almanatura.local",
        phone: "000000000",
        document: "TEST",
        city: "Montevideo",
        address: "Sin dirección",
        notes: "Pedido generado para pruebas.",
        total: 1000,
        items: {
          create: [
            {
              productSlug: "test-item",
              title: "Elemento de prueba",
              price: 1000,
              quantity: 1,
            },
          ],
        },
      },
      include: { items: true, downloadAccess: true },
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "No se pudo crear el pedido de prueba." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const demoMode = process.env.DEMO_MODE === "true" || !process.env.DATABASE_URL;
  if (demoMode) {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: "ID y estado requeridos." }, { status: 400 });
    }
    const orders = getMockStore().orders;
    const index = orders.findIndex((order) => order.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Pedido no encontrado." }, { status: 404 });
    }
    orders[index] = { ...orders[index], status };
    return NextResponse.json(orders[index]);
  }
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: "ID y estado requeridos." }, { status: 400 });
    }
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "No se pudo actualizar el pedido." }, { status: 500 });
  }
}

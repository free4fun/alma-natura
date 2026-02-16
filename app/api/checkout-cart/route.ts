import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { siteMetadata } from "@/lib/site";
import { getProductBySlug } from "@/lib/data";
import { calculatePricing } from "@/lib/pricing";

type CartPayloadItem = {
  slug: string;
  quantity: number;
  couponCode?: string;
};

type MercadoPagoItem = {
  id: string;
  title: string;
  quantity: number;
  currency_id: string;
  unit_price: number;
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const rawItems = String(formData.get("items") || "[]");
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const phone = String(formData.get("phone") || "");
    const document = String(formData.get("document") || "");
    const city = String(formData.get("city") || "");
    const address = String(formData.get("address") || "");
    const notes = String(formData.get("notes") || "");
    let parsed: CartPayloadItem[] = [];
    try {
      parsed = JSON.parse(rawItems) as CartPayloadItem[];
    } catch (error) {
      return NextResponse.json({ error: "Items inválidos." }, { status: 400 });
    }
    const maxQty = 25;
    const normalized = Array.isArray(parsed) ? parsed : [];
    const map = new Map<string, { quantity: number; couponCode?: string }>();
    for (const entry of normalized) {
      const slug = String(entry?.slug || "").trim();
      const rawQty = Number(entry?.quantity ?? 0);
      const couponCode = String(entry?.couponCode || "").trim();
      if (!slug || !Number.isFinite(rawQty)) continue;
      const qty = Math.max(1, Math.min(maxQty, Math.floor(rawQty)));
      const existing = map.get(slug);
      const nextQty = Math.min(maxQty, (existing?.quantity || 0) + qty);
      map.set(slug, { quantity: nextQty, couponCode: couponCode || existing?.couponCode });
    }
    const items = Array.from(map.entries()).map(([slug, quantity]) => ({
      slug,
      quantity: quantity.quantity,
      couponCode: quantity.couponCode,
    }));

    if (!items.length) {
      return NextResponse.json({ error: "Carrito vacío." }, { status: 400 });
    }

    const mpItems = (
      await Promise.all(
        items.map(async (entry) => {
          const product = await getProductBySlug(entry.slug);
          if (!product || product.price == null) return null;
          const pricing = calculatePricing({
            basePrice: product.price,
            quantity: Math.max(1, entry.quantity || 1),
            discountPercent: product.discountPercent ?? 0,
            coupons: (product.coupons as Array<{ code: string; percent: number; minQty: number }>) || [],
            couponCode: entry.couponCode,
          });
          return {
            id: entry.slug,
            title: product.title,
            quantity: Math.max(1, entry.quantity || 1),
            currency_id: "UYU",
            unit_price: pricing.unitPrice,
          } as MercadoPagoItem;
        })
      )
    ).filter((item): item is MercadoPagoItem => item !== null);

    if (!mpItems.length) {
      return NextResponse.json({ error: "Productos inválidos." }, { status: 400 });
    }

    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json(
        { error: "MercadoPago no configurado." },
        { status: 500 }
      );
    }

    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const total = mpItems.reduce(
      (acc, item) => acc + item.unit_price * item.quantity,
      0
    );

    const order = await prisma.order.create({
      data: {
        status: "pending",
        name,
        email,
        phone,
        document,
        city,
        address,
        notes,
        total,
        items: {
          create: mpItems.map((item) => ({
            productSlug: item.id,
            title: item.title,
            price: item.unit_price,
            quantity: item.quantity,
          })),
        },
      },
    });

    const response = await preference.create({
      body: {
        items: mpItems,
        payer: {
          name,
          email,
          phone: {
            number: phone,
          },
          identification: {
            type: "CI",
            number: document,
          },
          address: {
            street_name: address,
          },
        },
        metadata: {
          name,
          email,
          phone,
          document,
          city,
          address,
          notes,
          items,
        },
        external_reference: String(order.id),
        back_urls: {
          success: `${siteMetadata.siteUrl}/checkout?status=success`,
          failure: `${siteMetadata.siteUrl}/checkout?status=failure`,
          pending: `${siteMetadata.siteUrl}/checkout?status=pending`,
        },
        auto_return: "approved",
      },
    });

    if (response.id) {
      await prisma.order.update({
        where: { id: order.id },
        data: { mpPreferenceId: String(response.id) },
      });
    }

    const initPoint = response.init_point || response.sandbox_init_point;

    if (!initPoint) {
      return NextResponse.json(
        { error: "No se pudo crear el checkout." },
        { status: 500 }
      );
    }

    return NextResponse.redirect(initPoint);
  } catch (error) {
    return NextResponse.json(
      { error: "No se pudo iniciar el checkout." },
      { status: 500 }
    );
  }
}

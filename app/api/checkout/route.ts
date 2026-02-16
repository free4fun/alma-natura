import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { siteMetadata } from "@/lib/site";
import { getProductBySlug } from "@/lib/data";
import { calculatePricing } from "@/lib/pricing";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const slug = String(formData.get("slug") || "");
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const phone = String(formData.get("phone") || "");
    const document = String(formData.get("document") || "");
    const city = String(formData.get("city") || "");
    const address = String(formData.get("address") || "");
    const notes = String(formData.get("notes") || "");
    const coupon = String(formData.get("coupon") || "");
    const item = await getProductBySlug(slug);

    if (!item || item.price == null) {
      return NextResponse.json({ error: "Producto inválido o sin precio." }, { status: 400 });
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

    const pricing = calculatePricing({
      basePrice: item.price,
      quantity: 1,
      discountPercent: item.discountPercent ?? 0,
      coupons: (item.coupons as Array<{ code: string; percent: number; minQty: number }>) || [],
      couponCode: coupon,
    });

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
        total: pricing.subtotal,
        items: {
          create: [
            {
              productSlug: slug,
              title: item.title,
              price: pricing.unitPrice,
              quantity: 1,
            },
          ],
        },
      },
    });

    const response = await preference.create({
      body: {
        items: [
          {
            id: slug,
            title: item.title,
            quantity: 1,
            currency_id: "UYU",
            unit_price: pricing.unitPrice,
          },
        ],
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
          product: slug,
          coupon,
        },
        external_reference: String(order.id),
        back_urls: {
          success: `${siteMetadata.siteUrl}/checkout/${slug}?status=success`,
          failure: `${siteMetadata.siteUrl}/checkout/${slug}?status=failure`,
          pending: `${siteMetadata.siteUrl}/checkout/${slug}?status=pending`,
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

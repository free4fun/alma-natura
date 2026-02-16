import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slugs = searchParams.get("slugs");

  if (!slugs) {
    return NextResponse.json({ error: "Faltan slugs." }, { status: 400 });
  }

  const list = slugs.split(",").map((slug) => slug.trim()).filter(Boolean);

  const products = await Promise.all(list.map((slug) => getProductBySlug(slug)));
  return NextResponse.json(products.filter(Boolean));
}

import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const MAX_SIZE_BYTES = 12 * 1024 * 1024;

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const allowedPdfTypes = ["application/pdf"];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const kind = String(formData.get("kind") || "image");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Archivo requerido." }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "Archivo demasiado grande." }, { status: 400 });
    }

    const contentType = file.type;
    const isImage = allowedImageTypes.includes(contentType);
    const isPdf = allowedPdfTypes.includes(contentType);

    if (kind === "image" && !isImage) {
      return NextResponse.json({ error: "Formato de imagen inválido." }, { status: 400 });
    }

    if (kind === "pdf" && !isPdf) {
      return NextResponse.json({ error: "Formato de PDF inválido." }, { status: 400 });
    }

    if (kind !== "image" && kind !== "pdf") {
      return NextResponse.json({ error: "Tipo de archivo inválido." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || (isPdf ? ".pdf" : "");
    const filename = `${Date.now()}-${randomUUID()}${ext}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    await mkdir(uploadsDir, { recursive: true });
    await writeFile(path.join(uploadsDir, filename), buffer);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      filename,
    });
  } catch (error) {
    return NextResponse.json({ error: "No se pudo subir el archivo." }, { status: 500 });
  }
}

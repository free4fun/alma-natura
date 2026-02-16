import { NextResponse } from "next/server";
import { getTransporter } from "@/lib/mailer";
import { checkRateLimit } from "@/lib/rateLimit";
import { validateContactPayload } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const ipHeader =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const ip = ipHeader.split(",")[0].trim();

    const rate = checkRateLimit(ip);
    if (!rate.ok) {
      return NextResponse.json(
        { ok: false, error: "Demasiadas solicitudes. Intentá más tarde." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validation = validateContactPayload(body);

    if (!validation.ok) {
      return NextResponse.json(
        { ok: false, error: validation.error },
        { status: 400 }
      );
    }

    const { nombre, email, formato, mensaje, company } = validation.data;

    if (company && company.length > 0) {
      return NextResponse.json(
        { ok: false, error: "Solicitud inválida." },
        { status: 400 }
      );
    }

    const mailFrom = process.env.MAIL_FROM;
    const mailTo = process.env.MAIL_TO;
    const siteUrl = process.env.SITE_URL || "http://localhost:3000";

    if (!mailFrom || !mailTo) {
      return NextResponse.json(
        { ok: false, error: "Configuración de correo incompleta." },
        { status: 500 }
      );
    }

    const transporter = getTransporter();

    await transporter.sendMail({
      from: mailFrom,
      to: mailTo,
      replyTo: email,
      subject: `Nueva consulta Alma Natura — ${nombre}`,
      text: `Nueva consulta desde el sitio Alma Natura\n\nNombre: ${nombre}\nEmail: ${email}\nExperiencia: ${formato}\n\nMensaje:\n${mensaje}`,
      html: `
        <p><strong>Nueva consulta desde el sitio Alma Natura</strong></p>
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Experiencia:</strong> ${formato}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${mensaje.replace(/\n/g, "<br />")}</p>
      `,
    });

    await transporter.sendMail({
      from: mailFrom,
      to: email,
      subject: "Recibimos tu consulta — Alma Natura",
      text: `Hola ${nombre},\n\nGracias por escribir. Recibimos tu consulta y respondemos en 24–48h con propuestas posibles.\n\nAlma Natura ofrece un espacio de prácticas basadas en la naturaleza para la introspección personal.\n\nPodés conocer más en ${siteUrl}.\n\nAlma Natura`,
      html: `
        <p>Hola ${nombre},</p>
        <p>Gracias por escribir. Recibimos tu consulta y respondemos en 24–48h con propuestas posibles.</p>
        <p>Alma Natura ofrece un espacio de prácticas basadas en la naturaleza para la introspección personal.</p>
        <p>Podés conocer más en <a href="${siteUrl}">${siteUrl}</a>.</p>
        <p>Alma Natura</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "No se pudo enviar el mensaje." },
      { status: 500 }
    );
  }
}

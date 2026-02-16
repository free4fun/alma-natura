const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const allowedFormats = [
  "Charlas",
  "Talleres",
  "Sesiones 1 a 1",
  "Sesiones Grupales",
  "No estoy seguro",
] as const;

export type AllowedFormat = (typeof allowedFormats)[number];

export type ContactPayload = {
  nombre: string;
  email: string;
  formato: AllowedFormat;
  mensaje: string;
  company?: string;
};

const sanitize = (value: string) => value.trim().replace(/\s+/g, " ");

export const validateContactPayload = (payload: ContactPayload) => {
  const nombre = sanitize(payload.nombre || "");
  const email = sanitize(payload.email || "");
  const formato = payload.formato;
  const mensaje = sanitize(payload.mensaje || "");
  const company = sanitize(payload.company || "");

  if (nombre.length < 2 || nombre.length > 80) {
    return { ok: false, error: "Nombre inválido." } as const;
  }

  if (!emailRegex.test(email)) {
    return { ok: false, error: "Email inválido." } as const;
  }

  if (!allowedFormats.includes(formato)) {
    return { ok: false, error: "Experiencia inválida." } as const;
  }

  if (mensaje.length < 10 || mensaje.length > 2000) {
    return { ok: false, error: "Mensaje inválido." } as const;
  }

  return {
    ok: true,
    data: { nombre, email, formato, mensaje, company },
  } as const;
};

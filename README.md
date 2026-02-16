# Alma Natura

Sitio web para Alma Natura (Next.js App Router + Tailwind CSS). Diseño sobrio, accesible y production-ready.

## Instalación

```bash
npm install
```

## Variables de entorno

Crear un archivo .env.local con las siguientes variables (ver .env.example):

```bash
DATABASE_URL="file:./dev.db"
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
MAIL_TO=
SITE_URL=
MP_ACCESS_TOKEN=
```

## Desarrollo

```bash
npm run dev
```

## Build

```bash
npm run build
npm run start
```

## Probar endpoint de contacto

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Nombre","email":"email@dominio.com","formato":"No estoy seguro","mensaje":"Mensaje de prueba válido"}'
```

## Notas

- El rate limit es in-memory con ventana de 10 minutos. En entornos serverless se recomienda usar un store externo (Upstash/Redis) para persistencia.
- El formulario incluye un campo honeypot invisible para reducir spam.

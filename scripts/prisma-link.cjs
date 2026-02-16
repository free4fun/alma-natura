const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const prismaDir = path.join(root, "node_modules", ".prisma");
const clientDir = path.join(root, "node_modules", "@prisma", "client");
const target = path.join(clientDir, ".prisma");

try {
  if (!fs.existsSync(prismaDir)) {
    console.warn("[prisma-link] node_modules/.prisma no existe. Ejecuta 'npx prisma generate'.");
    process.exit(0);
  }

  if (fs.existsSync(target)) {
    process.exit(0);
  }

  fs.symlinkSync(prismaDir, target, "junction");
  // eslint-disable-next-line no-console
  console.log("[prisma-link] Symlink creado: @prisma/client/.prisma -> node_modules/.prisma");
} catch (error) {
  console.warn("[prisma-link] No se pudo crear el symlink:", error);
}

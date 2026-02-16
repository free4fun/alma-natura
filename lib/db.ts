import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const databaseUrl = process.env.DATABASE_URL;
const demoMode = process.env.DEMO_MODE === "true";

let prisma: PrismaClient;

if (!databaseUrl || demoMode) {
  const handler: ProxyHandler<object> = {
    get() {
      throw new Error("Base de datos deshabilitada por DEMO_MODE o DATABASE_URL faltante.");
    },
  };
  prisma = new Proxy({}, handler) as PrismaClient;
} else {
  prisma = global.prisma || new PrismaClient();
  if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
  }
}

export default prisma;

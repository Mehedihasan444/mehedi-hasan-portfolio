import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

async function gracefulShutdown(signal: string) {
  try {
    await prisma.$disconnect();
  } finally {
    console.log(`Prisma disconnected on ${signal}`);
  }
}

if (typeof process !== "undefined" && process.once) {
  process.once("SIGINT", () => void gracefulShutdown("SIGINT"));
  process.once("SIGTERM", () => void gracefulShutdown("SIGTERM"));
}

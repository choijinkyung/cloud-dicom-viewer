import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var __dicomViewerPrisma__: PrismaClient | undefined;
}

export const dbPackageName = "@dicom-viewer/db";

export const prisma =
  globalThis.__dicomViewerPrisma__ ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__dicomViewerPrisma__ = prisma;
}

"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

const settingsSchema = z.object({
  whatsappNumber: z
    .string()
    .trim()
    .min(8)
    .max(20)
    .regex(/^[0-9]+$/, "Use só números, com DDI e DDD (ex: 5511999999999)"),
  instagramUrl: z.string().trim().url().max(300),
  mapsEmbedUrl: z.string().trim().url().max(2000),
  googleReviewUrl: z.string().trim().url().max(500),
  hoursWeekday: z.string().trim().min(1).max(60),
  hoursSaturday: z.string().trim().min(1).max(60),
  hoursSunday: z.string().trim().min(1).max(60),
});

export async function updateSiteSettings(formData: FormData) {
  await requireAdmin();

  const parsed = settingsSchema.safeParse({
    whatsappNumber: formData.get("whatsappNumber"),
    instagramUrl: formData.get("instagramUrl"),
    mapsEmbedUrl: formData.get("mapsEmbedUrl"),
    googleReviewUrl: formData.get("googleReviewUrl"),
    hoursWeekday: formData.get("hoursWeekday"),
    hoursSaturday: formData.get("hoursSaturday"),
    hoursSunday: formData.get("hoursSunday"),
  });

  if (!parsed.success) {
    throw new Error("Dados inválidos: " + parsed.error.issues.map((i) => i.message).join(", "));
  }
  const data = parsed.data;

  const db = getDb();
  const existing = await db.select({ id: siteSettings.id }).from(siteSettings).limit(1);

  if (existing.length > 0) {
    await db
      .update(siteSettings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(siteSettings.id, existing[0].id));
  } else {
    await db.insert(siteSettings).values({ id: 1, ...data });
  }

  revalidatePath("/admin/configuracoes");
  revalidatePath("/");
}

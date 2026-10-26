"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { inventoryItems } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

const UNITS = ["un", "kg", "g", "l", "ml", "pct"] as const;

const itemSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  name: z.string().trim().min(1).max(120),
  unit: z.enum(UNITS).default("un"),
  quantity: z.coerce.number().min(0).max(1_000_000),
  minQuantity: z.coerce.number().min(0).max(1_000_000),
  category: z.string().trim().max(60).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

function parseItemForm(formData: FormData) {
  const parsed = itemSchema.safeParse({
    id: formData.get("id") ?? undefined,
    name: formData.get("name"),
    unit: formData.get("unit") ?? "un",
    quantity: formData.get("quantity"),
    minQuantity: formData.get("minQuantity"),
    category: formData.get("category"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    throw new Error("Dados inválidos: " + parsed.error.issues.map((i) => i.message).join(", "));
  }
  return parsed.data;
}

export async function createInventoryItem(formData: FormData) {
  await requireAdmin();
  const data = parseItemForm(formData);
  const db = getDb();

  await db.insert(inventoryItems).values({
    name: data.name,
    unit: data.unit,
    quantity: Math.round(data.quantity * 100),
    minQuantity: Math.round(data.minQuantity * 100),
    category: data.category || null,
    notes: data.notes || null,
  });

  revalidatePath("/admin/estoque");
  revalidatePath("/admin");
}

export async function updateInventoryItem(formData: FormData) {
  await requireAdmin();
  const data = parseItemForm(formData);
  if (!data.id) throw new Error("Item inválido.");
  const db = getDb();

  await db
    .update(inventoryItems)
    .set({
      name: data.name,
      unit: data.unit,
      quantity: Math.round(data.quantity * 100),
      minQuantity: Math.round(data.minQuantity * 100),
      category: data.category || null,
      notes: data.notes || null,
      updatedAt: new Date(),
    })
    .where(eq(inventoryItems.id, data.id));

  revalidatePath("/admin/estoque");
  revalidatePath("/admin");
}

export async function adjustInventoryQuantity(id: number, deltaX100: number) {
  await requireAdmin();
  const parsedId = z.coerce.number().int().positive().parse(id);
  const db = getDb();

  const [item] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, parsedId));
  if (!item) throw new Error("Item não encontrado.");

  const nextQuantity = Math.max(0, item.quantity + deltaX100);
  await db
    .update(inventoryItems)
    .set({ quantity: nextQuantity, updatedAt: new Date() })
    .where(eq(inventoryItems.id, parsedId));

  revalidatePath("/admin/estoque");
  revalidatePath("/admin");
}

export async function deleteInventoryItem(id: number) {
  await requireAdmin();
  const parsedId = z.coerce.number().int().positive().parse(id);
  const db = getDb();
  await db.delete(inventoryItems).where(eq(inventoryItems.id, parsedId));
  revalidatePath("/admin/estoque");
  revalidatePath("/admin");
}

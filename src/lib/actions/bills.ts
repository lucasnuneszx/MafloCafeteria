"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { bills } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

const billSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  type: z.enum(["pagar", "receber"]).default("pagar"),
  description: z.string().trim().min(1).max(160),
  amount: z.coerce.number().positive().max(1_000_000),
  dueDate: z.string().trim().min(1).max(20),
  category: z.string().trim().max(60).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

function parseBillForm(formData: FormData) {
  const parsed = billSchema.safeParse({
    id: formData.get("id") ?? undefined,
    type: formData.get("type") ?? "pagar",
    description: formData.get("description"),
    amount: formData.get("amount"),
    dueDate: formData.get("dueDate"),
    category: formData.get("category"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    throw new Error("Dados inválidos: " + parsed.error.issues.map((i) => i.message).join(", "));
  }
  return parsed.data;
}

export async function createBill(formData: FormData) {
  await requireAdmin();
  const data = parseBillForm(formData);
  const db = getDb();

  await db.insert(bills).values({
    type: data.type,
    description: data.description,
    amountCents: Math.round(data.amount * 100),
    dueDate: data.dueDate,
    category: data.category || null,
    notes: data.notes || null,
  });

  revalidatePath("/admin/financeiro");
  revalidatePath("/admin");
}

export async function updateBill(formData: FormData) {
  await requireAdmin();
  const data = parseBillForm(formData);
  if (!data.id) throw new Error("Conta inválida.");
  const db = getDb();

  await db
    .update(bills)
    .set({
      type: data.type,
      description: data.description,
      amountCents: Math.round(data.amount * 100),
      dueDate: data.dueDate,
      category: data.category || null,
      notes: data.notes || null,
    })
    .where(eq(bills.id, data.id));

  revalidatePath("/admin/financeiro");
  revalidatePath("/admin");
}

export async function markBillPaid(id: number, paid: boolean) {
  await requireAdmin();
  const parsedId = z.coerce.number().int().positive().parse(id);
  const db = getDb();
  await db
    .update(bills)
    .set({ paidAt: paid ? new Date() : null })
    .where(eq(bills.id, parsedId));
  revalidatePath("/admin/financeiro");
  revalidatePath("/admin");
}

export async function deleteBill(id: number) {
  await requireAdmin();
  const parsedId = z.coerce.number().int().positive().parse(id);
  const db = getDb();
  await db.delete(bills).where(eq(bills.id, parsedId));
  revalidatePath("/admin/financeiro");
  revalidatePath("/admin");
}

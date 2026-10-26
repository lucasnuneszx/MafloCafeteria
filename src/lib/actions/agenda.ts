"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { weeklyAgenda } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

const DAY_LABELS: Record<number, string> = {
  0: "Domingo",
  1: "Segunda-feira",
  2: "Terça-feira",
  3: "Quarta-feira",
  4: "Quinta-feira",
  5: "Sexta-feira",
  6: "Sábado",
};

const agendaSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  timeLabel: z.string().trim().max(60).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
});

function parseAgendaForm(formData: FormData) {
  const parsed = agendaSchema.safeParse({
    id: formData.get("id") ?? undefined,
    dayOfWeek: formData.get("dayOfWeek"),
    title: formData.get("title"),
    description: formData.get("description"),
    timeLabel: formData.get("timeLabel"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) {
    throw new Error("Dados inválidos: " + parsed.error.issues.map((i) => i.message).join(", "));
  }

  return parsed.data;
}

export async function createAgendaItem(formData: FormData) {
  await requireAdmin();
  const data = parseAgendaForm(formData);
  const db = getDb();

  await db.insert(weeklyAgenda).values({
    dayOfWeek: data.dayOfWeek,
    dayLabel: DAY_LABELS[data.dayOfWeek] ?? "Dia",
    title: data.title,
    description: data.description || null,
    timeLabel: data.timeLabel || null,
    sortOrder: data.sortOrder,
  });

  revalidatePath("/admin/agenda");
  revalidatePath("/");
}

export async function updateAgendaItem(formData: FormData) {
  await requireAdmin();
  const data = parseAgendaForm(formData);
  if (!data.id) throw new Error("Item inválido.");
  const db = getDb();

  await db
    .update(weeklyAgenda)
    .set({
      dayOfWeek: data.dayOfWeek,
      dayLabel: DAY_LABELS[data.dayOfWeek] ?? "Dia",
      title: data.title,
      description: data.description || null,
      timeLabel: data.timeLabel || null,
      sortOrder: data.sortOrder,
      updatedAt: new Date(),
    })
    .where(eq(weeklyAgenda.id, data.id));

  revalidatePath("/admin/agenda");
  revalidatePath("/");
}

export async function toggleAgendaItemActive(id: number, active: boolean) {
  await requireAdmin();
  const parsedId = z.coerce.number().int().positive().parse(id);
  const db = getDb();
  await db
    .update(weeklyAgenda)
    .set({ active, updatedAt: new Date() })
    .where(eq(weeklyAgenda.id, parsedId));

  revalidatePath("/admin/agenda");
  revalidatePath("/");
}

export async function deleteAgendaItem(id: number) {
  await requireAdmin();
  const parsedId = z.coerce.number().int().positive().parse(id);
  const db = getDb();
  await db.delete(weeklyAgenda).where(eq(weeklyAgenda.id, parsedId));

  revalidatePath("/admin/agenda");
  revalidatePath("/");
}

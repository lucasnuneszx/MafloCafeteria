"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { reservations } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { checkRateLimit } from "@/lib/rate-limit";

const reservationSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z
    .string()
    .trim()
    .min(8)
    .max(20)
    .regex(/^[0-9+()\- ]+$/, "Telefone contém caracteres inválidos"),
  eventDate: z.string().trim().min(1).max(20),
  checkin: z.string().trim().max(10).optional().or(z.literal("")),
  occasion: z.string().trim().max(80).optional().or(z.literal("")),
  guests: z.coerce.number().int().min(1).max(500),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
  // Honeypot: real users never fill this hidden field. Bots that
  // autofill every input do — any non-empty value here is treated as a
  // bot submission below, so this must accept (not reject) a filled value.
  website: z.string().max(200).optional().or(z.literal("")),
  // Anti-bot timing check: forms filled in under 2s are almost always
  // scripted, not a person reading the fields.
  renderedAt: z.coerce.number().optional(),
});

export type CreateReservationInput = z.infer<typeof reservationSchema>;

export async function createReservation(input: CreateReservationInput) {
  const parsed = reservationSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("Dados inválidos.");
  }
  const data = parsed.data;

  // Silently drop obvious bot submissions instead of erroring — no need to
  // tip off the bot that it was caught.
  if (data.website) return;
  if (data.renderedAt && Date.now() - data.renderedAt < 2000) return;

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const allowedByPhone = await checkRateLimit(`reservation:phone:${data.phone}`, 3, 60);
  const allowedByIp = await checkRateLimit(`reservation:ip:${ip}`, 5, 60);
  if (!allowedByPhone || !allowedByIp) {
    throw new Error("Muitas tentativas. Tente novamente mais tarde ou fale direto pelo WhatsApp.");
  }

  const db = getDb();
  await db.insert(reservations).values({
    name: data.name,
    phone: data.phone,
    eventDate: data.eventDate,
    checkin: data.checkin || null,
    occasion: data.occasion || null,
    guests: data.guests,
    notes: data.notes || null,
    source: "site",
  });

  revalidatePath("/admin/reservas");
}

const adminReservationSchema = reservationSchema.omit({ website: true, renderedAt: true });

export async function createReservationAdmin(formData: FormData) {
  await requireAdmin();

  const parsed = adminReservationSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    eventDate: formData.get("eventDate"),
    checkin: formData.get("checkin"),
    occasion: formData.get("occasion"),
    guests: formData.get("guests"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    throw new Error("Dados inválidos: " + parsed.error.issues.map((i) => i.message).join(", "));
  }
  const data = parsed.data;

  const db = getDb();
  await db.insert(reservations).values({
    name: data.name,
    phone: data.phone,
    eventDate: data.eventDate,
    checkin: data.checkin || null,
    occasion: data.occasion || null,
    guests: data.guests,
    notes: data.notes || null,
    source: "admin",
  });

  revalidatePath("/admin/reservas");
}

const statusSchema = z.enum(["pendente", "confirmada", "cancelada"]);

export async function updateReservationStatus(id: number, status: string) {
  await requireAdmin();
  const parsedId = z.coerce.number().int().positive().parse(id);
  const parsedStatus = statusSchema.parse(status);
  const db = getDb();
  await db.update(reservations).set({ status: parsedStatus }).where(eq(reservations.id, parsedId));
  revalidatePath("/admin/reservas");
}

export async function deleteReservation(id: number) {
  await requireAdmin();
  const parsedId = z.coerce.number().int().positive().parse(id);
  const db = getDb();
  await db.delete(reservations).where(eq(reservations.id, parsedId));
  revalidatePath("/admin/reservas");
}

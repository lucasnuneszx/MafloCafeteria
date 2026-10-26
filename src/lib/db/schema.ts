import { pgTable, serial, text, integer, boolean, timestamp, pgPolicy } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// RLS note: every query in this app runs server-side only, through the
// single Neon owner role in DATABASE_URL — the browser never talks to
// Postgres directly, so RLS is not the access boundary (Clerk + the Server
// Functions in src/lib/actions/* are). RLS is enabled here as defense in
// depth for the future (e.g. a lower-privileged role added later), with a
// permissive "allow all" policy for the current single role. We deliberately
// do NOT use `FORCE ROW LEVEL SECURITY`: the owner role bypasses RLS by
// default, and forcing it without an airtight policy for that same role
// would lock the app out of its own tables.
const allowOwnerPolicy = (table: string) =>
  pgPolicy(`${table}_allow_owner`, {
    as: "permissive",
    for: "all",
    to: "public",
    using: sql`true`,
    withCheck: sql`true`,
  });

export const weeklyAgenda = pgTable(
  "weekly_agenda",
  {
    id: serial("id").primaryKey(),
    dayOfWeek: integer("day_of_week").notNull(), // 0 = domingo ... 6 = sábado
    dayLabel: text("day_label").notNull(), // ex: "Segunda-feira"
    title: text("title").notNull(), // ex: "Noite de Jazz"
    description: text("description"),
    timeLabel: text("time_label"), // ex: "19h — 22h"
    active: boolean("active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  () => [allowOwnerPolicy("weekly_agenda")]
).enableRLS();

export const rateLimitEvents = pgTable(
  "rate_limit_events",
  {
    id: serial("id").primaryKey(),
    key: text("key").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  () => [allowOwnerPolicy("rate_limit_events")]
).enableRLS();

export const reservations = pgTable(
  "reservations",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    eventDate: text("event_date").notNull(),
    checkin: text("checkin"),
    occasion: text("occasion"),
    guests: integer("guests"),
    notes: text("notes"),
    status: text("status").notNull().default("pendente"), // pendente | confirmada | cancelada
    source: text("source").notNull().default("site"), // site | admin
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  () => [allowOwnerPolicy("reservations")]
).enableRLS();

export const bills = pgTable(
  "bills",
  {
    id: serial("id").primaryKey(),
    type: text("type").notNull().default("pagar"), // pagar | receber
    description: text("description").notNull(),
    amountCents: integer("amount_cents").notNull(), // stored in cents to avoid float issues
    dueDate: text("due_date").notNull(), // 'YYYY-MM-DD'
    category: text("category"),
    notes: text("notes"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  () => [allowOwnerPolicy("bills")]
).enableRLS();

// Single-row table (id is always 1) holding the site's editable content —
// contact links and business hours — so the team can update them from
// /admin/configuracoes instead of asking for a code change + redeploy.
export const siteSettings = pgTable(
  "site_settings",
  {
    id: integer("id").primaryKey().default(1),
    whatsappNumber: text("whatsapp_number").notNull(),
    instagramUrl: text("instagram_url").notNull(),
    mapsEmbedUrl: text("maps_embed_url").notNull(),
    googleReviewUrl: text("google_review_url").notNull(),
    hoursWeekday: text("hours_weekday").notNull(),
    hoursSaturday: text("hours_saturday").notNull(),
    hoursSunday: text("hours_sunday").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  () => [allowOwnerPolicy("site_settings")]
).enableRLS();

export const inventoryItems = pgTable(
  "inventory_items",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    unit: text("unit").notNull().default("un"), // un | kg | g | l | ml | pct
    quantity: integer("quantity_x100").notNull().default(0), // stored ×100 to allow 2 decimals without floats
    minQuantity: integer("min_quantity_x100").notNull().default(0),
    category: text("category"),
    notes: text("notes"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  () => [allowOwnerPolicy("inventory_items")]
).enableRLS();

import { asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { weeklyAgenda } from "@/lib/db/schema";
import { todayDayOfWeek } from "@/lib/today";
import type { AgendaItem } from "@/types";

export async function getWeeklyAgenda(): Promise<AgendaItem[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(weeklyAgenda)
    .where(eq(weeklyAgenda.active, true))
    .orderBy(asc(weeklyAgenda.sortOrder));

  const todayDow = todayDayOfWeek();

  return rows.map((row) => ({
    id: row.id,
    dayLabel: row.dayLabel,
    title: row.title,
    description: row.description,
    timeLabel: row.timeLabel,
    isToday: row.dayOfWeek === todayDow,
  }));
}

import { desc } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { reservations } from "@/lib/db/schema";
import ReservationsList from "./reservations-list";
import ReservationCreateDialog from "./reservation-create-dialog";

export const dynamic = "force-dynamic";

export default async function AdminReservasPage() {
  const db = getDb();
  const items = await db.select().from(reservations).orderBy(desc(reservations.createdAt));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-[#352B28]">Reservas</h1>
          <p className="font-sans text-sm text-[rgba(53,43,40,0.65)] mt-1">
            Pedidos recebidos pelo site, ou registrados aqui pela equipe.
          </p>
        </div>
        <ReservationCreateDialog />
      </div>

      <ReservationsList items={items} />
    </div>
  );
}

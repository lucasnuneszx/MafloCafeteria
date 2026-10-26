import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { reservations, weeklyAgenda, bills } from "@/lib/db/schema";
import { getBillStatus } from "@/lib/money";
import { reservationsByMonth, cashFlowByMonth, occupancyByWeekday } from "@/lib/dashboard-charts";
import { todayISO, addDaysISO, todayDayOfWeek } from "@/lib/today";
import DashboardContent from "./dashboard-content";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const db = getDb();

  const [allReservations, allAgenda, allBills] = await Promise.all([
    db.select().from(reservations),
    db.select().from(weeklyAgenda).where(eq(weeklyAgenda.active, true)),
    db.select().from(bills),
  ]);

  const pendentes = allReservations.filter((r) => r.status === "pendente").length;
  const contasVencidas = allBills.filter((b) => getBillStatus(b.dueDate, b.paidAt) === "vencido").length;

  const stats = [
    { label: "Reservas pendentes", value: pendentes, href: "/admin/reservas" },
    { label: "Total de reservas", value: allReservations.length, href: "/admin/reservas" },
    { label: "Contas vencidas", value: contasVencidas, href: "/admin/financeiro" },
    { label: "Itens na agenda", value: allAgenda.length, href: "/admin/agenda" },
  ];

  const recentReservations = allReservations
    .slice()
    .reverse()
    .slice(0, 5)
    .map((r) => ({
      id: r.id,
      name: r.name,
      eventDate: r.eventDate,
      occasion: r.occasion,
      status: r.status,
    }));

  const reservasPorMes = reservationsByMonth(allReservations);
  const ocupacaoPorDia = occupancyByWeekday(allReservations);
  const fluxoDeCaixa = cashFlowByMonth(
    allBills.map((b) => ({
      type: b.type,
      amountCents: b.amountCents,
      paidAt: b.paidAt ? b.paidAt.toISOString() : null,
    }))
  );

  // Today briefing
  const today = todayISO();
  const in7Days = addDaysISO(today, 7);
  const todayDow = todayDayOfWeek();

  const upcomingReservations = allReservations.filter(
    (r) => r.eventDate >= today && r.eventDate <= in7Days && r.status !== "cancelada"
  ).length;
  const dueSoon = allBills.filter(
    (b) => !b.paidAt && b.dueDate >= today && b.dueDate <= in7Days
  ).length;
  const agendaHoje = allAgenda.filter((a) => a.dayOfWeek === todayDow).length;
  const reservasHoje = allReservations.filter(
    (r) => r.eventDate === today && r.status !== "cancelada"
  ).length;

  const briefing = { reservasHoje, upcomingReservations, dueSoon, agendaHoje };
  const todayLabel = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Bahia",
  }).format(new Date());

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-3xl text-[#352B28]">Painel</h1>
        <p className="font-sans text-sm text-[rgba(53,43,40,0.65)] mt-1">
          Visão geral da Maflô Cafeteria.
        </p>
      </div>

      <DashboardContent
        stats={stats}
        recentReservations={recentReservations}
        reservasPorMes={reservasPorMes}
        ocupacaoPorDia={ocupacaoPorDia}
        fluxoDeCaixa={fluxoDeCaixa}
        briefing={briefing}
        todayLabel={todayLabel}
      />
    </div>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ClipboardList,
  CalendarClock,
  TriangleAlert,
  CalendarDays,
  PartyPopper,
  Wallet,
  Sparkles,
} from "lucide-react";
import BarChart, { type BarChartDatum } from "@/components/admin/bar-chart";
import { formatCents } from "@/lib/money";

const easeOut = [0.22, 1, 0.36, 1] as const;

const STATUS_STYLES: Record<string, string> = {
  pendente: "bg-[#C58B66]/10 text-[#C58B66]",
  confirmada: "bg-emerald-100 text-emerald-700",
  cancelada: "bg-red-100 text-red-600",
};

interface Stat {
  label: string;
  value: number;
  href: string;
}

interface ReservationSummary {
  id: number;
  name: string;
  eventDate: string;
  occasion: string | null;
  status: string;
}

const ICONS = [ClipboardList, CalendarClock, TriangleAlert, CalendarDays];

interface Briefing {
  reservasHoje: number;
  upcomingReservations: number;
  dueSoon: number;
  agendaHoje: number;
}

export default function DashboardContent({
  stats,
  recentReservations,
  reservasPorMes,
  ocupacaoPorDia,
  fluxoDeCaixa,
  briefing,
  todayLabel,
}: {
  stats: Stat[];
  recentReservations: ReservationSummary[];
  reservasPorMes: BarChartDatum[];
  ocupacaoPorDia: BarChartDatum[];
  fluxoDeCaixa: BarChartDatum[];
  briefing: Briefing;
  todayLabel: string;
}) {
  const briefingItems = [
    { icon: PartyPopper, label: "reservas hoje", value: briefing.reservasHoje },
    { icon: CalendarClock, label: "nos próximos 7 dias", value: briefing.upcomingReservations },
    { icon: Wallet, label: "contas vencendo em 7 dias", value: briefing.dueSoon },
    { icon: CalendarDays, label: "itens ativos na agenda hoje", value: briefing.agendaHoje },
  ];

  return (
    <div className="flex flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeOut }}
        className="relative overflow-hidden rounded-2xl bg-[#1a1512] p-6 sm:p-8"
      >
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-[#C58B66]/20 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col gap-5">
          <div className="flex items-center gap-2 text-[#C58B66]">
            <Sparkles size={16} strokeWidth={1.75} />
            <span className="font-sans text-xs uppercase tracking-widest">Hoje é {todayLabel}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {briefingItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-2.5">
                  <Icon size={16} strokeWidth={1.75} className="text-[#C58B66] mt-0.5 shrink-0" />
                  <div>
                    <span className="font-heading text-2xl text-white">{item.value}</span>
                    <p className="font-sans text-xs text-white/50 leading-snug">{item.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = ICONS[i % ICONS.length];
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: easeOut }}
              whileHover={{ y: -3 }}
            >
              <Link
                href={stat.href}
                className="group flex flex-col gap-4 rounded-xl border border-[#E8E2DD] bg-white p-6 shadow-maflo hover:border-[#C58B66]/50 hover:shadow-[0_16px_40px_rgba(53,43,40,0.1)] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#C58B66]/10 text-[#C58B66] group-hover:bg-[#C58B66] group-hover:text-white transition-colors duration-300">
                    <Icon size={18} strokeWidth={1.75} />
                  </div>
                </div>
                <div>
                  <span className="font-heading text-3xl text-[#352B28]">{stat.value}</span>
                  <p className="font-sans text-sm text-[rgba(53,43,40,0.6)] mt-1">{stat.label}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28, ease: easeOut }}
          className="rounded-xl border border-[#E8E2DD] bg-white p-6 shadow-maflo"
        >
          <h2 className="font-heading text-xl text-[#352B28] mb-1">Reservas por mês</h2>
          <p className="font-sans text-xs text-[rgba(53,43,40,0.5)] mb-4">Últimos 6 meses, por data do evento.</p>
          <BarChart data={reservasPorMes} series={[{ key: "reservas", label: "Reservas", color: "#C58B66" }]} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.34, ease: easeOut }}
          className="rounded-xl border border-[#E8E2DD] bg-white p-6 shadow-maflo"
        >
          <h2 className="font-heading text-xl text-[#352B28] mb-1">Ocupação por dia da semana</h2>
          <p className="font-sans text-xs text-[rgba(53,43,40,0.5)] mb-4">Em quais dias mais entram reservas.</p>
          <BarChart data={ocupacaoPorDia} series={[{ key: "reservas", label: "Reservas", color: "#C58B66" }]} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: easeOut }}
          className="rounded-xl border border-[#E8E2DD] bg-white p-6 shadow-maflo lg:col-span-2"
        >
          <h2 className="font-heading text-xl text-[#352B28] mb-1">Entradas x Saídas</h2>
          <p className="font-sans text-xs text-[rgba(53,43,40,0.5)] mb-4">
            Últimos 6 meses, com base na data em que a conta foi paga/recebida.
          </p>
          <BarChart
            data={fluxoDeCaixa}
            series={[
              { key: "entrada", label: "Entradas", color: "#059669" },
              { key: "saida", label: "Saídas", color: "#dc2626" },
            ]}
            formatValue={(v) => formatCents(v * 100).replace("R$", "").trim()}
          />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.46, ease: easeOut }}
        className="rounded-xl border border-[#E8E2DD] bg-white p-6 shadow-maflo"
      >
        <h2 className="font-heading text-xl text-[#352B28] mb-4">Últimas reservas</h2>
        {recentReservations.length === 0 ? (
          <p className="font-sans text-sm text-[rgba(53,43,40,0.65)]">Nenhuma reserva ainda.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-[#E8E2DD]">
            {recentReservations.map((r, i) => (
              <motion.li
                key={r.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.35 + i * 0.05, ease: easeOut }}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div>
                  <p className="font-sans text-sm font-medium text-[#352B28]">{r.name}</p>
                  <p className="font-sans text-xs text-[rgba(53,43,40,0.6)]">
                    {r.eventDate} — {r.occasion}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 font-sans text-xs uppercase tracking-wide ${
                    STATUS_STYLES[r.status] ?? "bg-[#E8E2DD] text-[#352B28]"
                  }`}
                >
                  {r.status}
                </span>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}

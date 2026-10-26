"use client";

import { motion } from "framer-motion";
import { ArrowUpCircle, ArrowDownCircle, TriangleAlert, Scale } from "lucide-react";
import { formatCents } from "@/lib/money";

const easeOut = [0.22, 1, 0.36, 1] as const;

interface Summary {
  totalToPayCents: number;
  totalToReceiveCents: number;
  totalOverdueCents: number;
  monthBalanceCents: number;
}

export default function FinanceiroSummary({ summary }: { summary: Summary }) {
  const balancePositive = summary.monthBalanceCents >= 0;

  const cards = [
    {
      label: "A pagar",
      value: formatCents(summary.totalToPayCents),
      icon: ArrowUpCircle,
      tone: "text-red-500 bg-red-50",
    },
    {
      label: "A receber",
      value: formatCents(summary.totalToReceiveCents),
      icon: ArrowDownCircle,
      tone: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Vencido",
      value: formatCents(summary.totalOverdueCents),
      icon: TriangleAlert,
      tone: "text-red-600 bg-red-50",
    },
    {
      label: "Saldo do mês",
      value: `${balancePositive ? "+" : "-"} ${formatCents(Math.abs(summary.monthBalanceCents))}`,
      icon: Scale,
      tone: balancePositive ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.07, ease: easeOut }}
            whileHover={{ y: -3 }}
            className="flex flex-col gap-4 rounded-xl border border-[#E8E2DD] bg-white p-6 shadow-maflo hover:shadow-[0_16px_40px_rgba(53,43,40,0.1)] transition-all duration-300"
          >
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${card.tone}`}>
              <Icon size={18} strokeWidth={1.75} />
            </div>
            <div>
              <span className="font-heading text-2xl text-[#352B28]">{card.value}</span>
              <p className="font-sans text-sm text-[rgba(53,43,40,0.6)] mt-1">{card.label}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

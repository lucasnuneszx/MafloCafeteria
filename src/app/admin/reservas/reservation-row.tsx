"use client";

import { useTransition } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Trash2 } from "lucide-react";
import { updateReservationStatus, deleteReservation } from "@/lib/actions/reservations";
import { Badge } from "@/components/ui/badge";
import IconActionButton from "@/app/admin/icon-action-button";
import StyledSelect from "@/components/ui/styled-select";
import { useToast, useConfirm } from "@/app/admin/ui-provider";

interface ReservationItem {
  id: number;
  name: string;
  phone: string;
  eventDate: string;
  checkin: string | null;
  occasion: string | null;
  guests: number | null;
  notes: string | null;
  status: string;
  source: string;
}

const STATUS_OPTIONS = ["pendente", "confirmada", "cancelada"];

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive"> = {
  pendente: "secondary",
  confirmada: "default",
  cancelada: "destructive",
};

function formatDate(d: string) {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

export default function ReservationRow({ item, index = 0 }: { item: ReservationItem; index?: number }) {
  const [isPending, startTransition] = useTransition();
  const showToast = useToast();
  const confirmDialog = useConfirm();

  function handleStatusChange(status: string) {
    startTransition(async () => {
      await updateReservationStatus(item.id, status);
      showToast(`Reserva marcada como ${status}.`);
    });
  }

  async function handleDelete() {
    const ok = await confirmDialog({
      title: `Excluir a reserva de ${item.name}?`,
      description: "Essa ação não pode ser desfeita.",
      confirmLabel: "Excluir",
      danger: true,
    });
    if (!ok) return;
    startTransition(async () => {
      await deleteReservation(item.id);
      showToast("Reserva excluída.", "info");
    });
  }

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.4) }}
      className="group border-b border-[#E8E2DD] last:border-0 hover:bg-[#FAF8F6] transition-colors duration-150"
    >
      <td className="py-3 pl-5 pr-3">
        <div className="flex flex-col">
          <span className="font-sans text-sm font-medium text-[#352B28]">{item.name}</span>
          <span className="font-sans text-xs text-[rgba(53,43,40,0.5)]">{item.phone}</span>
        </div>
      </td>
      <td className="py-3 px-3 font-sans text-sm text-[rgba(53,43,40,0.75)] whitespace-nowrap">
        {formatDate(item.eventDate)}
        {item.checkin && <span className="text-[rgba(53,43,40,0.5)]"> · {item.checkin}</span>}
      </td>
      <td className="py-3 px-3 font-sans text-sm text-[rgba(53,43,40,0.75)]">{item.occasion || "—"}</td>
      <td className="py-3 px-3 font-sans text-sm text-[rgba(53,43,40,0.75)] text-center">{item.guests ?? "—"}</td>
      <td className="py-3 px-3">
        <span
          className={`font-sans text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full ${
            item.source === "admin" ? "bg-[#E8E2DD] text-[#352B28]" : "bg-[#C58B66]/10 text-[#C58B66]"
          }`}
        >
          {item.source === "admin" ? "equipe" : "site"}
        </span>
      </td>
      <td className="py-3 px-3">
        <StyledSelect
          value={item.status}
          disabled={isPending}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="w-auto min-w-[130px]"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </StyledSelect>
      </td>
      <td className="py-3 pl-3 pr-5">
        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
          <motion.a
            href={`https://wa.me/${item.phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir WhatsApp"
            title="Abrir WhatsApp"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[#C58B66]/40 text-[#C58B66] bg-[#C58B66]/10 transition-colors duration-200"
          >
            <MessageCircle size={16} strokeWidth={1.75} />
          </motion.a>
          <IconActionButton icon={Trash2} label="Excluir" variant="danger" onClick={handleDelete} disabled={isPending} />
        </div>
      </td>
    </motion.tr>
  );
}

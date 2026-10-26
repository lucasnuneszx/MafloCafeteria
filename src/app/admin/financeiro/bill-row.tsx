"use client";

import { useTransition } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw, Pencil, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { markBillPaid, deleteBill } from "@/lib/actions/bills";
import { formatCents, getBillStatus } from "@/lib/money";
import { Badge } from "@/components/ui/badge";
import IconActionButton from "@/app/admin/icon-action-button";
import BillFormDialog from "./bill-form-dialog";
import { useToast, useConfirm } from "@/app/admin/ui-provider";

interface BillItem {
  id: number;
  type: string;
  description: string;
  amountCents: number;
  dueDate: string;
  category: string | null;
  notes: string | null;
  paidAt: string | null;
}

const STATUS_BADGE: Record<string, "default" | "secondary" | "destructive"> = {
  pago: "default",
  vencido: "destructive",
  pendente: "secondary",
};

function formatDate(d: string) {
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

export default function BillRow({ item, index = 0 }: { item: BillItem; index?: number }) {
  const [isPending, startTransition] = useTransition();
  const showToast = useToast();
  const confirmDialog = useConfirm();

  const status = getBillStatus(item.dueDate, item.paidAt);
  const isReceivable = item.type === "receber";

  function handleTogglePaid() {
    startTransition(async () => {
      await markBillPaid(item.id, status !== "pago");
      showToast(status === "pago" ? "Conta reaberta." : "Conta marcada como paga.");
    });
  }

  async function handleDelete() {
    const ok = await confirmDialog({
      title: `Excluir "${item.description}"?`,
      description: "Essa ação não pode ser desfeita.",
      confirmLabel: "Excluir",
      danger: true,
    });
    if (!ok) return;
    startTransition(async () => {
      await deleteBill(item.id);
      showToast("Conta excluída.", "info");
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
        <div className="flex items-center gap-2.5">
          <span
            className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 ${
              isReceivable ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
            }`}
          >
            {isReceivable ? (
              <ArrowDownCircle size={14} strokeWidth={1.75} />
            ) : (
              <ArrowUpCircle size={14} strokeWidth={1.75} />
            )}
          </span>
          <div className="flex flex-col">
            <span className="font-sans text-sm font-medium text-[#352B28]">{item.description}</span>
            {item.category && (
              <span className="font-sans text-xs text-[rgba(53,43,40,0.5)]">{item.category}</span>
            )}
          </div>
        </div>
      </td>
      <td className="py-3 px-3">
        <span
          className={`font-sans text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full ${
            isReceivable ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
          }`}
        >
          {isReceivable ? "a receber" : "a pagar"}
        </span>
      </td>
      <td className="py-3 px-3 font-sans text-sm text-[#352B28] font-medium whitespace-nowrap">
        {formatCents(item.amountCents)}
      </td>
      <td className="py-3 px-3 font-sans text-sm text-[rgba(53,43,40,0.75)] whitespace-nowrap">
        {formatDate(item.dueDate)}
      </td>
      <td className="py-3 px-3">
        <Badge variant={STATUS_BADGE[status]}>{status}</Badge>
      </td>
      <td className="py-3 pl-3 pr-5">
        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
          <IconActionButton
            icon={status === "pago" ? RotateCcw : CheckCircle2}
            label={status === "pago" ? "Reabrir conta" : "Marcar como paga"}
            variant={status === "pago" ? "default" : "active"}
            onClick={handleTogglePaid}
            disabled={isPending}
          />
          <BillFormDialog item={item} trigger={<IconActionButton icon={Pencil} label="Editar" />} />
          <IconActionButton icon={Trash2} label="Excluir" variant="danger" onClick={handleDelete} disabled={isPending} />
        </div>
      </td>
    </motion.tr>
  );
}

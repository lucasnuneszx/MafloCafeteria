"use client";

import { useTransition } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { deleteAgendaItem, toggleAgendaItemActive } from "@/lib/actions/agenda";
import { Badge } from "@/components/ui/badge";
import IconActionButton from "@/app/admin/icon-action-button";
import AgendaFormDialog from "./agenda-form-dialog";
import { useToast, useConfirm } from "@/app/admin/ui-provider";

interface AgendaRow {
  id: number;
  dayOfWeek: number;
  dayLabel: string;
  title: string;
  description: string | null;
  timeLabel: string | null;
  active: boolean;
  sortOrder: number;
}

export default function AgendaItemRow({ item, index = 0 }: { item: AgendaRow; index?: number }) {
  const [isPending, startTransition] = useTransition();
  const showToast = useToast();
  const confirmDialog = useConfirm();

  function handleToggleActive() {
    startTransition(async () => {
      await toggleAgendaItemActive(item.id, !item.active);
      showToast(item.active ? "Item desativado." : "Item ativado.");
    });
  }

  async function handleDelete() {
    const ok = await confirmDialog({
      title: `Excluir "${item.title}"?`,
      description: "Esse item sai da agenda do site imediatamente.",
      confirmLabel: "Excluir",
      danger: true,
    });
    if (!ok) return;
    startTransition(async () => {
      await deleteAgendaItem(item.id);
      showToast("Item excluído.", "info");
    });
  }

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.4) }}
      className={`group border-b border-[#E8E2DD] last:border-0 hover:bg-[#FAF8F6] transition-colors duration-150 ${
        !item.active ? "opacity-60" : ""
      }`}
    >
      <td className="py-3 pl-5 pr-3 font-sans text-xs uppercase tracking-wide text-[#C58B66] whitespace-nowrap">
        {item.dayLabel}
      </td>
      <td className="py-3 px-3">
        <div className="flex flex-col">
          <span className="font-sans text-sm font-medium text-[#352B28]">{item.title}</span>
          {item.description && (
            <span className="font-sans text-xs text-[rgba(53,43,40,0.55)] line-clamp-1">{item.description}</span>
          )}
        </div>
      </td>
      <td className="py-3 px-3 font-sans text-sm text-[rgba(53,43,40,0.7)] whitespace-nowrap">
        {item.timeLabel || "—"}
      </td>
      <td className="py-3 px-3">
        <Badge variant={item.active ? "default" : "secondary"}>{item.active ? "ativo" : "inativo"}</Badge>
      </td>
      <td className="py-3 pl-3 pr-5">
        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
          <IconActionButton
            icon={item.active ? EyeOff : Eye}
            label={item.active ? "Desativar" : "Ativar"}
            variant={item.active ? "default" : "active"}
            onClick={handleToggleActive}
            disabled={isPending}
          />
          <AgendaFormDialog item={item} trigger={<IconActionButton icon={Pencil} label="Editar" />} />
          <IconActionButton
            icon={Trash2}
            label="Excluir"
            variant="danger"
            onClick={handleDelete}
            disabled={isPending}
          />
        </div>
      </td>
    </motion.tr>
  );
}

"use client";

import { useTransition } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Pencil, Trash2, TriangleAlert } from "lucide-react";
import { adjustInventoryQuantity, deleteInventoryItem } from "@/lib/actions/inventory";
import { formatQuantityX100, UNIT_LABELS } from "@/lib/quantity";
import { Badge } from "@/components/ui/badge";
import IconActionButton from "@/app/admin/icon-action-button";
import InventoryFormDialog from "./inventory-form-dialog";
import { useToast, useConfirm } from "@/app/admin/ui-provider";

interface InventoryItem {
  id: number;
  name: string;
  unit: string;
  quantity: number;
  minQuantity: number;
  category: string | null;
  notes: string | null;
}

// One "step" per unit type — a click adjusts by a sensible amount rather
// than always ±1, since 1kg and 1 unit mean very different things.
const STEP_X100: Record<string, number> = {
  un: 100,
  kg: 100,
  g: 10000,
  l: 100,
  ml: 10000,
  pct: 100,
};

export default function InventoryRow({ item, index = 0 }: { item: InventoryItem; index?: number }) {
  const [isPending, startTransition] = useTransition();
  const showToast = useToast();
  const confirmDialog = useConfirm();

  const isLow = item.quantity < item.minQuantity;
  const step = STEP_X100[item.unit] ?? 100;

  function handleAdjust(delta: number) {
    startTransition(async () => {
      await adjustInventoryQuantity(item.id, delta);
    });
  }

  async function handleDelete() {
    const ok = await confirmDialog({
      title: `Excluir "${item.name}" do estoque?`,
      description: "Essa ação não pode ser desfeita.",
      confirmLabel: "Excluir",
      danger: true,
    });
    if (!ok) return;
    startTransition(async () => {
      await deleteInventoryItem(item.id);
      showToast("Item excluído.", "info");
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
          {item.category && (
            <span className="font-sans text-xs text-[rgba(53,43,40,0.5)]">{item.category}</span>
          )}
        </div>
      </td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAdjust(-step)}
            disabled={isPending}
            aria-label="Diminuir quantidade"
            className="flex items-center justify-center w-6 h-6 rounded-md border border-[#E8E2DD] text-[rgba(53,43,40,0.5)] hover:border-[#C58B66] hover:text-[#C58B66] transition-colors duration-200 disabled:opacity-40"
          >
            <Minus size={12} />
          </button>
          <span className="font-sans text-sm text-[#352B28] font-medium min-w-[64px] text-center">
            {formatQuantityX100(item.quantity)} {UNIT_LABELS[item.unit] ?? item.unit}
          </span>
          <button
            onClick={() => handleAdjust(step)}
            disabled={isPending}
            aria-label="Aumentar quantidade"
            className="flex items-center justify-center w-6 h-6 rounded-md border border-[#E8E2DD] text-[rgba(53,43,40,0.5)] hover:border-[#C58B66] hover:text-[#C58B66] transition-colors duration-200 disabled:opacity-40"
          >
            <Plus size={12} />
          </button>
        </div>
      </td>
      <td className="py-3 px-3 font-sans text-sm text-[rgba(53,43,40,0.6)] whitespace-nowrap">
        mín. {formatQuantityX100(item.minQuantity)} {UNIT_LABELS[item.unit] ?? item.unit}
      </td>
      <td className="py-3 px-3">
        {isLow ? (
          <Badge variant="destructive">
            <TriangleAlert size={11} />
            acabando
          </Badge>
        ) : (
          <Badge variant="default">ok</Badge>
        )}
      </td>
      <td className="py-3 pl-3 pr-5">
        <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
          <InventoryFormDialog item={item} trigger={<IconActionButton icon={Pencil} label="Editar" />} />
          <IconActionButton icon={Trash2} label="Excluir" variant="danger" onClick={handleDelete} disabled={isPending} />
        </div>
      </td>
    </motion.tr>
  );
}

"use client";

import { useRef, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import StyledSelect from "@/components/ui/styled-select";
import { createInventoryItem, updateInventoryItem } from "@/lib/actions/inventory";
import { useToast } from "@/app/admin/ui-provider";

const UNIT_OPTIONS = [
  { value: "un", label: "unidade" },
  { value: "kg", label: "quilo (kg)" },
  { value: "g", label: "grama (g)" },
  { value: "l", label: "litro (L)" },
  { value: "ml", label: "mililitro (mL)" },
  { value: "pct", label: "pacote" },
];

interface InventoryItemData {
  id: number;
  name: string;
  unit: string;
  quantity: number;
  minQuantity: number;
  category: string | null;
  notes: string | null;
}

interface InventoryFormDialogProps {
  trigger: ReactNode;
  item?: InventoryItemData;
}

export default function InventoryFormDialog({ trigger, item }: InventoryFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const showToast = useToast();
  const isEditing = Boolean(item);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        if (isEditing) {
          await updateInventoryItem(formData);
          showToast("Item atualizado.");
        } else {
          await createInventoryItem(formData);
          formRef.current?.reset();
          showToast("Item adicionado ao estoque.");
        }
        setOpen(false);
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Não foi possível salvar.", "error");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <span onClick={() => setOpen(true)}>{trigger}</span>

      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#C58B66]/10 text-[#C58B66] mb-1">
            <Package size={20} strokeWidth={1.75} />
          </div>
          <DialogTitle className="font-heading text-xl text-[#352B28]">
            {isEditing ? "Editar item" : "Adicionar item ao estoque"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Ajuste os dados desse item." : "Cadastre um insumo pra controlar quantidade e ponto de reposição."}
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {isEditing && <input type="hidden" name="id" value={item!.id} />}
          <div>
            <Label htmlFor="inv-name">Nome</Label>
            <Input
              id="inv-name"
              name="name"
              defaultValue={item?.name ?? ""}
              required
              className="mt-1"
              placeholder="Ex: Grão de café arábica"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="inv-quantity">Quantidade atual</Label>
              <Input
                id="inv-quantity"
                name="quantity"
                type="number"
                step="0.01"
                min="0"
                defaultValue={item ? item.quantity / 100 : ""}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="inv-unit">Unidade</Label>
              <StyledSelect id="inv-unit" name="unit" defaultValue={item?.unit ?? "un"} className="mt-1">
                {UNIT_OPTIONS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </StyledSelect>
            </div>
          </div>
          <div>
            <Label htmlFor="inv-min">Estoque mínimo (alerta quando abaixo disso)</Label>
            <Input
              id="inv-min"
              name="minQuantity"
              type="number"
              step="0.01"
              min="0"
              defaultValue={item ? item.minQuantity / 100 : ""}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="inv-cat">Categoria (opcional)</Label>
            <Input
              id="inv-cat"
              name="category"
              defaultValue={item?.category ?? ""}
              className="mt-1"
              placeholder="Ex: Grãos, Laticínios, Embalagens"
            />
          </div>
          <div>
            <Label htmlFor="inv-notes">Observações (opcional)</Label>
            <Textarea id="inv-notes" name="notes" defaultValue={item?.notes ?? ""} className="mt-1" rows={2} />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isPending}
            className="btn-primary justify-center mt-1"
          >
            {isPending ? "Salvando…" : isEditing ? "Salvar alterações" : "Adicionar item"}
          </motion.button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useRef, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Receipt, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
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
import { createBill, updateBill } from "@/lib/actions/bills";
import { useToast } from "@/app/admin/ui-provider";

interface BillRowData {
  id: number;
  type: string;
  description: string;
  amountCents: number;
  dueDate: string;
  category: string | null;
  notes: string | null;
}

interface BillFormDialogProps {
  trigger: ReactNode;
  item?: BillRowData;
  defaultType?: "pagar" | "receber";
}

export default function BillFormDialog({ trigger, item, defaultType = "pagar" }: BillFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"pagar" | "receber">((item?.type as "pagar" | "receber") ?? defaultType);
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
          await updateBill(formData);
          showToast("Conta atualizada.");
        } else {
          await createBill(formData);
          formRef.current?.reset();
          setType(defaultType);
          showToast(type === "pagar" ? "Conta a pagar adicionada." : "Conta a receber adicionada.");
        }
        setOpen(false);
      } catch {
        showToast("Não foi possível salvar. Confira os campos.", "error");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <span onClick={() => setOpen(true)}>{trigger}</span>

      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#C58B66]/10 text-[#C58B66] mb-1">
            <Receipt size={20} strokeWidth={1.75} />
          </div>
          <DialogTitle className="font-heading text-xl text-[#352B28]">
            {isEditing ? "Editar conta" : "Adicionar conta"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Ajuste os dados dessa conta." : "Registre uma conta a pagar ou a receber."}
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {isEditing && <input type="hidden" name="id" value={item!.id} />}
          <input type="hidden" name="type" value={type} />

          <div className="grid grid-cols-2 gap-2 rounded-lg bg-[#FAF8F6] p-1 border border-[#E8E2DD]">
            <button
              type="button"
              onClick={() => setType("pagar")}
              className={`flex items-center justify-center gap-1.5 rounded-md py-2 font-sans text-sm transition-colors duration-200 ${
                type === "pagar" ? "bg-white text-[#352B28] shadow-sm" : "text-[rgba(53,43,40,0.5)]"
              }`}
            >
              <ArrowUpCircle size={14} strokeWidth={1.75} className="text-red-500" />
              A pagar
            </button>
            <button
              type="button"
              onClick={() => setType("receber")}
              className={`flex items-center justify-center gap-1.5 rounded-md py-2 font-sans text-sm transition-colors duration-200 ${
                type === "receber" ? "bg-white text-[#352B28] shadow-sm" : "text-[rgba(53,43,40,0.5)]"
              }`}
            >
              <ArrowDownCircle size={14} strokeWidth={1.75} className="text-emerald-600" />
              A receber
            </button>
          </div>

          <div>
            <Label htmlFor="bill-desc">Descrição</Label>
            <Input
              id="bill-desc"
              name="description"
              defaultValue={item?.description ?? ""}
              required
              className="mt-1"
              placeholder={type === "pagar" ? "Ex: Fornecedor de grãos" : "Ex: Evento particular"}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bill-amount">Valor (R$)</Label>
              <Input
                id="bill-amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                defaultValue={item ? (item.amountCents / 100).toFixed(2) : ""}
                required
                className="mt-1"
                placeholder="0,00"
              />
            </div>
            <div>
              <Label htmlFor="bill-due">Vencimento</Label>
              <Input
                id="bill-due"
                name="dueDate"
                type="date"
                defaultValue={item?.dueDate ?? ""}
                required
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="bill-cat">Categoria (opcional)</Label>
            <Input
              id="bill-cat"
              name="category"
              defaultValue={item?.category ?? ""}
              className="mt-1"
              placeholder="Ex: Aluguel, Fornecedor"
            />
          </div>
          <div>
            <Label htmlFor="bill-notes">Observações (opcional)</Label>
            <Textarea id="bill-notes" name="notes" defaultValue={item?.notes ?? ""} className="mt-1" rows={2} />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isPending}
            className="btn-primary justify-center mt-1"
          >
            {isPending ? "Salvando…" : isEditing ? "Salvar alterações" : "Adicionar conta"}
          </motion.button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

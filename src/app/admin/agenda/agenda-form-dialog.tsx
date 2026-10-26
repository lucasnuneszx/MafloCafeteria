"use client";

import { useRef, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
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
import { createAgendaItem, updateAgendaItem } from "@/lib/actions/agenda";
import { dayOfWeekOptions } from "@/lib/constants";
import { useToast } from "@/app/admin/ui-provider";

interface AgendaRow {
  id: number;
  dayOfWeek: number;
  title: string;
  description: string | null;
  timeLabel: string | null;
  sortOrder: number;
}

interface AgendaFormDialogProps {
  trigger: ReactNode;
  item?: AgendaRow;
  nextSortOrder?: number;
}

export default function AgendaFormDialog({ trigger, item, nextSortOrder = 0 }: AgendaFormDialogProps) {
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
          await updateAgendaItem(formData);
          showToast("Item da agenda atualizado.");
        } else {
          await createAgendaItem(formData);
          formRef.current?.reset();
          showToast("Item adicionado à agenda.");
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
            <CalendarDays size={20} strokeWidth={1.75} />
          </div>
          <DialogTitle className="font-heading text-xl text-[#352B28]">
            {isEditing ? "Editar item da agenda" : "Adicionar item à agenda"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "Ajuste os dados desse item." : "Aparece no site em até 5 minutos, se estiver ativo."}
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {isEditing && <input type="hidden" name="id" value={item!.id} />}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="agenda-day">Dia da semana</Label>
              <StyledSelect id="agenda-day" name="dayOfWeek" defaultValue={item?.dayOfWeek ?? 1} className="mt-1">
                {dayOfWeekOptions.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </StyledSelect>
            </div>
            <div>
              <Label htmlFor="agenda-time">Horário</Label>
              <Input
                id="agenda-time"
                name="timeLabel"
                defaultValue={item?.timeLabel ?? ""}
                className="mt-1"
                placeholder="Ex: 19h — 22h"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="agenda-title">Título</Label>
            <Input
              id="agenda-title"
              name="title"
              defaultValue={item?.title ?? ""}
              required
              className="mt-1"
              placeholder="Ex: Noite de Jazz"
            />
          </div>
          <div>
            <Label htmlFor="agenda-desc">Descrição</Label>
            <Textarea
              id="agenda-desc"
              name="description"
              defaultValue={item?.description ?? ""}
              className="mt-1"
              rows={2}
            />
          </div>
          <input type="hidden" name="sortOrder" value={item?.sortOrder ?? nextSortOrder} />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isPending}
            className="btn-primary justify-center mt-1"
          >
            {isPending ? "Salvando…" : isEditing ? "Salvar alterações" : "Adicionar"}
          </motion.button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

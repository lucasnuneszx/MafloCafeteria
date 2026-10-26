"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Plus, CalendarPlus } from "lucide-react";
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
import { createReservationAdmin } from "@/lib/actions/reservations";
import { eventOccasions } from "@/lib/constants";
import { useToast } from "@/app/admin/ui-provider";

export default function ReservationCreateDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const showToast = useToast();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await createReservationAdmin(formData);
        formRef.current?.reset();
        setOpen(false);
        showToast("Reserva registrada.");
      } catch {
        showToast("Não foi possível registrar a reserva. Confira os campos.", "error");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpen(true)}
        className="btn-primary self-start"
      >
        <Plus size={16} strokeWidth={1.75} aria-hidden="true" />
        Nova reserva
      </motion.button>

      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <div className="flex items-center justify-center w-11 h-11 rounded-full bg-[#C58B66]/10 text-[#C58B66] mb-1">
            <CalendarPlus size={20} strokeWidth={1.75} />
          </div>
          <DialogTitle className="font-heading text-xl text-[#352B28]">Registrar reserva</DialogTitle>
          <DialogDescription>Preencha os dados de quem ligou ou passou no balcão.</DialogDescription>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div>
            <Label htmlFor="admin-res-name">Nome</Label>
            <Input id="admin-res-name" name="name" required className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="admin-res-date">Data</Label>
              <Input id="admin-res-date" name="eventDate" type="date" required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="admin-res-checkin">Check-in</Label>
              <Input id="admin-res-checkin" name="checkin" type="time" className="mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="admin-res-occasion">Ocasião</Label>
              <StyledSelect id="admin-res-occasion" name="occasion" defaultValue={eventOccasions[0]} className="mt-1">
                {eventOccasions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </StyledSelect>
            </div>
            <div>
              <Label htmlFor="admin-res-guests">Nº pessoas</Label>
              <Input id="admin-res-guests" name="guests" type="number" min={1} required className="mt-1" />
            </div>
          </div>
          <div>
            <Label htmlFor="admin-res-phone">Telefone</Label>
            <Input id="admin-res-phone" name="phone" type="tel" required className="mt-1" placeholder="(00) 00000-0000" />
          </div>
          <div>
            <Label htmlFor="admin-res-notes">Observações</Label>
            <Textarea id="admin-res-notes" name="notes" className="mt-1" rows={2} />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isPending}
            className="btn-primary justify-center mt-1"
          >
            {isPending ? "Registrando…" : "Registrar reserva"}
          </motion.button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

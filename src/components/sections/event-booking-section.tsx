"use client";

import { useState, useRef, type FormEvent } from "react";
import { CalendarCheck, Users, Sparkles } from "lucide-react";
import SectionTitle from "@/components/shared/section-title";
import Reveal from "@/components/shared/reveal";
import SectionDivider from "@/components/shared/section-divider";
import { eventOccasions } from "@/lib/constants";
import { createReservation } from "@/lib/actions/reservations";

const inputClass =
  "w-full rounded-md border border-[#E8E2DD] bg-white px-4 py-3 font-sans text-sm text-[#352B28] placeholder:text-[rgba(53,43,40,0.4)] focus:border-[#C58B66] focus:outline-none transition-colors duration-300";

const labelClass = "font-sans text-sm text-[rgba(53,43,40,0.65)] mb-2 block";

export default function EventBookingSection({ whatsappNumber }: { whatsappNumber: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [occasion, setOccasion] = useState(eventOccasions[0]);
  const [guests, setGuests] = useState("");
  const [checkin, setCheckin] = useState("");
  const [notes, setNotes] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — must stay empty
  const renderedAt = useRef(Date.now());

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const lines = [
      "Olá! Gostaria de reservar um evento na Maflô.",
      `Nome: ${name}`,
      `Data: ${date}`,
      `Ocasião: ${occasion}`,
      `Quantidade de pessoas: ${guests}`,
      `Horário previsto de check-in: ${checkin}`,
      `Telefone para contato: ${phone}`,
      notes && `Observações: ${notes}`,
    ].filter(Boolean);

    const message = encodeURIComponent(lines.join("\n"));

    try {
      await createReservation({
        name,
        phone,
        eventDate: date,
        checkin,
        occasion,
        guests: Number(guests),
        notes,
        website,
        renderedAt: renderedAt.current,
      });
    } catch (err) {
      // Não bloqueia o fluxo do cliente se o registro no CRM falhar —
      // o WhatsApp continua sendo a via garantida de contato.
      console.error("Falha ao salvar reserva no CRM", err);
    }

    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="eventos" className="section-py bg-white">
      <div className="container-maflo">
        <SectionDivider className="mb-20" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Info column */}
          <div className="flex flex-col gap-6">
            <SectionTitle
              eyebrow="04 — Eventos"
              title="Marque seu evento na Maflô."
              subtitle="Aniversários, reuniões e celebrações — conte os detalhes e confirmamos sua reserva pelo WhatsApp."
              align="left"
            />
            <Reveal delay={0.15}>
              <ul className="flex flex-col gap-4 mt-4">
                <li className="flex items-center gap-3 font-sans text-sm text-[rgba(53,43,40,0.75)]">
                  <CalendarCheck size={18} className="text-[#C58B66] shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  Confirmação de data e horário de check-in
                </li>
                <li className="flex items-center gap-3 font-sans text-sm text-[rgba(53,43,40,0.75)]">
                  <Users size={18} className="text-[#C58B66] shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  Espaço preparado para o número de convidados
                </li>
                <li className="flex items-center gap-3 font-sans text-sm text-[rgba(53,43,40,0.75)]">
                  <Sparkles size={18} className="text-[#C58B66] shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  Atendimento dedicado para cada ocasião
                </li>
              </ul>
            </Reveal>
          </div>

          {/* Form column */}
          <Reveal delay={0.1} className="w-full">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5 bg-[#FAF8F6] border border-[#E8E2DD] rounded-xl p-8 shadow-maflo"
            >
              {/* Honeypot — hidden from real visitors, bots that autofill every field trip it */}
              <div className="absolute left-[-9999px] w-px h-px overflow-hidden" aria-hidden="true">
                <label htmlFor="event-website">Não preencher</label>
                <input
                  id="event-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="event-name" className={labelClass}>
                  Nome
                </label>
                <input
                  id="event-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="Seu nome"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="event-date" className={labelClass}>
                    Data
                  </label>
                  <input
                    id="event-date"
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="event-checkin" className={labelClass}>
                    Check-in
                  </label>
                  <input
                    id="event-checkin"
                    type="time"
                    required
                    value={checkin}
                    onChange={(e) => setCheckin(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="event-occasion" className={labelClass}>
                    Ocasião
                  </label>
                  <select
                    id="event-occasion"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className={inputClass}
                  >
                    {eventOccasions.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="event-guests" className={labelClass}>
                    Nº de pessoas
                  </label>
                  <input
                    id="event-guests"
                    type="number"
                    min={1}
                    required
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className={inputClass}
                    placeholder="Ex: 10"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="event-phone" className={labelClass}>
                  Telefone / WhatsApp
                </label>
                <input
                  id="event-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <label htmlFor="event-notes" className={labelClass}>
                  Observações (opcional)
                </label>
                <textarea
                  id="event-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className={inputClass}
                  placeholder="Alguma preferência ou detalhe importante?"
                />
              </div>

              <button type="submit" className="btn-primary justify-center mt-2">
                Enviar reserva pelo WhatsApp
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

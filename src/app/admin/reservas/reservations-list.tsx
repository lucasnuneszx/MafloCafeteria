"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ReservationRow from "./reservation-row";
import StyledSelect from "@/components/ui/styled-select";
import { Input } from "@/components/ui/input";

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

const STATUS_FILTERS = [
  { value: "todos", label: "Todos os status" },
  { value: "pendente", label: "Pendente" },
  { value: "confirmada", label: "Confirmada" },
  { value: "cancelada", label: "Cancelada" },
];

const COLUMNS = ["Cliente", "Data", "Ocasião", "Pessoas", "Origem", "Status", ""];

export default function ReservationsList({ items }: { items: ReservationItem[] }) {
  const [status, setStatus] = useState("todos");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((item) => {
      if (status !== "todos" && item.status !== status) return false;
      if (!term) return true;
      return (
        item.name.toLowerCase().includes(term) ||
        item.phone.toLowerCase().includes(term) ||
        (item.occasion ?? "").toLowerCase().includes(term)
      );
    });
  }, [items, status, search]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(53,43,40,0.35)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, telefone ou ocasião…"
            className="pl-9"
          />
        </div>
        <StyledSelect value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-56">
          {STATUS_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </StyledSelect>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-[#E8E2DD] py-12 text-center">
          <p className="font-sans text-sm text-[rgba(53,43,40,0.55)]">
            {items.length === 0 ? "Nenhuma reserva recebida ainda." : "Nenhuma reserva encontrada com esse filtro."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#E8E2DD] bg-white shadow-maflo">
          <table className="w-full min-w-[820px] border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2DD] bg-[#FAF8F6]">
                {COLUMNS.map((col, i) => (
                  <th
                    key={col || i}
                    className={`py-3 font-sans text-xs uppercase tracking-wide text-[rgba(53,43,40,0.5)] ${
                      i === 0 ? "pl-5 pr-3 text-left" : i === 3 ? "px-3 text-center" : "px-3 text-left"
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, index) => (
                <ReservationRow key={item.id} item={item} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

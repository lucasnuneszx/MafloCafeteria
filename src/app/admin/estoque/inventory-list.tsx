"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import InventoryRow from "./inventory-row";
import StyledSelect from "@/components/ui/styled-select";
import { Input } from "@/components/ui/input";

interface InventoryItem {
  id: number;
  name: string;
  unit: string;
  quantity: number;
  minQuantity: number;
  category: string | null;
  notes: string | null;
}

const STATUS_FILTERS = [
  { value: "todos", label: "Todos" },
  { value: "baixo", label: "Só acabando" },
];

const COLUMNS = ["Item", "Quantidade", "Mínimo", "Status", ""];

export default function InventoryList({ items }: { items: InventoryItem[] }) {
  const [status, setStatus] = useState("todos");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((item) => {
      if (status === "baixo" && item.quantity >= item.minQuantity) return false;
      if (!term) return true;
      return (
        item.name.toLowerCase().includes(term) || (item.category ?? "").toLowerCase().includes(term)
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
            placeholder="Buscar por nome ou categoria…"
            className="pl-9"
          />
        </div>
        <StyledSelect value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-48">
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
            {items.length === 0 ? "Nenhum item cadastrado ainda." : "Nenhum item encontrado com esse filtro."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#E8E2DD] bg-white shadow-maflo">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2DD] bg-[#FAF8F6]">
                {COLUMNS.map((col, i) => (
                  <th
                    key={col || i}
                    className={`py-3 font-sans text-xs uppercase tracking-wide text-[rgba(53,43,40,0.5)] ${
                      i === 0 ? "pl-5 pr-3 text-left" : "px-3 text-left"
                    }`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, index) => (
                <InventoryRow key={item.id} item={item} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

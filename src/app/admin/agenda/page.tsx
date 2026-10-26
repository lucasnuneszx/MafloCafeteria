import { asc } from "drizzle-orm";
import { Plus } from "lucide-react";
import { getDb } from "@/lib/db";
import { weeklyAgenda } from "@/lib/db/schema";
import AgendaItemRow from "./agenda-item-row";
import AgendaFormDialog from "./agenda-form-dialog";

export const dynamic = "force-dynamic";

const COLUMNS = ["Dia", "Título", "Horário", "Status", ""];

export default async function AdminAgendaPage() {
  const db = getDb();
  const items = await db.select().from(weeklyAgenda).orderBy(asc(weeklyAgenda.sortOrder));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-[#352B28]">Agenda semanal</h1>
          <p className="font-sans text-sm text-[rgba(53,43,40,0.65)] mt-1">
            O que estiver marcado como ativo aparece no site, atualizado em até 5 minutos.
          </p>
        </div>
        <AgendaFormDialog
          nextSortOrder={items.length + 1}
          trigger={
            <button className="btn-primary self-start hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200">
              <Plus size={16} strokeWidth={1.75} aria-hidden="true" />
              Novo item
            </button>
          }
        />
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-[#E8E2DD] py-12 text-center">
          <p className="font-sans text-sm text-[rgba(53,43,40,0.55)]">Nenhum item cadastrado ainda.</p>
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
              {items.map((item, index) => (
                <AgendaItemRow key={item.id} item={item} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

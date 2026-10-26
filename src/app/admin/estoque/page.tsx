import { asc } from "drizzle-orm";
import { Plus, TriangleAlert } from "lucide-react";
import { getDb } from "@/lib/db";
import { inventoryItems } from "@/lib/db/schema";
import InventoryList from "./inventory-list";
import InventoryFormDialog from "./inventory-form-dialog";

export const dynamic = "force-dynamic";

export default async function AdminEstoquePage() {
  const db = getDb();
  const items = await db.select().from(inventoryItems).orderBy(asc(inventoryItems.name));

  const lowCount = items.filter((i) => i.quantity < i.minQuantity).length;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-[#352B28]">Estoque</h1>
          <p className="font-sans text-sm text-[rgba(53,43,40,0.65)] mt-1">
            {lowCount > 0 ? (
              <span className="inline-flex items-center gap-1.5 text-red-600">
                <TriangleAlert size={14} strokeWidth={1.75} />
                {lowCount} {lowCount === 1 ? "item abaixo" : "itens abaixo"} do mínimo
              </span>
            ) : (
              "Tudo dentro do ponto de reposição."
            )}
          </p>
        </div>
        <InventoryFormDialog
          trigger={
            <button className="btn-primary self-start hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200">
              <Plus size={16} strokeWidth={1.75} aria-hidden="true" />
              Novo item
            </button>
          }
        />
      </div>

      <InventoryList items={items} />
    </div>
  );
}

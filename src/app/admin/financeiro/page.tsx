import { asc } from "drizzle-orm";
import { Plus } from "lucide-react";
import { getDb } from "@/lib/db";
import { bills } from "@/lib/db/schema";
import { getBillStatus } from "@/lib/money";
import FinanceiroSummary from "./financeiro-summary";
import BillsList from "./bills-list";
import BillFormDialog from "./bill-form-dialog";

export const dynamic = "force-dynamic";

export default async function AdminFinanceiroPage() {
  const db = getDb();
  const items = await db.select().from(bills).orderBy(asc(bills.dueDate));

  const now = new Date();
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  let totalToPayCents = 0;
  let totalToReceiveCents = 0;
  let totalOverdueCents = 0;
  let monthPaidCents = 0;
  let monthReceivedCents = 0;

  for (const item of items) {
    const status = getBillStatus(item.dueDate, item.paidAt);
    const isReceivable = item.type === "receber";

    if (status === "pendente") {
      if (isReceivable) totalToReceiveCents += item.amountCents;
      else totalToPayCents += item.amountCents;
    } else if (status === "vencido") {
      totalOverdueCents += item.amountCents;
      if (isReceivable) totalToReceiveCents += item.amountCents;
      else totalToPayCents += item.amountCents;
    } else if (status === "pago" && item.paidAt && item.paidAt.toISOString().startsWith(currentMonthPrefix)) {
      if (isReceivable) monthReceivedCents += item.amountCents;
      else monthPaidCents += item.amountCents;
    }
  }

  const monthBalanceCents = monthReceivedCents - monthPaidCents;

  const serializedItems = items.map((item) => ({
    ...item,
    paidAt: item.paidAt ? item.paidAt.toISOString() : null,
  }));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl text-[#352B28]">Financeiro</h1>
          <p className="font-sans text-sm text-[rgba(53,43,40,0.65)] mt-1">
            Contas a pagar e a receber, tudo num fluxo só.
          </p>
        </div>
        <BillFormDialog
          trigger={
            <button className="btn-primary self-start hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200">
              <Plus size={16} strokeWidth={1.75} aria-hidden="true" />
              Nova conta
            </button>
          }
        />
      </div>

      <FinanceiroSummary
        summary={{ totalToPayCents, totalToReceiveCents, totalOverdueCents, monthBalanceCents }}
      />

      <BillsList items={serializedItems} />
    </div>
  );
}

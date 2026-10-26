import { auth } from "@clerk/nextjs/server";
import { getDb } from "@/lib/db";
import { reservations, bills, inventoryItems } from "@/lib/db/schema";
import { getBillStatus } from "@/lib/money";
import AdminSidebar from "./admin-sidebar";
import AdminUIProvider from "./ui-provider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    return <>{children}</>;
  }

  const db = getDb();
  const [allReservations, allBills, allInventory] = await Promise.all([
    db.select({ status: reservations.status }).from(reservations),
    db.select({ dueDate: bills.dueDate, paidAt: bills.paidAt }).from(bills),
    db.select({ quantity: inventoryItems.quantity, minQuantity: inventoryItems.minQuantity }).from(inventoryItems),
  ]);

  const badges = {
    reservas: allReservations.filter((r) => r.status === "pendente").length,
    financeiro: allBills.filter((b) => getBillStatus(b.dueDate, b.paidAt) === "vencido").length,
    estoque: allInventory.filter((i) => i.quantity < i.minQuantity).length,
  };

  return (
    <AdminUIProvider>
      <div className="min-h-screen bg-[#FAF8F6] text-[#352B28]">
        <AdminSidebar badges={badges} />
        <main className="lg:pl-64">
          <div className="mx-auto max-w-[1400px] px-6 sm:px-10 py-10">{children}</div>
        </main>
      </div>
    </AdminUIProvider>
  );
}

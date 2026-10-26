export function formatCents(cents: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

export type BillStatus = "pago" | "vencido" | "pendente";

export function getBillStatus(dueDate: string, paidAt: Date | string | null): BillStatus {
  if (paidAt) return "pago";
  const today = new Date().toISOString().slice(0, 10);
  return dueDate < today ? "vencido" : "pendente";
}

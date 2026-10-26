const DAY_LABELS_MON_FIRST = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

function monthLabel(year: number, month0: number) {
  const d = new Date(Date.UTC(year, month0, 1));
  const label = new Intl.DateTimeFormat("pt-BR", { month: "short", timeZone: "UTC" }).format(d);
  return label.replace(".", "").replace(/^\w/, (c) => c.toUpperCase());
}

function lastNMonths(n: number): { year: number; month0: number; key: string; label: string }[] {
  const now = new Date();
  const result = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month0 = d.getMonth();
    result.push({
      year,
      month0,
      key: `${year}-${String(month0 + 1).padStart(2, "0")}`,
      label: monthLabel(year, month0),
    });
  }
  return result;
}

export function reservationsByMonth(reservations: { eventDate: string }[], months = 6) {
  const buckets = lastNMonths(months);
  const counts = new Map(buckets.map((b) => [b.key, 0]));

  for (const r of reservations) {
    const key = r.eventDate.slice(0, 7); // 'YYYY-MM'
    if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return buckets.map((b) => ({
    category: b.label,
    values: { reservas: counts.get(b.key) ?? 0 },
  }));
}

export function cashFlowByMonth(
  bills: { type: string; amountCents: number; paidAt: string | null }[],
  months = 6
) {
  const buckets = lastNMonths(months);
  const entrada = new Map(buckets.map((b) => [b.key, 0]));
  const saida = new Map(buckets.map((b) => [b.key, 0]));

  for (const b of bills) {
    if (!b.paidAt) continue;
    const key = b.paidAt.slice(0, 7);
    if (!entrada.has(key)) continue;
    if (b.type === "receber") entrada.set(key, (entrada.get(key) ?? 0) + b.amountCents);
    else saida.set(key, (saida.get(key) ?? 0) + b.amountCents);
  }

  return buckets.map((b) => ({
    category: b.label,
    values: {
      entrada: (entrada.get(b.key) ?? 0) / 100,
      saida: (saida.get(b.key) ?? 0) / 100,
    },
  }));
}

export function occupancyByWeekday(reservations: { eventDate: string }[]) {
  const counts = new Array(7).fill(0); // index 0 = Monday ... 6 = Sunday

  for (const r of reservations) {
    const [y, m, d] = r.eventDate.split("-").map(Number);
    if (!y || !m || !d) continue;
    const jsDay = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0 = Sunday
    const mondayFirstIndex = (jsDay + 6) % 7;
    counts[mondayFirstIndex]++;
  }

  return DAY_LABELS_MON_FIRST.map((label, i) => ({
    category: label,
    values: { reservas: counts[i] },
  }));
}

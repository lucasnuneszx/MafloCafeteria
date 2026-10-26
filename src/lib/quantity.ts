export const UNIT_LABELS: Record<string, string> = {
  un: "un",
  kg: "kg",
  g: "g",
  l: "L",
  ml: "mL",
  pct: "pct",
};

export function formatQuantityX100(x100: number): string {
  const value = x100 / 100;
  return value % 1 === 0 ? String(value) : value.toFixed(2);
}

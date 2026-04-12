/** Форматирование дат и сроков работ для UI (список и карточка проекта). */

export function formatDateRu(iso: string): string {
  const parts = iso.slice(0, 10).split("-").map(Number);
  const [y, m, d] = parts;
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("ru-RU");
}

export function formatWorkPeriod(
  start?: string,
  end?: string,
): string | undefined {
  if (!start && !end) return undefined;
  if (start && end) return `${formatDateRu(start)} — ${formatDateRu(end)}`;
  if (start) return `с ${formatDateRu(start)}`;
  return end ? `до ${formatDateRu(end)}` : undefined;
}

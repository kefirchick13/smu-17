/**
 * Динамический доступ к `process.env`, чтобы Next.js не подставлял значения
 * в серверные чанки на этапе сборки (сканер секретов Netlify).
 * Локальный `.env` подхватывает сам Next при `next dev` / `next build`.
 */
export function env(name: string): string | undefined {
  return (process.env as Record<string, string | undefined>)[name];
}

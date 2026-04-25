const DEFAULT_SITE_URL = "http://smu17.org";

export const SITE_NAME = "СМУ-17";
export const DEFAULT_TITLE =
  "СМУ-17 — строительство промышленных объектов в Санкт-Петербурге";
export const DEFAULT_DESCRIPTION =
  "Генподряд и строительство промышленных зданий, складов, ангаров, коттеджей и проектирование в Санкт-Петербурге и Ленинградской области.";

export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ??
    DEFAULT_SITE_URL;

  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

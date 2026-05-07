const DEFAULT_SITE_URL = "http://smu17.su";

export const SITE_NAME = "СМУ-17";
export const DEFAULT_TITLE =
  "СМУ-17 — строительство промышленных объектов в Санкт-Петербурге";
export const DEFAULT_DESCRIPTION =
  "Генподряд и строительство промышленных зданий, складов, ангаров, коттеджей и проектирование в Санкт-Петербурге и Ленинградской области.";

export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;

  return raw.endsWith("/") ? raw.slice(0, -1) : raw;
}

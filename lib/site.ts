// Canonical site origin, used for metadataBase, sitemap, robots and structured data.
// Set NEXT_PUBLIC_SITE_URL (e.g. https://karty05.ru) in production; on Vercel the
// production domain is used automatically when it is not set.
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = "Карты 05";

export const SITE_TITLE = "Карты 05 — карточки на Яндекс Картах и 2ГИС для бизнеса в Дагестане";

export const SITE_DESCRIPTION =
  "Оформляем и продвигаем карточки организаций на Яндекс Картах и 2ГИС. Панорамы 360°, фото, продвижение в поиске — для бизнеса в Махачкале и Дагестане.";

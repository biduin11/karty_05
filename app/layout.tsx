import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Карты 05 — карточки на Яндекс Картах и 2ГИС для бизнеса в Дагестане",
  description:
    "Оформляем и продвигаем карточки организаций на Яндекс Картах и 2ГИС. Панорамы 360°, фото, продвижение в поиске — для бизнеса в Махачкале и Дагестане.",
  openGraph: {
    title: "Карты 05 — карточки на Яндекс Картах и 2ГИС",
    description: "Оформление, панорамы и продвижение карточек для бизнеса в Дагестане.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#14181C",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700;800&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

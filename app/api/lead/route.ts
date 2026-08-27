import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type LeadPayload = {
  name?: unknown;
  telegram?: unknown;
  company?: unknown;
};

const TELEGRAM_USERNAME_RE = /^@?[A-Za-z][A-Za-z0-9_]{4,31}$/;

function formatMoscowTime(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

async function notifyTelegram(name: string, telegram: string, createdAt: Date) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("Telegram notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set");
    return;
  }

  const text = [
    "Новая заявка — Карты 05",
    `Имя: ${name}`,
    `Telegram: ${telegram}`,
    `Время: ${formatMoscowTime(createdAt)}`,
  ].join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("Telegram notification failed:", res.status, body);
    }
  } catch (err) {
    console.error("Telegram notification error:", err);
  }
}

export async function POST(req: NextRequest) {
  let payload: LeadPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const telegramRaw = typeof payload.telegram === "string" ? payload.telegram.trim() : "";
  const company = typeof payload.company === "string" ? payload.company.trim() : "";

  // Honeypot: filled by bots, invisible to real users. Pretend success, save nothing.
  if (company) {
    return NextResponse.json({ ok: true });
  }

  if (!name) {
    return NextResponse.json({ ok: false, error: "Укажите имя" }, { status: 400 });
  }
  if (!TELEGRAM_USERNAME_RE.test(telegramRaw)) {
    return NextResponse.json({ ok: false, error: "Укажите корректный Telegram-юзернейм" }, { status: 400 });
  }

  const telegram = telegramRaw.startsWith("@") ? telegramRaw : `@${telegramRaw}`;

  try {
    const lead = await prisma.lead.create({
      data: { name, telegram },
    });

    await notifyTelegram(name, telegram, lead.createdAt);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to save lead:", err);
    return NextResponse.json({ ok: false, error: "Не удалось сохранить заявку" }, { status: 500 });
  }
}

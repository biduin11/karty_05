import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type LeadPayload = {
  name?: unknown;
  phone?: unknown;
  company?: unknown;
};

function formatMoscowTime(date: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

async function notifyTelegram(name: string, phone: string, createdAt: Date) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("Telegram notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set");
    return;
  }

  const text = [
    "Новая заявка — Карты 05",
    `Имя: ${name}`,
    `Телефон: ${phone}`,
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
  const phone = typeof payload.phone === "string" ? payload.phone.trim() : "";
  const company = typeof payload.company === "string" ? payload.company.trim() : "";

  // Honeypot: filled by bots, invisible to real users. Pretend success, save nothing.
  if (company) {
    return NextResponse.json({ ok: true });
  }

  const phoneDigits = phone.replace(/\D/g, "");

  if (!name) {
    return NextResponse.json({ ok: false, error: "Укажите имя" }, { status: 400 });
  }
  if (phoneDigits.length < 10) {
    return NextResponse.json({ ok: false, error: "Укажите корректный телефон" }, { status: 400 });
  }

  try {
    const lead = await prisma.lead.create({
      data: { name, phone },
    });

    await notifyTelegram(name, phone, lead.createdAt);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to save lead:", err);
    return NextResponse.json({ ok: false, error: "Не удалось сохранить заявку" }, { status: 500 });
  }
}

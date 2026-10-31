import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidName, isValidTelegram, normalizeTelegram, NAME_MAX_LENGTH } from "@/lib/lead";
import { rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

type LeadPayload = {
  name?: unknown;
  telegram?: unknown;
  company?: unknown;
  consent?: unknown;
};

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

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
  if (!rateLimit(`lead:${clientIp(req)}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return NextResponse.json(
      { ok: false, error: "Слишком много заявок. Попробуйте позже." },
      { status: 429 }
    );
  }

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
  if (!isValidName(name)) {
    return NextResponse.json(
      { ok: false, error: `Имя не должно быть длиннее ${NAME_MAX_LENGTH} символов` },
      { status: 400 }
    );
  }
  if (!isValidTelegram(telegramRaw)) {
    return NextResponse.json({ ok: false, error: "Укажите корректный Telegram-юзернейм" }, { status: 400 });
  }

  if (payload.consent !== true) {
    return NextResponse.json(
      { ok: false, error: "Нужно согласие на обработку персональных данных" },
      { status: 400 }
    );
  }

  const telegram = normalizeTelegram(telegramRaw);

  try {
    // Same Telegram username submitted again shortly after: treat as success, don't duplicate.
    const recent = await prisma.lead.findFirst({
      where: {
        telegram: { equals: telegram, mode: "insensitive" },
        createdAt: { gte: new Date(Date.now() - DUPLICATE_WINDOW_MS) },
      },
      select: { id: true },
    });
    if (recent) {
      return NextResponse.json({ ok: true });
    }

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

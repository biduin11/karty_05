"use client";

import { useRef, useState } from "react";
import { isValidName, isValidTelegram, NAME_MAX_LENGTH } from "@/lib/lead";

export default function LeadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameInvalid, setNameInvalid] = useState(false);
  const [telegramInvalid, setTelegramInvalid] = useState(false);
  const [consentInvalid, setConsentInvalid] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const telegram = (form.elements.namedItem("telegram") as HTMLInputElement).value.trim();
    const company = (form.elements.namedItem("company") as HTMLInputElement).value;
    const consent = (form.elements.namedItem("consent") as HTMLInputElement).checked;
    const nameOk = isValidName(name);
    const telegramOk = isValidTelegram(telegram);

    setNameInvalid(!nameOk);
    setTelegramInvalid(!telegramOk);
    setConsentInvalid(!consent);
    setError(null);

    if (!nameOk || !telegramOk || !consent) return;

    setSending(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, telegram, company, consent }),
      });
      const data = await res.json();
      if (data.ok) {
        setSent(true);
      } else {
        setError(data.error || "Не получилось отправить заявку. Попробуйте ещё раз.");
      }
    } catch {
      setError("Не получилось отправить заявку. Проверьте связь и попробуйте ещё раз.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className={`form-card reveal${sent ? " is-sent" : ""}`} id="formCard">
      <form id="leadForm" noValidate ref={formRef} onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Имя</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Как к вам обращаться"
            maxLength={NAME_MAX_LENGTH}
            required
            disabled={sending}
            style={nameInvalid ? { borderColor: "#D9634F" } : undefined}
            onInput={() => setNameInvalid(false)}
          />
        </div>
        <div className="field">
          <label htmlFor="telegram">Telegram</label>
          <input
            type="text"
            id="telegram"
            name="telegram"
            placeholder="@username"
            maxLength={33}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            required
            disabled={sending}
            style={telegramInvalid ? { borderColor: "#D9634F" } : undefined}
            onInput={() => setTelegramInvalid(false)}
          />
        </div>
        {/* honeypot — скрыто от пользователей, ловит ботов */}
        <div className="hp-field" aria-hidden="true">
          <label htmlFor="company">Компания</label>
          <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
        </div>
        <label className={`consent${consentInvalid ? " is-invalid" : ""}`}>
          <input
            type="checkbox"
            name="consent"
            disabled={sending}
            onChange={() => setConsentInvalid(false)}
          />
          <span>
            Даю{" "}
            <a href="/consent" target="_blank" rel="noopener">
              согласие на обработку персональных данных
            </a>{" "}
            и связь через Telegram. С{" "}
            <a href="/privacy" target="_blank" rel="noopener">
              политикой обработки персональных данных
            </a>{" "}
            ознакомлен(а).
          </span>
        </label>
        <button type="submit" className="btn btn-primary btn-block" disabled={sending}>
          {sending ? "Отправляем…" : "Отправить заявку"}
        </button>
        <div className={`form-error${error ? " show" : ""}`}>{error}</div>
      </form>
      <div className="form-success" id="formSuccess">
        Заявка отправлена ✓<br />
        <span style={{ fontFamily: "var(--font-b)", fontWeight: 400, color: "var(--muted-dark)", fontSize: "14px" }}>
          Свяжемся с вами в течение дня
        </span>
      </div>
    </div>
  );
}

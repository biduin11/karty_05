// Shared lead-form rules: used by both the client form and the /api/lead route.

export const TELEGRAM_USERNAME_RE = /^@?[A-Za-z][A-Za-z0-9_]{4,31}$/;

export const NAME_MAX_LENGTH = 100;

export function isValidName(name: string): boolean {
  return name.length > 0 && name.length <= NAME_MAX_LENGTH;
}

export function isValidTelegram(telegram: string): boolean {
  return TELEGRAM_USERNAME_RE.test(telegram);
}

export function normalizeTelegram(telegram: string): string {
  return telegram.startsWith("@") ? telegram : `@${telegram}`;
}

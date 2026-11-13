import { HttpError } from "./http";
export interface IntakeData {
  name: string;
  company: string;
  email: string;
  country: "DE" | "AT" | "CH";
  vertical: "cbam" | "subcontractor" | "nearshoring";
  language: "de" | "sr";
  message: string;
  consent: true;
  turnstileToken: string;
  files: Array<{ name: string; type: string; data: string }>;
}
function text(v: unknown, min: number, max: number) {
  if (
    typeof v !== "string" ||
    v.trim().length < min ||
    v.length > max ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v)
  )
    throw new HttpError(400, "invalid_fields");
  return v.trim();
}
export function validateIntake(value: unknown): IntakeData {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new HttpError(400, "invalid_fields");
  const b = value as Record<string, any>;
  if (
    b.consent !== true ||
    !["DE", "AT", "CH"].includes(b.country) ||
    !["cbam", "subcontractor", "nearshoring"].includes(b.vertical) ||
    !["de", "sr"].includes(b.language)
  )
    throw new HttpError(400, "invalid_fields");
  const email = text(b.email, 5, 254).toLowerCase();
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))
    throw new HttpError(400, "invalid_email");
  const files = b.files ?? [];
  if (!Array.isArray(files) || files.length > 2)
    throw new HttpError(400, "invalid_files");
  for (const file of files) {
    if (!file || typeof file !== "object")
      throw new HttpError(400, "invalid_files");
    text(file.name, 1, 120);
    if (
      file.type !== "text/plain" ||
      !file.name.toLowerCase().endsWith(".txt") ||
      typeof file.data !== "string" ||
      new TextEncoder().encode(file.data).length > 32000 ||
      /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(file.data)
    )
      throw new HttpError(415, "only_plain_text_documents");
  }
  return {
    name: text(b.name, 2, 100),
    company: text(b.company, 2, 160),
    email,
    country: b.country,
    vertical: b.vertical,
    language: b.language,
    message: text(b.message, 20, 4000),
    consent: true,
    turnstileToken: text(b.turnstileToken, 10, 2048),
    files,
  };
}

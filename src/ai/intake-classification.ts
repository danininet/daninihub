// Portable rule-based triage. No provider, storage, network or side effects.
export type IntakeLanguage = "de" | "sr" | "unknown";
export type IntakeRisk = "sensitive_data" | "payment" | "regulated_advice" | "external_action" | "none_detected";
export interface Classification {
  language: IntakeLanguage;
  vertical: "AutoDanini" | "DANINI Business" | "unresolved";
  intent: "vehicle_document_check" | "business_automation" | "tender_preparation" | "clarify";
  risk: IntakeRisk;
  requiresHumanReview: true;
}
export function classifyIntake(message: unknown, explicitLanguage?: unknown): Classification {
  const text = typeof message === "string" ? message.slice(0, 4000).normalize("NFKC").toLowerCase() : "";
  const de = /\bich\b|\bwir\b|fahrzeug|gebrauchtwagen|anzahlung|unternehmen|kundenanfrag|geschäftsanfrag|angebotsentw|ausschreibung|büroprozess|inserat/.test(text);
  const sr = /želim|zelim|želim[o]?|zelimo|imam|pomoć|pomoc|vozil|kapar|automobil|poslovn\w* upit|upit\w* klijenata|obrad\w* upit|firm[uaei]|javne nabavke/.test(text);
  const language = explicitLanguage === "de" || explicitLanguage === "sr" ? explicitLanguage : de === sr ? "unknown" : de ? "de" : "sr";
  const auto = /fahrzeug|gebrauchtwagen|auto kaufen|vozil|kapar|automobil|kupovin\w* auta|kupim auto|anzahlung|inserat/.test(text);
  const tender = /ausschreibung|javne nabavke|\btender\w*/.test(text);
  const business = tender || /firm[uaei]|poslovn\w* upit|upit\w* klijenata|obrad\w* upit|unternehmen|geschäftsanfrag|kundenanfrag|angebotsentw|büroprozess/.test(text);
  const vertical = auto === business ? "unresolved" : auto ? "AutoDanini" : "DANINI Business";
  const intent = vertical === "AutoDanini" ? "vehicle_document_check" : vertical === "DANINI Business" ? tender ? "tender_preparation" : "business_automation" : "clarify";
  // Conservative lexical flags, not a guarantee of detecting all personal data or risky intent.
  const risk = /\biban\b|ausweis|pasoš|pasos|lozink|passwort|api[ _-]?key|kartic\w*|kreditkarten|\b[A-Z]{2}\d{2}(?:[ ]?[A-Z0-9]){11,30}\b/i.test(text) ? "sensitive_data"
    : /kapar|anzahlung|überweis|uplati|zahlung|platim/.test(text) ? "payment"
    : /rechtsberatung|steuerberatung|pravni savet|poreski savet/.test(text) ? "regulated_advice"
    : /odmah pošalji|odmah posalji|sofort senden|objavi|veröffentliche/.test(text) ? "external_action" : "none_detected";
  return { language, vertical, intent, risk, requiresHumanReview: true };
}

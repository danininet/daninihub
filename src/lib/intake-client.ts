declare global {
  interface Window {
    turnstile: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string;
      getResponse: (id: string) => string;
      reset: (id: string) => void;
    };
  }
}
const form = document.querySelector<HTMLFormElement>("#intake");
if (form) {
  const de = form.dataset.locale === "de";
  const button = form.querySelector<HTMLButtonElement>("button")!;
  const status = document.querySelector<HTMLElement>("#form-status")!;
  let widget = "";
  let mode: "b2b" | "legacy" | null = null;
  let requestId = crypto.randomUUID();
  const offline = () => {
    status.textContent = de
      ? "Die sichere Online-Anfrage ist derzeit nicht verfügbar. Schreiben Sie bitte an info@daninihub.com."
      : "Zaštićeni obrazac trenutno nije dostupan. Pišite na info@daninihub.com.";
    button.disabled = true;
  };
  async function initialize() {
    let config: { enabled: boolean; siteKey?: string } | null = null;
    try {
      const response = await fetch("/api/tenant-config", { cache: "no-store" });
      if (response.ok) {
        const data = (await response.json()) as { enabled: boolean; siteKey?: string };
        if (data.enabled && data.siteKey) {
          mode = "b2b";
          config = data;
        }
      }
      if (!config) {
        const legacy = await fetch("/api/lead/status", { cache: "no-store" });
        if (legacy.ok) {
          const data = (await legacy.json()) as {
            enabled: boolean;
            turnstileSiteKey?: string;
          };
          if (data.enabled && data.turnstileSiteKey) {
            mode = "legacy";
            config = { enabled: true, siteKey: data.turnstileSiteKey };
            const upload = form!.querySelector<HTMLInputElement>("#attachments");
            if (upload) {
              upload.disabled = true;
              const help = document.querySelector<HTMLElement>("#upload-help");
              if (help) help.textContent = de
                ? "Dokumente senden Sie bitte nur nach persönlicher Aufforderung. Dieses Anfrageformular überträgt keine Dateien."
                : "Dokumenta šaljite samo na izričit zahtev. Ovaj obrazac ne šalje datoteke.";
            }
          }
        }
      }
      if (!config?.siteKey) throw Error("No protected intake configured");
      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.onload = () => {
        widget = window.turnstile.render(document.querySelector("#captcha")!, {
          sitekey: config!.siteKey,
          action: mode === "b2b" ? "b2b-intake" : "business-contact",
          language: de ? "de" : "sr",
          callback: () => { button.disabled = false; },
          "expired-callback": () => { button.disabled = true; },
        });
      };
      script.onerror = offline;
      document.head.appendChild(script);
    } catch {
      offline();
    }
  }
  void initialize();
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    button.disabled = true;
    const values = Object.fromEntries(new FormData(form!));
    status.textContent = de ? "Wird sicher übertragen …" : "Bezbedno slanje …";
    try {
      const selected = Array.from(
        form!.querySelector<HTMLInputElement>("#attachments")?.files || [],
      );
      if (
        selected.length > 2 ||
        selected.some(
          (file) =>
            file.size > 32000 || !file.name.toLowerCase().endsWith(".txt"),
        )
      ) {
        status.textContent = de
          ? "Bitte höchstens zwei .txt-Dateien mit jeweils bis zu 32 KB wählen."
          : "Izaberite najviše dve .txt datoteke do 32 KB svaka.";
        return;
      }
      const files = await Promise.all(
        selected.map(async (file) => ({
          name: file.name,
          type: "text/plain",
          data: new TextDecoder("utf-8", { fatal: true }).decode(
            await file.arrayBuffer(),
          ),
        })),
      );
      const captchaToken = window.turnstile.getResponse(widget);
      let endpoint = "/api/intake";
      let headers: Record<string, string> = { "content-type": "application/json" };
      let body: unknown = {
        ...values,
        files,
        consent: true,
        language: de ? "de" : "sr",
        turnstileToken: captchaToken,
      };
      if (mode === "b2b") {
        headers["idempotency-key"] = requestId;
      } else if (mode === "legacy") {
        if (selected.length) {
          status.textContent = de
            ? "Dieses Formular unterstützt keine Dateianhänge."
            : "Ovaj obrazac trenutno ne podržava priloge.";
          return;
        }
        const message = String(values.message || "");
        if (message.length > 3200) {
          status.textContent = de
            ? "Bitte kürzen Sie Ihre Nachricht auf 3200 Zeichen."
            : "Skratite poruku na najviše 3200 znakova.";
          return;
        }
        const verticalLabels: Record<string, string> = {
          cbam: "CBAM Pre-Check",
          subcontractor: "Subcontractor Compliance (SOKA/FKS)",
          nearshoring: "Nearshoring",
        };
        const topic = verticalLabels[String(values.vertical)] || "B2B Projektanfrage";
        endpoint = "/api/lead";
        body = {
          kind: "business",
          name: values.name,
          company: values.company,
          email: values.email,
          topic,
          message,
          language: de ? "de" : "sr",
          consent: true,
          details: { vertical: String(values.vertical), country: String(values.country) },
          turnstileToken: captchaToken,
        };
      } else {
        throw Error("Intake not configured");
      }
      const r = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      const result = (await r.json()) as { reference: string };
      if (r.status !== 202) throw Error();
      status.textContent =
        (de
          ? "Anfrage erfasst. Ihre Referenz: "
          : "Upit je evidentiran. Vaš broj: ") + result.reference;
      requestId = crypto.randomUUID();
      form!.reset();
    } catch {
      status.textContent = de
        ? "Übertragung nicht bestätigt. Bitte erneut versuchen oder per E-Mail nachfragen."
        : "Prijem nije potvrđen. Pokušajte ponovo ili proverite e-mailom.";
    } finally {
      window.turnstile.reset(widget);
    }
  });
}
export {};

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
  let requestId = crypto.randomUUID();
  const offline = () => {
    status.textContent = de
      ? "Die sichere Online-Anfrage ist derzeit nicht verfügbar. Schreiben Sie bitte an kontakt@daninihub.com."
      : "Zaštićeni obrazac trenutno nije dostupan. Pišite na kontakt@daninihub.com.";
    button.disabled = true;
  };
  fetch("/api/tenant-config")
    .then(async (r) => {
      if (!r.ok) throw Error();
      const config = (await r.json()) as { enabled: boolean; siteKey: string };
      if (!config.enabled || !config.siteKey) throw Error();
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.onload = () => {
        widget = window.turnstile.render(document.querySelector("#captcha")!, {
          sitekey: config.siteKey,
          action: "b2b-intake",
          language: de ? "de" : "sr",
          callback: () => {
            button.disabled = false;
          },
          "expired-callback": () => {
            button.disabled = true;
          },
        });
      };
      script.onerror = offline;
      document.head.appendChild(script);
    })
    .catch(offline);
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
      const r = await fetch("/api/intake", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "idempotency-key": requestId,
        },
        body: JSON.stringify({
          ...values,
          files,
          consent: true,
          language: de ? "de" : "sr",
          turnstileToken: window.turnstile.getResponse(widget),
        }),
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

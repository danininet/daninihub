  import { assess } from "./tender-quick-audit.mjs";
  for (const root of document.querySelectorAll("[data-tender-audit]")) {
    const de = root.dataset.locale === "de";
    const groups = Array.from(root.querySelectorAll("[data-tqa-question]"));
    const evaluate = root.querySelector("[data-tqa-evaluate]");
    const reset = root.querySelector("[data-tqa-reset]");
    const transfer = root.querySelector("[data-tqa-transfer]");
    const panel = root.querySelector("[data-tqa-result]");
    const score = root.querySelector("[data-tqa-score]");
    const status = root.querySelector("[data-tqa-status]");
    const gaps = root.querySelector("[data-tqa-gaps]");
    const notice = root.querySelector("[data-tqa-notice]");
    if (!evaluate || !reset || !transfer || !panel || !score || !status || !gaps || !notice || groups.length !== 5) continue;
    let summary = "";
    const responses = () => groups.map(g => g.querySelector("input:checked")?.value || "");
    const invalidate = () => {
      summary = "";
      panel.hidden = true;
      transfer.disabled = true;
      notice.textContent = "";
      evaluate.disabled = responses().some(a => a === "");
    };
    root.addEventListener("change", invalidate);
    reset.addEventListener("click", () => {
      for (const radio of root.querySelectorAll("input[type=radio]")) radio.checked = false;
      invalidate();
    });
    evaluate.addEventListener("click", () => {
      const answers = responses();
      if (answers.some(a => a === "")) return;
      const result = assess(answers);
      const labels = de ? {
        review:"REVIEW – Angaben fehlen; weitere Prüfung nötig.",
        "initial-ready":"Gute Ausgangslage laut eigenen Angaben.",
        partial:"Teilweise vorbereitet.",
        prepare:"Weitere Vorbereitung erforderlich."
      } : {
        review:"REVIEW – nedostaju podaci; potrebna je dodatna provera.",
        "initial-ready":"Dobra početna priprema prema sopstvenim odgovorima.",
        partial:"Delimična priprema.",
        prepare:"Potrebna je dodatna priprema."
      };
      const fmt = new Intl.NumberFormat(de ? "de-DE" : "sr-RS");
      score.textContent = fmt.format(result.score) + " / 100";
      status.textContent = labels[result.status];
      gaps.replaceChildren();
      const missing = [];
      const answerNames = de ? {yes:"Ja",partial:"Teilweise",no:"Nein",unknown:"Unbekannt"} : {yes:"Da",partial:"Delimično",no:"Ne",unknown:"Nije poznato"};
      for (const i of result.gaps) {
        const item = document.createElement("li");
        item.textContent = (groups[i].querySelector("legend")?.textContent || "") + " — " + answerNames[answers[i]];
        missing.push(item.textContent);
        gaps.append(item);
      }
      summary = ["DACH Tender Quick Audit – " + score.textContent, status.textContent,
        de?"Selbstauskunft, Eignung ungeprüft.":"Samoprocena, podobnost nije potvrđena.", ...missing].join("\n");
      panel.hidden = false;
      transfer.disabled = false;
      notice.textContent = de ? "Auswertung erstellt." : "Samoprocena je izračunata.";
    });
    transfer.addEventListener("click", () => {
      if (!summary) return;
      const contact = document.querySelector("form[data-business-enquiry]");
      const message = contact?.querySelector("textarea[name=message]");
      const service = contact?.querySelector("select[name=service]");
      if (!message || !service) {
        notice.textContent = de ? "Geschäftsanfrage nicht verfügbar." : "Poslovni upit trenutno nije dostupan.";
        return;
      }
      const old = message.value;
      const next = old.includes(summary) ? old : [old.trim(),summary].filter(Boolean).join("\n\n");
      if (message.maxLength >= 0 && next.length > message.maxLength) {
        notice.textContent = de ? "Der vorhandene Text ist zu lang. Bitte kürzen Sie den Entwurf zuerst." : "Postojeći tekst je predugačak. Najpre skratite nacrt.";
        return;
      }
      message.value = next;
      if (!service.value) service.value = "crossborder";
      message.dispatchEvent(new Event("input",{bubbles:true}));
      notice.textContent = de ? "Entwurf ergänzt, nicht gesendet." : "Nacrt je dopunjen, nije poslat.";
      message.focus();
    });
    reset.disabled = false;
    invalidate();
  }

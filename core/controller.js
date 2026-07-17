const db = require('./db');
const tools = require('./tools');
const { loadConstitution, systemCache } = require('./memory');
const { BrevoClient } = require('@getbrevo/brevo');
const { normalizeArtifact, saveArtifact } = require('./artifacts/createArtifact');
const { generatePDFFromArtifact } = require('./pdf_generator');
const { writeAudit } = require('./audit');
const { saveEmailHtmlFromArtifact } = require('./email/createEmailBody');

// INICIJALIZACIJA (Sektor 6: Tech Support - Artikl 42)
const apiInstance = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY
}).transactionalEmails;

loadConstitution();

const controller = {
  /**
   * validate (Artikl 96)
   * Verifikacija Artifact-a pre nego što izađe iz jezgra.
   */
  validate: (aiResponse) => {
   if (!aiResponse || typeof aiResponse.odgovor !== 'string') {
      throw new Error("Neispravan format po Artiklu 7.");
    }
    aiResponse.podpitanja = Array.isArray(aiResponse.podpitanja)
      ? aiResponse.podpitanja.filter(Boolean).slice(0, 1)
      : [];
    aiResponse.kern_erkenntnisse = Array.isArray(aiResponse.kern_erkenntnisse)
      ? aiResponse.kern_erkenntnisse.filter(Boolean)
      : [];
    aiResponse.offene_annahmen = Array.isArray(aiResponse.offene_annahmen)
      ? aiResponse.offene_annahmen.filter(Boolean)
      : [];
    aiResponse.naechste_schritte = Array.isArray(aiResponse.naechste_schritte)
      ? aiResponse.naechste_schritte.filter(Boolean)
      : [];
    aiResponse.risiken = Array.isArray(aiResponse.risiken)
      ? aiResponse.risiken.filter(Boolean)
      : aiResponse.risiken ? [String(aiResponse.risiken)] : [];
    aiResponse.entscheidung_status = ['GO', 'REDEFINE', 'STOP'].includes(aiResponse.entscheidung_status)
      ? aiResponse.entscheidung_status
      : 'REDEFINE';
    console.log(`-> [VALIDATOR] Artifact verifikovan po Artiklu 96.`);
    return aiResponse;
  },

  /**
   * verifyAndExecute
   * Glavni motor: Povezuje Hostinger bazu, Ustav i AI (Artikl 77.1, 79, 93).
   */
  verifyAndExecute: async (input, locale) => {
    console.log(`-> [ORCHESTRATOR] Pokrećem protokol...`);
        // =====================================
    // OPERATIVNI TOOLS MODE
    // =====================================

    try {

      // LIST foldera
      if (input.startsWith("LIST:")) {
        const target = input.replace("LIST:", "").trim() || ".";
        const result = tools.listFiles(target);

        return {
          success: true,
          data: {
            odgovor: `Sadržaj foldera ${target}`,
            kontrapitanja: [],
            sledeci_korak: result,
            rizici: "Nema"
          }
        };
      }

      // READ fajla
      if (input.startsWith("READ:")) {
        const target = input.replace("READ:", "").trim();
        const result = tools.readFile(target);

        return {
          success: true,
          data: {
            odgovor: `Sadržaj fajla ${target}`,
            kontrapitanja: [],
            sledeci_korak: result,
            rizici: "Nema"
          }
        };
      }

      // CMD komande (safe allowlist)
      if (input.startsWith("CMD:")) {
        const cmd = input.replace("CMD:", "").trim();

        const allowed = [
          "ls",
          "pwd",
          "find",
          "cat",
          "sed",
          "npm run",
          "npm test",
          "node"
        ];

        const ok = allowed.some(a => cmd.startsWith(a));

        if (!ok) {
          throw new Error("Komanda nije dozvoljena.");
        }

        const result = await tools.runCommand(cmd);

        return {
          success: true,
          data: {
            odgovor: `Komanda izvršena: ${cmd}`,
            kontrapitanja: [],
            sledeci_korak: result,
            rizici: "Ograničen safe mode"
          }
        };
      }

      // SQL samo SELECT
      if (input.startsWith("SQL:")) {
        const sql = input.replace("SQL:", "").trim();

        if (!sql.toLowerCase().startsWith("select")) {
          throw new Error("Dozvoljen je samo SELECT.");
        }

        const rows = await tools.queryDB(sql);

        return {
          success: true,
          data: {
            odgovor: "SQL upit uspešan",
            kontrapitanja: [],
            sledeci_korak: rows,
            rizici: "Read only mode"
          }
        };
      }

    } catch (toolError) {
      return {
        success: false,
        error: toolError.message
      };
    }

    // 1. AUDIT LOG (Artikl 79)
    try {
      await db.query(
        "INSERT INTO audit_logs (agent, input, timestamp) VALUES (?, ?, NOW())", 
        ['core.meta.commander', input]
      );
    } catch (e) {
      console.log("-> [DB WARNING] Audit log nije upisan.");
    }

    // 2. KONTEKST (Artikl 107)
    const isStrategic = input.toLowerCase().includes("ustav") || input.toLowerCase().includes("strategija");
    const context = isStrategic ? systemCache.ustav : "Ti si DaniniHub Meta Commander.";

    // 3. STROGI PROMPT
const systemPrompt = `
KONTEKST: ${context}

ULOGA:
Ti si DaniniHub Meta Commander.

PRAVILA:
1. Analiziraj samo činjenice iz zadatka; ne izmišljaj kontekst.
2. Svaka tvrdnja mora biti vezana za konkretan podatak iz korisničkog unosa.
3. Ne koristi generičke motivacione fraze, šablonske savete ni interne sistemske nazive.
4. Nepoznato i nepotvrđeno jasno označi kao pretpostavku.
5. Donesi odluku GO, REDEFINE ili STOP i objasni zašto.
6. Sledeći koraci moraju biti merljivi, vremenski određeni i prilagođeni ovom slučaju.
7. Ne koristi reč kontrapitanja.

VRATI ISKLJUČIVO JSON:

{
  "odgovor":"sažeta personalizovana analiza",
  "ausgangslage":"konkretna polazna situacija iz dijaloga",
  "kern_erkenntnisse":["konkretna spoznaja"],
  "offene_annahmen":["nepotvrđena pretpostavka ili nepoznat podatak"],
  "entscheidung_status":"GO | REDEFINE | STOP",
  "entscheidung_begruendung":"razlog odluke vezan za korisničke odgovore",
  "naechste_schritte":["prioritet i rok"],
  "podpitanja":[],
  "sledeci_korak":"jedna prva radnja u naredna 72 sata",
  "rizici":["konkretan rizik"]
}`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt + "\n\nZADATAK: " + input }] }]
        })
      });

      if (!response.ok) throw new Error(`MODEL_HTTP_${response.status}`);
      const data = await response.json();
      let aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      const jsonMatch = aiText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Model nije vratio Artifact JSON.");
      
      const parsedData = JSON.parse(jsonMatch[0]);
      const validatedData = controller.validate(parsedData);

      const artifact = normalizeArtifact({
        mode: isStrategic ? 'STRATEGY_BUILD' : 'SUPPORT_OPS',
        raw_input: input,
        locale: locale || 'de',
        source: 'controller',
        lead_agent: 'core.meta.commander',
        support_agents: ['core.guard.zero_hallucination', 'core.validator'],
        evidence_used: Boolean(context),
        evidence_sources: isStrategic
          ? ['docs/reference/ustav.txt', 'docs/reference/AGENT PROTOCOLS (FULL 56).txt']
          : [],
        evidence_notes: isStrategic
          ? 'Strategic task used loaded constitution context.'
          : 'Non-strategic task used controller system prompt.',
        summary: validatedData.odgovor || '',
        A_problem: validatedData.ausgangslage || input,
        B_evidence: validatedData.kern_erkenntnisse.join('\n'),
        C_plan: validatedData.naechste_schritte.join('\n'),
        D_execution: validatedData.odgovor || '',
        E_next: validatedData.sledeci_korak || '',
        decision: validatedData.entscheidung_status,
        decision_reason: validatedData.entscheidung_begruendung || '',
        insights: validatedData.kern_erkenntnisse,
        assumptions: validatedData.offene_annahmen,
        risks: validatedData.risiken,
        next_step: validatedData.sledeci_korak || '',
        validated: true,
        controller_status: 'approved',
        controller_reason: 'Output structure and required customer-facing fields validated.'
      });

      const artifact_path = saveArtifact(artifact);
      const pdf_path = await generatePDFFromArtifact(artifact);
      const email_html_path = saveEmailHtmlFromArtifact(artifact, 'outputs/email');

      writeAudit({
        event: 'controller_success',
        run_id: artifact.run_id,
        mode: artifact.mode,
        locale: artifact.input?.locale,
        source: artifact.input?.source,
        lead_agent: artifact.agent?.lead,
        controller_status: artifact.controller?.status,
        artifact_path,
        pdf_path,
        email_html_path
      });

      return {
        success: true,
        data: validatedData,
        artifact,
        artifact_path,
        pdf_path,
        email_html_path
      };

    } catch (error) {
      console.error("-> [CRISIS] GRESKA:", error.message);

      writeAudit({
        event: 'controller_failure',
        input,
        locale: locale || 'de',
        error: error.message
      });

      return { success: false, error: error.message };
    }
  },

  /**
   * sendArtifact (Artikl 42)
   */
  sendArtifact: async (email, subject, content) => {
    try {
      const sendSmtpEmail = {
        subject,
        htmlContent: content,
        sender: { name: "DaniniHub", email: "info@daninihub.com" },
        to: [{ email }]
      };
      return await apiInstance.sendTransacEmail(sendSmtpEmail);
    } catch (error) {
      console.error("Brevo greška:", error);
      throw error;
    }
  }
};

module.exports = controller;

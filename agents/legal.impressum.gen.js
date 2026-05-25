// ~/daninihub/agents/legal.impressum.gen.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class LegalImpressumAgent {
    static async execute(task, evidence) {
        console.log(`[AGENT: legal.impressum.gen]: Primio zadatak. Generišem pravni tekst.`);
        const model = genAI.getGenerativeModel({ model: process.env.OPERATIVE_MODEL });
        const result = await model.generateContent(task);
        return { success: true, agent: "legal.impressum.gen", response: result.response.text() };
    }
}
module.exports = LegalImpressumAgent;

// ~/daninihub/agents/dev_cto.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");

// Inicijalizacija OBA klijenta sa ključevima iz .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class DevCTO {
    static async execute(task, evidence) {
        // Čita koji model treba da koristi iz .env fajla (Artikl 77.1)
        const modelName = process.env.OPERATIVE_MODEL;

        if (!modelName) {
            return { success: false, error: "GREŠKA: OPERATIVE_MODEL nije definisan u .env fajlu." };
        }

        console.log(`[DEV_CTO]: Koristim model: ${modelName} za zadatak: ${task}`);

        try {
            // Ako je Gemini model
            if (modelName.includes('gemini')) {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(task);
                return { success: true, agent: "dev_cto", response: result.response.text() };
            } 
            // Ako je OpenAI model
            else {
                const completion = await openai.chat.completions.create({
                    model: modelName,
                    messages: [{ role: "user", content: task }]
                });
                return { success: true, agent: "dev_cto", response: completion.choices[0].message.content };
            }
        } catch (error) {
            return { success: false, error: `API GREŠKA: ${error.message}` };
        }
    }
}
module.exports = DevCTO;

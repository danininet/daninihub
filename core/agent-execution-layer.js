const db = require('./db.js'); // Putanja do tvog fajla za bazu

/**
 * CORE GUARD: Naplata i provjera prije pokretanja agenta
 * @param {number} userId - ID korisnika
 * @param {string} agentId - ID agenta (npr. 'pdf_generator')
 * @returns {object} - Status provjere i preostali balans
 */
async function autorizujIPokreniAgenta(userId, agentId) {
    // 1. Definišemo cijenu po Aneksu A-3 iz Ustava
    let cenaTokena = 5; // LAKO - default za osnovne agente
    
    const srednjiAgenti = ['research.intent.analyst', 'seo.keyword.master', 'market.competitor.analyst'];
    const teskiAgenti = ['pdf_generator', 'core.artifact.system', 'content.ebook.formatter'];

    if (srednjiAgenti.includes(agentId)) cenaTokena = 15;
    if (teskiAgenti.includes(agentId)) cenaTokena = 50;

    // Uzimamo konekciju za bezbjednu transakciju
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 2. Provjeravamo stanje u token_ledger (FOR UPDATE zaključava red dok ne završimo)
        const [rows] = await connection.query(
            'SELECT balance FROM token_ledger WHERE user_id = ? FOR UPDATE', 
            [userId]
        );

        if (rows.length === 0) {
            throw new Error("Korisnik nema otvoren token račun.");
        }

        const trenutnoStanje = rows[0].balance;

        if (trenutnoStanje < cenaTokena) {
            throw new Error(`Nedovoljno DH-TOKENA. Potrebno: ${cenaTokena}, Raspoloživo: ${trenutnoStanje}. Molimo dopunite kredit.`);
        }

        // 3. Skidamo tokene
        const novoStanje = trenutnoStanje - cenaTokena;
        await connection.query(
            'UPDATE token_ledger SET balance = ? WHERE user_id = ?', 
            [novoStanje, userId]
        );

        // 4. Bilježimo u audit_logs (Da znaš na šta su trošili)
        await connection.query(
            'INSERT INTO audit_logs (user_id, action, agent_id, tokens_spent) VALUES (?, ?, ?, ?)',
            [userId, 'AGENT_EXECUTION', agentId, cenaTokena]
        );

        // Potvrđujemo transakciju
        await connection.commit();

        console.log(`-> [TOKEN GUARD] ${cenaTokena} tokena skinuto. Preostalo: ${novoStanje}. Odobren agent: ${agentId}`);
        
        return { 
            dozvoljeno: true, 
            preostalo: novoStanje,
            poruka: "Agent odobren."
        };

    } catch (error) {
        // Ako bilo šta pukne, poništavamo cijelu transakciju (ne skidamo tokene)
        await connection.rollback();
        console.error("-> [TOKEN GUARD BLOKADA]:", error.message);
        
        return { 
            dozvoljeno: false, 
            poruka: error.message 
        };
    } finally {
        connection.release();
    }
}

// Ne zaboravi eksportovati funkciju da bi je druge rute mogle koristiti
module.exports = { autorizujIPokreniAgenta };

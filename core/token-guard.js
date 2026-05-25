const db = require('./db.js');

async function autorizujIPokreniAgenta(userId, agentId) {
    let cenaTokena = 5; 
    const srednjiAgenti = ['research.intent.analyst', 'seo.keyword.master', 'market.competitor.analyst'];
    const teskiAgenti = ['pdf_generator', 'core.artifact.system', 'content.ebook.formatter'];

    if (srednjiAgenti.includes(agentId)) cenaTokena = 15;
    if (teskiAgenti.includes(agentId)) cenaTokena = 50;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Proveravamo u tabeli users
        const [rows] = await connection.query(
            'SELECT tokens_balance FROM users WHERE id = ? FOR UPDATE', 
            [userId]
        );

        if (rows.length === 0) throw new Error("Korisnik ne postoji.");
        
        const trenutnoStanje = rows[0].tokens_balance;
        if (trenutnoStanje < cenaTokena) {
            throw new Error(`Nedovoljno tokena. Potrebno: ${cenaTokena}, Imaš: ${trenutnoStanje}.`);
        }

        const novoStanje = trenutnoStanje - cenaTokena;
        
        // Skidamo iz users
        await connection.query('UPDATE users SET tokens_balance = ? WHERE id = ?', [novoStanje, userId]);
        
        // Pišemo trag u token_ledger
        await connection.query(
            'INSERT INTO token_ledger (user_id, agent, tokens_spent, action_type, timestamp) VALUES (?, ?, ?, ?, NOW())',
            [userId, agentId, cenaTokena, 'AGENT_EXECUTION']
        );

        await connection.commit();
        return { dozvoljeno: true, preostalo: novoStanje };
    } catch (error) {
        await connection.rollback();
        return { dozvoljeno: false, poruka: error.message };
    } finally {
        connection.release();
    }
}

module.exports = { autorizujIPokreniAgenta };

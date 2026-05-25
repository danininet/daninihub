const db = require('./db.js');

module.exports = function setupPlasmicRoutes(app) {
    app.get('/api/token-balance', async (req, res) => {
        const userId = req.query.userId || 1; 

        try {
            // Gledamo u tabelu users, kolona tokens_balance
            const [rows] = await db.query('SELECT tokens_balance FROM users WHERE id = ?', [userId]);
            
            if (rows.length === 0) return res.json({ success: true, balance: 0 });
            
            // Šaljemo podatak Plasmicu (nazivamo ga 'balance' da Plasmic ne mora da se menja)
            res.json({ success: true, balance: rows[0].tokens_balance });
        } catch (error) {
            console.error("-> [DB GREŠKA] Čitanje balansa:", error.message);
            res.status(500).json({ success: false, error: "Sistemska greška" });
        }
    });

    app.get('/api/addons', (req, res) => {
        const paketi = [
            { id: 'paket_start', naziv: 'START (Entry)', cena_eur: 7, tokeni: 700, opis: 'Prolazak kroz Gate 0 i Gate 1' },
            { id: 'paket_addon', naziv: 'ADD-ON (Dopuna)', cena_eur: 10, tokeni: 1000, opis: 'Standardna dopuna za operativni rad' },
            { id: 'paket_pro', naziv: 'PRO (Monthly)', cena_eur: 49, tokeni: 5000, opis: 'Profesionalni korisnici (Full Gate 0-5)' }
        ];
        res.json({ success: true, data: paketi });
    });
};

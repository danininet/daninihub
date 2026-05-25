const fs = require('fs');
const path = require('path');

const systemCache = { ustav: "" };

function loadConstitution() {
    // Putanja fiksirana na docs/reference/ustav.txt po tvojoj instrukciji
    const ustavPath = path.join(process.cwd(), 'docs', 'reference', 'ustav.txt');
    
    try {
        if (fs.existsSync(ustavPath)) {
            systemCache.ustav = fs.readFileSync(ustavPath, 'utf8');
            console.log("-> [MEMORY] USPEH: Ustav učitan u RAM iz docs/reference/ustav.txt.");
        } else {
            console.log("-> [CRISIS] GREŠKA: Fajl NE POSTOJI na lokaciji: " + ustavPath);
        }
    } catch (err) {
        console.log("-> [CRISIS] Sistemska greška pri pristupu Ustavu: " + err.message);
    }
}

module.exports = { loadConstitution, systemCache };

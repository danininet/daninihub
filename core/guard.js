// ~/daninihub/core/guard.js
class Guard {
    static verify(output) {
        if (!output.evidence) throw new Error("HALUCINACIJA DETEKTOVANA: Nema evidence-a.");
        return true;
    }
}
module.exports = Guard;

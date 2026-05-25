import { useState, useEffect } from 'react'

function InternalDashboard() {
  const [balance, setBalance] = useState('...');
  const [odabraniSektor, setOdabraniSektor] = useState('Sektor 1');
  const [odabraniAgent, setOdabraniAgent] = useState('core.meta.commander');
  const [inputText, setInputText] = useState('');
  const [terminalText, setTerminalText] = useState('Sistem spreman. Čekam unos za slanje na API server...');
  const [isLoading, setIsLoading] = useState(false);

  // Interni katalog agenata po sektorima. Donation module je uklonjen iz MVP-a; Gumroad je dodat kao MVP sales channel.
  const sektori = {
    'Sektor 1': { ime: 'CORE & ORCHESTRATION', agenti: ['core.meta.commander', 'internal.dev.cto', 'core.orchestrator', 'core.guard.zero_hallucination', 'core.method.engine', 'core.registry', 'core.artifact.system', 'core.artifact.store', 'core.audit.log', 'core.validator'] },
    'Sektor 2': { ime: 'MONETIZACIJA & FINANSIJE', agenti: ['monetization.product.manager', 'monetization.token.engine', 'monetization.stripe.webhook', 'monetization.gumroad.channel', 'monetization.affiliate.scout', 'monetization.partner.verifier', 'monetization.evergreen.finder', 'monetization.disclosure.guard', 'monetization.link.hygiene'] },
    'Sektor 3': { ime: 'DACH & LEGAL', agenti: ['legal.linguistic.de', 'legal.compliance.gdpr', 'legal.impressum.gen', 'legal.privacy.protocol', 'legal.dach.analyst', 'legal.belastbarkeit.auditor'] },
    'Sektor 4': { ime: 'CONTENT & VIDEO', agenti: ['content.gen.main', 'content.structure.v2', 'content.copywriter', 'content.script.video', 'content.course.architect', 'content.ebook.formatter', 'content.template.library', 'content.landing.blocks'] },
    'Sektor 5': { ime: 'ANALITIKA & ISTRAŽIVANJE', agenti: ['research.audience.deep', 'research.seo.main', 'research.intel.competitive', 'research.analytics.gsc', 'research.trend.scout', 'research.intent.analyst'] },
    'Sektor 6': { ime: 'TEHNIČKA PODRŠKA', agenti: ['tech.support.diag', 'tech.qa.console', 'tech.brevo.sync', 'tech.db.sync', 'tech.env.config', 'tech.api.fallback', 'internal.dev.frontend', 'internal.dev.backend', 'internal.security.auditor'] },
    'Sektor 7': { ime: 'SPECIAL OPS', agenti: ['special.activation.app', 'special.runner', 'special.snapshot', 'special.vertiefung', 'special.risk.sim', 'special.logic.clash', 'special.clarity.eval', 'special.feedback.loop'] }
  };

  // Povlačenje pravog stanja žetona sa tvog servera
  const povuciBalans = () => {
    fetch('http://localhost:3000/api/token-balance?userId=1')
      .then(res => res.json())
      .then(data => {
        if (data.success) setBalance(data.balance);
      })
      .catch(() => setBalance('OFFLINE'));
  };

  useEffect(() => {
    povuciBalans();
  }, []);

  // PRAVO SLANJE NA TVOJ API - NEMA SIMULACIJE
  const pokreniAgentaNaServeru = async () => {
    if (!inputText.trim()) {
      setTerminalText('⚠️ Greška: Polje za unos je prazno.');
      return;
    }

    setIsLoading(true);
    setTerminalText(`🚀 [API POZIV] Šaljem nalog za agenta: ${odabraniAgent} na server (Port 3000)...`);

    try {
      const response = await fetch('http://localhost:3000/api/run-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          agentId: odabraniAgent,
          tekst: inputText
        })
      });
      
      const data = await response.json();

      if (data.success) {
        // Prikazuje tačan ispis koji je vratio tvoj backend agent
        setTerminalText(`✅ ODGOVOR SERVERA [Agent: ${odabraniAgent}]:\n\n${data.output}`);
      } else {
        setTerminalText(`❌ SERVER VRATIO GREŠKU:\n${data.message}`);
      }
    } catch (err) {
      setTerminalText(`❌ GREŠKA U KONEKCIJI: Ne mogu da se povežem sa API serverom na portu 3000.\n\nProveri da li ti je u terminalu upaljen backend sa "node server.js".`);
    } finally {
      setIsLoading(false);
      povuciBalans(); // Automatski povuci novi balans nakon što server potroši tokene
    }
  };

  return (
    <div style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', fontFamily: 'monospace', padding: '20px' }}>
      
      {/* HEADER */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #1e293b', paddingBottom: '15px', alignItems: 'center', background: '#0f172a', padding: '15px 25px', borderRadius: '8px' }}>
        <div>
          <h1 style={{ color: '#38bdf8', fontSize: '20px', margin: 0, fontWeight: 'bold' }}>DANINIHUB // OS OPERATIVNI PANEL</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '11px' }}>INTERNAL ONLY // OWNER: DRAGAN ZDRAVKOVIĆ // DIREKTNA API VEZA</p>
        </div>
        <div style={{ background: '#020617', padding: '10px 20px', borderRadius: '6px', border: '1px solid #334155', color: '#4ade80', fontSize: '14px' }}>
          STANJE: <strong>{balance} DHT</strong>
        </div>
      </nav>

      {/* GLAVNA RADNA STRUKTURA */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '25px', marginTop: '25px' }}>
        
        {/* LEVI PANEL: SEKTORI I AGENTI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#0f172a', padding: '15px', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '10px' }}>SEKTORI USTAVA:</div>
            {Object.keys(sektori).map((kljuc) => (
              <button 
                key={kljuc} 
                onClick={() => { setOdabraniSektor(kljuc); setOdabraniAgent(sektori[kljuc].agenti[0]); }} 
                style={{ ...btnSektor, backgroundColor: odabraniSektor === kljuc ? '#1e3a8a' : '#020617', border: odabraniSektor === kljuc ? '1px solid #38bdf8' : '1px solid #1e293b' }}
              >
                {kljuc}: {sektori[kljuc].ime}
              </button>
            ))}
          </div>

          <div style={{ background: '#0f172a', padding: '15px', borderRadius: '12px', border: '1px solid #1e293b', flex: 1, overflowY: 'auto', maxHeight: '350px' }}>
            <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '10px' }}>REČNIK AGENATA SEKTORA ({sektori[odabraniSektor].agenti.length}):</div>
            {sektori[odabraniSektor].agenti.map((agent) => (
              <button key={agent} onClick={() => setOdabraniAgent(agent)} style={{ ...btnAgent, color: odabraniAgent === agent ? '#38bdf8' : '#94a3b8', fontWeight: odabraniAgent === agent ? 'bold' : 'normal' }}>
                🤖 [ID: {agent}]
              </button>
            ))}
          </div>
        </div>

        {/* DESNI PANEL: INPUT I REAL-TIME TERMINAL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '10px' }}>SELEKTOVANI AGENT ZA IZVRŠAVANJE: <strong style={{ color: '#38bdf8' }}>{odabraniAgent}</strong></div>
            
            <textarea 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} 
              placeholder={`Upišite radni nalog koji prosleđujemo agentu ${odabraniAgent}...`} 
              style={tekstPolje} 
            />
            
            <button 
              disabled={isLoading}
              onClick={pokreniAgentaNaServeru} 
              style={{ ...GlavnoDugme, background: isLoading ? '#334155' : '#38bdf8', cursor: isLoading ? 'not-allowed' : 'pointer' }}
            >
              {isLoading ? 'SLANJE U TOKU...' : '⚡ POZOVI AGENTSKI API PROCES'}
            </button>
          </div>

          {/* DOLE: SIROVI ISPIS SA SERVERA */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ color: '#64748b', fontSize: '11px', marginBottom: '5px' }}>SIROVI IZLAZ IZ LOGOVA (API TERMINAL):</div>
            <div style={{ flex: 1, backgroundColor: '#020617', border: '2px solid #1e293b', borderRadius: '12px', padding: '20px', color: '#34d399', fontSize: '13px', whiteSpace: 'pre-wrap', minHeight: '300px', overflowY: 'auto' }}>
              {terminalText}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

// Stilovi elemenata interfejsa
const btnSektor = { width: '100%', padding: '12px', textAlign: 'left', borderRadius: '6px', color: 'white', cursor: 'pointer', marginBottom: '8px', fontSize: '12px', fontFamily: 'monospace' }
const btnAgent = { width: '100%', padding: '8px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontFamily: 'monospace' }
const tekstPolje = { width: '100%', height: '110px', backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '8px', color: 'white', padding: '12px', fontSize: '14px', fontFamily: 'monospace', resize: 'none', boxSizing: 'border-box' }
const GlavnoDugme = { color: '#020617', border: 'none', padding: '14px 25px', borderRadius: '6px', fontWeight: 'bold', fontFamily: 'monospace', marginTop: '10px', fontSize: '13px' }

export default InternalDashboard
/* AutoDanini listing phrase helper. Runs locally; does not access listing websites or send data. */
(() => {
  'use strict';
  const form = document.getElementById('ai-form');
  if (!form || document.getElementById('dn-phrase-tool')) return;
  const terms = [
    {pattern:/\bim\s+kundenauftrag\b/i,term:'Im Kundenauftrag',meaning:'Prodaja u ime trećeg lica. Proverite ko je stvarni prodavac i ko potpisuje ugovor.',risk:'medium'},
    {pattern:/\bbastlerfahrzeug\b/i,term:'Bastlerfahrzeug',meaning:'Vozilo za popravku / hobi. Zatražite detaljan opis kvarova, pregled i ugovorne uslove.',risk:'high'},
    {pattern:/\bnur\s+(?:für\s+)?export\b/i,term:'Nur Export',meaning:'Prodaja predviđena za izvoz. Tražite objašnjenje i proveru dokumentacije.',risk:'medium'},
    {pattern:/\bunfallfrei\b/i,term:'Unfallfrei',meaning:'Tvrdnja prodavca da nije bilo udesa; sama reč nije nezavisna potvrda.',risk:'low'},
    {pattern:/\bscheckheftgepflegt\b/i,term:'Scheckheftgepflegt',meaning:'Tvrdnja o servisnoj istoriji; tražite račune ili digitalne evidencije.',risk:'low'},
    {pattern:/\b(?:ohne\s+tüv|tüv\s+abgelaufen|kein\s+tüv)\b/i,term:'Ohne TÜV',meaning:'Tehnički pregled nije važeći ili nije dostupan. Proverite razlog i uslove prevoza.',risk:'high'},
    {pattern:/\b(?:motorschaden|getriebeschaden)\b/i,term:'Motor/Getriebe Schaden',meaning:'U oglasu je naveden ozbiljan problem sa motorom ili menjačem.',risk:'high'},
    {pattern:/\b(?:unfallwagen|unfallschaden)\b/i,term:'Unfallwagen/Unfallschaden',meaning:'Navodi se oštećenje ili istorija nezgode; tražite fotografije, račune i nezavisnu proveru.',risk:'high'},
    {pattern:/\b(?:privatverkauf|keine\s+garantie|keine\s+gewährleistung)\b/i,term:'Privatverkauf/Gewährleistung',meaning:'Posebno proveriti ko prodaje vozilo i koja zakonska prava važe; rečenica sama po sebi ne ukida potrošačka prava.',risk:'medium'}
  ];
  const questions = [
    'Könnten Sie mir bitte die Fahrzeug-Identifizierungsnummer (FIN) mitteilen?',
    'Wer ist der tatsächliche Verkäufer und wer wird den Kaufvertrag unterschreiben?',
    'Sind Ihnen Unfallschäden, Nachlackierungen oder technische Mängel bekannt?',
    'Könnten Sie mir bitte die vorhandenen Servicebelege und den letzten HU-Bericht zusenden?',
    'Wäre vor einer Kaufentscheidung eine unabhängige Besichtigung möglich?'
  ];
  const panel = document.createElement('section');
  panel.id = 'dn-phrase-tool';
  panel.setAttribute('aria-label','Nemački izrazi iz oglasa');
  panel.innerHTML = '<h2>Besplatna provera fraza iz nemačkog oglasa</h2><p>Nalepite tekst oglasa sa mobile.de ili AutoScout24. Alat radi samo u vašem pregledaču: ne otvara oglas, ne proverava prodavca i nije AI dijagnostika.</p><label for="dn-listing-text">Tekst oglasa (bez ličnih podataka)</label><textarea id="dn-listing-text" rows="6" maxlength="8000" placeholder="Im Kundenauftrag, scheckheftgepflegt, unfallfrei..."></textarea><button type="button" class="btn primary" id="dn-listing-check">Objasni izraze i pripremi pitanja</button><div id="dn-listing-output" role="status" aria-live="polite"></div><button type="button" class="btn ghost" id="dn-questions-copy" hidden>Kopiraj pet pitanja na nemačkom</button><p class="muted">Nisu pronađene fraze ≠ vozilo je bez rizika. AI i terenski pregled nisu izvršeni.</p>';
  const style = document.createElement('style');
  style.textContent = '#dn-phrase-tool{padding:22px;margin:0 0 24px;background:#fff;border:1px solid #c9d1da;border-radius:12px;color:#192430}#dn-phrase-tool h2{font-size:1.4rem;margin:0 0 12px}#dn-phrase-tool label{display:block;margin:12px 0 6px;font-weight:700}#dn-listing-text{box-sizing:border-box;display:block;width:100%;padding:12px;min-height:128px;max-width:100%;border:1px solid #9caebc;border-radius:8px}#dn-phrase-tool button{margin:12px 8px 12px 0}#dn-listing-output ul{padding-left:20px}#dn-listing-output li{margin:8px 0;line-height:1.5}#dn-listing-output strong{display:block}';
  document.head.append(style);
  form.parentNode.insertBefore(panel, form);
  const input = document.getElementById('dn-listing-text');
  const output = document.getElementById('dn-listing-output');
  const copy = document.getElementById('dn-questions-copy');
  document.getElementById('dn-listing-check').addEventListener('click', () => {
    output.replaceChildren();
    copy.hidden = true;
    const text = input.value.trim();
    if (text.length < 15) {
      output.textContent = 'Unesite najmanje 15 znakova teksta oglasa.';
      return;
    }
    const found = terms.filter(t => t.pattern.test(text));
    const intro = document.createElement('p');
    intro.textContent = found.length
      ? 'Prepoznate fraze (' + found.length + '): ovo su signali za dodatna pitanja, ne dokaz kvara ili prevare.'
      : 'Nijedna fraza iz ove ograničene liste nije pronađena. To ne znači da je oglas bez rizika.';
    output.append(intro);
    if (found.length) {
      const list = document.createElement('ul');
      for (const match of found) {
        const li = document.createElement('li');
        const heading = document.createElement('strong');
        heading.textContent = match.term + (match.risk === 'high' ? ' · važna provera' : '');
        li.append(heading,document.createTextNode(match.meaning));
        list.append(li);
      }
      output.append(list);
    }
    const heading = document.createElement('h3');
    heading.textContent = 'Pet pitanja prodavcu na nemačkom';
    output.append(heading);
    const ol = document.createElement('ol');
    for (const question of questions) {
      const li = document.createElement('li');
      li.textContent = question;
      ol.append(li);
    }
    output.append(ol);
    copy.hidden = false;
  });
  copy.addEventListener('click', async () => {
    const value = questions.map((q,i) => (i+1)+'. '+q).join('\n');
    try { await navigator.clipboard.writeText(value); copy.textContent='Kopirano ✓'; }
    catch { const ta=document.createElement('textarea');ta.value=value;document.body.append(ta);ta.select();document.execCommand('copy');ta.remove();copy.textContent='Kopirano ✓'; }
  });
})();
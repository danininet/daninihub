/* AutoDanini free listing wording helper; rule-based, local, no AI claims. */
(() => {
 'use strict';
 const main=document.querySelector('main');
 if(!main||!document.querySelector('.advisor-layout'))return;
 const phrases=[
  {re:/\bim\s+kundenauftrag\b/i,term:'Im Kundenauftrag',sr:'Prodaja u ime klijenta',de:'Verkauf im Kundenauftrag',risk:'Proverite ko je ugovorna strana i koja prava imate. Sam izraz ne ukida zakonska prava.',riskDe:'Klärung des tatsächlichen Vertragspartners und der Rechte erforderlich.'},
  {re:/\bbastlerfahrzeug\b/i,term:'Bastlerfahrzeug',sr:'Vozilo za popravku / hobi',de:'Bastlerfahrzeug / Reparaturbedarf',risk:'Moguć rizik tehničkih nedostataka. Tražite konkretan spisak poznatih mana.',riskDe:'Mögliche technische Mängel. Nach bekannten Defekten fragen.'},
  {re:/\bnur\s+export\b/i,term:'Nur Export',sr:'Samo izvoz',de:'Nur Export',risk:'Razjasnite razlog ograničenja i mogućnost pregleda pre kupovine.',riskDe:'Grund der Exportbeschränkung und Besichtigungsmöglichkeit klären.'},
  {re:/\bunfallfrei\b/i,term:'Unfallfrei',sr:'Prodavac tvrdi da nije bilo nezgoda',de:'Unfallfrei – Verkäuferangabe',risk:'Potražite pismenu potvrdu; oglas sam po sebi nije dokaz.',riskDe:'Schriftliche Bestätigung anfordern; kein unabhängiger Nachweis.'},
  {re:/\bscheckheftgepflegt\b/i,term:'Scheckheftgepflegt',sr:'Tvrdnja o servisnoj istoriji',de:'Scheckheftgepflegt',risk:'Tražite račune, zapise servisa i proverite kontinuitet kilometraže.',riskDe:'Belege und Servicehistorie anfordern.'},
  {re:/\bohne\s+t[uü]v\b/i,term:'Ohne TÜV',sr:'Bez važećeg tehničkog pregleda',de:'Ohne TÜV',risk:'Proverite mogućnost registracije, potrebne popravke i dodatne troškove.',riskDe:'Prüfstatus, Reparaturen und mögliche Mehrkosten klären.'},
  {re:/\bmotorschaden\b/i,term:'Motorschaden',sr:'Oštećenje motora',de:'Motorschaden',risk:'Visok potencijalni trošak. Potrebna je stručna dijagnostika pre odluke.',riskDe:'Hoher Reparaturrisiko; Fachdiagnose nötig.'}
 ];
 const questions=[
  'Könnten Sie mir bitte die Fahrzeug-Identifizierungsnummer (FIN) mitteilen?',
  'Sind Ihnen Unfallschäden, Nachlackierungen oder technische Mängel bekannt?',
  'Könnten Sie mir die Servicehistorie und vorhandene Rechnungen zusenden?',
  'Sind Sie der rechtmäßige Verkäufer und wer wird im Kaufvertrag als Vertragspartner genannt?',
  'Ist eine unabhängige Fahrzeugprüfung vor einer Anzahlung möglich?'
 ];
 const t=(sr,de)=>document.documentElement.lang==='de'?de:sr;
 const wrap=document.createElement('section');
 wrap.className='dn-phrases section';
 wrap.id='danini-listing-helper';
 wrap.innerHTML=`<div class="wrap dn-listing-wrap">
  <div class="dn-listing-main">
   <span class="kicker">AUTODANINI · LISTING CHECK</span>
   <h2 data-sr="Razumite nemački oglas pre uplate kapare" data-de="Deutsche Inserate vor einer Anzahlung besser verstehen">Razumite nemački oglas pre uplate kapare</h2>
   <p data-sr="Nalepite tekst oglasa. Besplatan pregled poznatih trgovačkih formulacija, bez prijave i bez slanja vašeg teksta na server." data-de="Fügen Sie den Inserattext ein. Kostenloser Hinweischeck, ohne Konto und ohne Übertragung an einen Server.">Nalepite tekst oglasa. Besplatan pregled poznatih trgovačkih formulacija, bez prijave i bez slanja vašeg teksta na server.</p>
   <label for="dn-ad-text" data-sr="Tekst nemačkog oglasa" data-de="Text der deutschen Anzeige">Tekst nemačkog oglasa</label>
   <textarea id="dn-ad-text" maxlength="15000" rows="7" placeholder="z. B. Im Kundenauftrag, scheckheftgepflegt, unfallfrei ..."></textarea>
   <p class="dn-local-hint" data-sr="Link sa mobile.de ili AutoScout24 ne preuzimamo automatski. Kopirajte tekst oglasa." data-de="Links von mobile.de oder AutoScout24 werden nicht automatisch ausgelesen. Bitte Text einfügen.">Link sa mobile.de ili AutoScout24 ne preuzimamo automatski. Kopirajte tekst oglasa.</p>
   <button id="dn-ad-analyze" type="button" class="btn gold" data-sr="Pregledaj formulacije" data-de="Formulierungen prüfen">Pregledaj formulacije</button>
   <div id="dn-ad-flags" aria-live="polite"></div>
  </div>
  <aside class="dn-seller-message">
   <span class="kicker">DEUTSCH / KONTAKT</span>
   <h3 data-sr="5 pitanja za prodavca" data-de="5 Fragen an den Verkäufer">5 pitanja za prodavca</h3>
   <ol id="dn-questions"></ol>
   <label for="dn-message-type" data-sr="Šta želite da dodate poruci?" data-de="Welches Thema möchten Sie ergänzen?">Šta želite da dodate poruci?</label>
   <select id="dn-message-type">
    <option value="vin">VIN / FIN</option>
    <option value="video">Video-Besichtigung</option>
    <option value="price">Preisverhandlung</option>
   </select>
   <textarea id="dn-message-output" rows="8" readonly aria-label="Nemačka poruka za prodavca"></textarea>
   <button type="button" id="dn-copy-message" class="btn primary" data-sr="Kopiraj nemačku poruku" data-de="Deutsche Nachricht kopieren">Kopiraj nemačku poruku</button>
   <p class="dn-local-hint" data-sr="Poruka se ne šalje automatski. Pregledajte je pre slanja." data-de="Keine automatische Versendung. Bitte vor dem Senden prüfen.">Poruka se ne šalje automatski. Pregledajte je pre slanja.</p>
   <a href="/contact.html?service=vehicle" class="btn ghost" data-sr="Zatraži proveru na terenu ↗" data-de="Fahrzeugprüfung anfragen ↗">Zatraži proveru na terenu ↗</a>
  </aside>
 </div>`;
 main.append(wrap);
 const style=document.createElement('style');style.textContent=`
  .dn-phrases{background:#f4f5f6;color:#18232e}
  .dn-listing-wrap{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,.8fr);gap:24px}
  .dn-listing-main,.dn-seller-message{padding:clamp(18px,3vw,28px);border-radius:12px;background:#fff;min-width:0}
  .dn-phrases h2,.dn-phrases h3{margin:10px 0}
  .dn-phrases label{display:block;font-weight:700;margin:14px 0 6px}
  .dn-phrases textarea,.dn-phrases select{width:100%;max-width:100%;padding:12px;border-radius:7px;border:1px solid #b8c3ce;box-sizing:border-box;font-size:1rem;min-height:44px}
  .dn-local-hint{font-size:.85rem;color:#53606d}
  .dn-ad-flag{padding:12px;border-bottom:1px solid #dfe5e8}
  .dn-ad-flag strong{display:block}
  .dn-ad-flag p{margin:5px 0}
  .dn-phrases button{margin:10px 0}
  .dn-seller-message ol{padding-left:20px}
  .dn-seller-message li{margin:0 0 12px;line-height:1.45}
  .dn-seller-message .btn{display:block;text-align:center}
  @media(max-width:760px){.dn-listing-wrap{grid-template-columns:1fr}}
 `;document.head.append(style);
 const by=id=>document.getElementById(id);
 const qlist=by('dn-questions');questions.forEach(q=>{const li=document.createElement('li');li.textContent=q;qlist.append(li);});
 const msgBy={
  vin:questions[0],
  video:'Wäre eine kurze Video-Besichtigung des Fahrzeugs nach vorheriger Terminabsprache möglich?',
  price:'Ist beim angegebenen Preis noch etwas Verhandlungsspielraum vorhanden?'
 };
 function msg(){
  by('dn-message-output').value='Guten Tag,\n\nich interessiere mich für das angebotene Fahrzeug. '+msgBy[by('dn-message-type').value]+'\n\nVielen Dank für Ihre Rückmeldung.\n\nMit freundlichen Grüßen';
 }
 by('dn-message-type').addEventListener('change',msg);
 by('dn-ad-analyze').addEventListener('click',()=>{
  const text=by('dn-ad-text').value;
  const matches=phrases.filter(x=>x.re.test(text));
  const output=by('dn-ad-flags');output.replaceChildren();
  const title=document.createElement('h3');
  title.textContent=t('Pronađene formulacije: '+matches.length,'Gefundene Formulierungen: '+matches.length);output.append(title);
  if(!text.trim()){const p=document.createElement('p');p.textContent=t('Unesite tekst oglasa za pregled.','Bitte geben Sie den Inserattext ein.');output.append(p);return;}
  if(!matches.length){const p=document.createElement('p');p.textContent=t('Nisu nađene poznate fraze. To ne znači da je vozilo provereno ili bez rizika.','Keine bekannten Begriffe erkannt. Dies bestätigt weder das Fahrzeug noch Risikofreiheit.');output.append(p);}
  for(const flag of matches){const el=document.createElement('div');el.className='dn-ad-flag';const strong=document.createElement('strong'),meaning=document.createElement('p'),note=document.createElement('p');strong.textContent=flag.term;meaning.textContent=t(flag.sr,flag.de);note.textContent=t(flag.risk,flag.riskDe);el.append(strong,meaning,note);output.append(el);}
  const caution=document.createElement('p');caution.className='dn-local-hint';caution.textContent=t('Ovo je automatska pretraga poznatih izraza, ne AI ili nezavisna provera vozila.','Regelbasierte Wortsuche, keine KI- oder unabhängige Fahrzeugprüfung.');output.append(caution);
 });
 const copy=async()=>{const v=by('dn-message-output').value;try{await navigator.clipboard.writeText(v);by('dn-copy-message').textContent=t('Kopirano ✓','Kopiert ✓');}catch{by('dn-message-output').select();document.execCommand('copy');}};
 by('dn-copy-message').addEventListener('click',copy);
 function localize(){wrap.querySelectorAll('[data-sr][data-de]').forEach(n=>{n.textContent=n.getAttribute(document.documentElement.lang==='de'?'data-de':'data-sr')||'';});msg();}
 document.addEventListener('danini:language-changed',localize);
 localize();
})();
/* AutoDanini import calculator v2 — browser-only, no tracking and no server costs. */
(() => {
  'use strict';
  const host=document.querySelector('body[data-page="import"] .calc');
  if(!host)return;
  const old=host.innerHTML;
  const layout=`
    <section class="dn-calc" aria-label="Kalkulator troškova uvoza vozila">
      <div class="dn-calc-input">
        <p class="dn-kicker" data-sr="BESPLATNO · BEZ NALOGA" data-de="KOSTENLOS · OHNE KONTO">BESPLATNO · BEZ NALOGA</p>
        <h2 data-sr="Koliko stvarno košta uvoz auta?" data-de="Was kostet der Fahrzeugimport?">Koliko stvarno košta uvoz auta?</h2>
        <p data-sr="Uporedite carinu, porez i ostale procenjene troškove pre nego što krenete u kupovinu." data-de="Vergleichen Sie Zoll, Steuern und Nebenkosten, bevor Sie ein Fahrzeug kaufen.">Uporedite carinu, porez i ostale procenjene troškove pre nego što krenete u kupovinu.</p>
        <label data-sr="Država odredišta" data-de="Zielland">Država odredišta</label>
        <select id="dn-country"><option value="rs">Srbija</option><option value="ba">Bosna i Hercegovina</option><option value="hr">Hrvatska</option></select>
        <div class="dn-cols"><div><label for="dn-price" data-sr="Cena vozila (€)" data-de="Fahrzeugpreis (€)">Cena vozila (€)</label><input type="number" id="dn-price" min="1" max="1000000" step=".01" value="10000"></div>
          <div><label for="dn-freight" data-sr="Prevoz i izvoz (€)" data-de="Transport und Export (€)">Prevoz i izvoz (€)</label><input type="number" id="dn-freight" min="0" max="100000" step=".01" value="700"></div></div>
        <label for="dn-customs" data-sr="Carinska vrednost, uključujući pripadajući prevoz (€)" data-de="Zollwert inkl. anrechenbarem Transport (€)">Carinska vrednost, uključujući pripadajući prevoz (€)</label>
        <input type="number" id="dn-customs" min="1" max="1000000" step=".01" value="10700">
        <p class="dn-note" data-sr="Carinska vrednost nije nužno jednaka ceni iz oglasa. Uneta vrednost koristi se kao poreska osnovica; ne dodaje se ponovo ukupnom trošku." data-de="Der Zollwert kann vom Inseratpreis abweichen. Er ist nur die Steuerbasis, kein zusätzlicher Kaufpreis.">Carinska vrednost nije nužno jednaka ceni iz oglasa. Uneta vrednost koristi se kao poreska osnovica; ne dodaje se ponovo ukupnom trošku.</p>
        <div id="dn-origin-wrap"><label for="dn-origin" data-sr="Dokaz o preferencijalnom poreklu" data-de="Nachweis des präferenziellen Ursprungs">Dokaz o preferencijalnom poreklu</label>
        <select id="dn-origin"><option value="unknown">Nije potvrđen (oprezniji scenario)</option><option value="yes">Postoji odgovarajući prihvaćen dokaz (0%)</option><option value="no">Bez prihvaćenog dokaza</option></select></div>
        <div id="dn-hr-wrap" hidden><label for="dn-ppmv" data-sr="PPMV prema zvaničnom obračunu (€)" data-de="PPMV laut amtlicher Berechnung (€)">PPMV prema zvaničnom obračunu (€)</label>
        <input type="number" id="dn-ppmv" min="0" max="200000" step=".01" placeholder="Obavezan unos kada je poznat">
        <label for="dn-weight" data-sr="Odgovarajuća masa za naknadu (kg)" data-de="Anrechenbare Masse (kg)">Odgovarajuća masa za naknadu (kg)</label>
        <input type="number" id="dn-weight" min="0" max="10000" step="1" value="1500"></div>
        <div class="dn-cols"><div><label for="dn-fees" data-sr="Lokalne takse i usluge (€)" data-de="Lokale Gebühren und Dienste (€)">Lokalne takse i usluge (€)</label><input type="number" id="dn-fees" min="0" max="100000" step=".01" value="230"></div>
        <div><label for="dn-vat-base-extra" data-sr="Drugi troškovi u PDV osnovici (€)" data-de="Weitere Kosten in MwSt.-Basis (€)">Drugi troškovi u PDV osnovici (€)</label><input type="number" id="dn-vat-base-extra" min="0" max="100000" step=".01" value="0"></div></div>
        <div><label for="dn-other" data-sr="Ostali troškovi (€)" data-de="Sonstige Kosten (€)">Ostali troškovi (€)</label><input type="number" id="dn-other" min="0" max="100000" step=".01" value="0"></div>
        <p id="dn-error" role="alert" class="dn-error" hidden></p>
        <button class="btn primary" id="dn-calculate" type="button" data-sr="Izračunaj ukupno" data-de="Gesamtkosten berechnen">Izračunaj ukupno</button>
      </div>
      <aside class="dn-calc-result" aria-live="polite" aria-atomic="true">
        <span class="dn-kicker" data-sr="VAŠA OKVIRNA PROCENA" data-de="IHRE UNVERBINDLICHE SCHÄTZUNG">VAŠA OKVIRNA PROCENA</span>
        <strong id="dn-total">—</strong>
        <dl id="dn-breakdown"></dl>
        <p id="dn-warning" class="dn-note"></p>
        <button id="dn-copy" type="button" class="btn ghost" data-sr="Kopiraj obračun" data-de="Berechnung kopieren">Kopiraj obračun</button>
        <a href="/contact.html?service=vehicle" class="btn gold" data-sr="Zatražite proveru vozila ↗" data-de="Fahrzeugprüfung anfragen ↗">Zatražite proveru vozila ↗</a>
        <a href="/ai-advisor.html" class="dn-soft-link" data-sr="Besplatan dosije i pitanja za prodavca ↗" data-de="Kostenlose Checkliste und Verkäuferfragen ↗">Besplatan dosije i pitanja za prodavca ↗</a>
        <p class="dn-note" data-sr="Informativna procena, ne službeni obračun. Carina i porezi zavise od dokumentacije, konkretne vrste vozila i odluke nadležnih organa. Nema automatskog preuzimanja oglasa." data-de="Unverbindliche Schätzung, kein amtlicher Bescheid. Zoll und Steuern hängen von Nachweisen und Fahrzeugart ab. Kein automatischer Inseratsabruf.">Informativna procena, ne službeni obračun. Carina i porezi zavise od dokumentacije, konkretne vrste vozila i odluke nadležnih organa. Nema automatskog preuzimanja oglasa.</p>
      </aside>
    </section>`;
  host.innerHTML=layout;
  const css=document.createElement('style');
  css.textContent=`
   .dn-calc{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,.8fr);gap:24px;width:100%;align-items:start}
   .dn-calc-input,.dn-calc-result{min-width:0;padding:clamp(18px,3vw,32px);border-radius:14px;background:#fff;color:#18232e;box-shadow:0 10px 36px rgba(9,20,35,.08)}
   .dn-calc-result{background:#14202d;color:#fff;position:sticky;top:24px}
   .dn-calc h2{font-size:clamp(1.45rem,3vw,2.2rem);line-height:1.2;margin:9px 0}
   .dn-calc p{line-height:1.5}
   .dn-calc label{display:block;font-size:.91rem;font-weight:700;margin:14px 0 7px}
   .dn-calc input,.dn-calc select{display:block;width:100%;max-width:100%;padding:12px 13px;border:1px solid #b9c2cd;border-radius:8px;background:#fff;color:#172330;font-size:1rem;box-sizing:border-box;min-height:44px}
   .dn-cols{display:grid;grid-template-columns:1fr 1fr;gap:12px}
   .dn-kicker{font-weight:800;color:#a78037;font-size:.78rem;letter-spacing:.07em}
   .dn-calc-result .dn-kicker{color:#e2c990}
   .dn-calc-result strong{display:block;font-size:clamp(2rem,5vw,3rem);font-variant-numeric:tabular-nums;margin:12px 0}
   .dn-calc-result dl{margin:8px 0 18px}
   .dn-calc-result dl div{display:flex;justify-content:space-between;gap:12px;border-bottom:1px solid #ffffff24;padding:9px 0}
   .dn-calc-result dd{margin:0;font-weight:700;text-align:right;white-space:nowrap}
   .dn-calc-result dt{font-size:.94rem}
   .dn-note{font-size:.83rem;opacity:.83}
   .dn-error{color:#9c1f23;font-weight:700}
   .dn-calc-result .btn{display:block;text-align:center;margin:11px 0}
   .dn-soft-link{display:block;text-align:center;color:#f7d18d;margin:14px 0}
   [hidden]{display:none!important}
   @media(max-width:760px){.dn-calc{grid-template-columns:1fr}.dn-calc-result{position:static}.dn-cols{grid-template-columns:1fr}}
  `;
  document.head.append(css);
  const find=id=>document.getElementById(id);
  const amount=id=>{const s=find(id).value.trim();if(!s)return NaN;return Number(s)};
  const euro=x=>new Intl.NumberFormat(document.documentElement.lang==='de'?'de-DE':'sr-RS',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(x);
  const labels={sr:['Cena vozila','Prevoz i izvoz','Carina','PDV','PPMV','Naknada za otpadna vozila','Lokalne takse / usluge','Ostalo'],
    de:['Fahrzeugpreis','Transport und Export','Zoll','Einfuhrumsatzsteuer','PPMV','Altfahrzeuggebühr','Lokale Gebühren / Dienste','Sonstiges']};
  let latest='';
  let lastCountry='rs';
  const calc=()=>{
    const c=find('dn-country').value;
    find('dn-origin-wrap').hidden=c==='hr';
    find('dn-hr-wrap').hidden=c!=='hr';
    if(c!==lastCountry){find('dn-fees').value=c==='hr'?'85':'230';lastCountry=c;}
    const p=amount('dn-price'),t=amount('dn-freight'),cv=amount('dn-customs'),fees=amount('dn-fees'),other=amount('dn-other'),add=amount('dn-vat-base-extra');
    const hr=c==='hr',weight=amount('dn-weight'),ppmv=amount('dn-ppmv');
    const invalid=[p,t,cv,fees,other,add].some(n=>!Number.isFinite(n)||n<0)||p<=0||cv<=0||(hr&&(!Number.isFinite(weight)||weight<0||weight>10000));
    const err=find('dn-error');
    if(invalid){err.hidden=false;err.textContent='Unesite ispravne nenegativne iznose i cenu vozila.';find('dn-total').textContent='—';find('dn-breakdown').replaceChildren();latest='';return;}
    err.hidden=true;
    const preferential=find('dn-origin').value==='yes';
    const rate=hr?0:preferential?0:c==='rs'?.125:.15;
    const duty=cv*rate;
    const vat=hr?0:(cv+duty+add)*(c==='rs'?.2:.17);
    const waste=hr?weight*.08:0;
    const pp=hr?(Number.isFinite(ppmv)&&ppmv>=0?ppmv:0):0;
    const total=p+t+duty+vat+fees+other+waste+pp;
    const raw=[p,t,duty,vat,pp,waste,fees,other];
    const language=document.documentElement.lang==='de'?'de':'sr';
    const breakdown=find('dn-breakdown');
    breakdown.replaceChildren();
    const lines=[];
    labels[language].forEach((label,i)=>{if(raw[i]===0&&i!==2)return;const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=euro(raw[i]);row.append(dt,dd);breakdown.append(row);lines.push(label+': '+euro(raw[i]));});
    find('dn-total').textContent=euro(total);
    const warning=hr&&!Number.isFinite(ppmv)?'PPMV nije unet: ukupna procena je nepotpuna. Proverite službeni PPMV kalkulator.':!hr&&!preferential?'Bez potvrđenog dokaza o preferencijalnom poreklu prikazana je puna orijentaciona stopa carine.':'Procena ne potvrđuje pravo na carinsku olakšicu.';
    find('dn-warning').textContent=warning;
    latest=['AutoDanini — informativni uvozni troškovi',c==='rs'?'Srbija':c==='ba'?'BiH':'Hrvatska',...lines,'UKUPNO: '+euro(total),warning,'https://daninihub.com/import.html'].join('\n');
  };
  find('dn-calculate').addEventListener('click',calc);
  host.querySelectorAll('input,select').forEach(el=>el.addEventListener('change',calc));
  find('dn-copy').addEventListener('click',async()=>{if(!latest)return;try{await navigator.clipboard.writeText(latest);find('dn-copy').textContent='Kopirano ✓';}catch{const a=document.createElement('textarea');a.value=latest;document.body.append(a);a.select();document.execCommand('copy');a.remove();}});
  document.addEventListener('danini:language-changed',calc);
  calc();
  void old;
})();
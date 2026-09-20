'use strict';

const { getModelDna } = require('./importos-model-dna');

const SOURCES = {
  rsCustoms:{title:'Uprava carina Srbije – uvoz polovnih vozila',url:'https://www.carina.rs/putnici/pitanja-i-odgovori/uvoz-polovnih-vozila.html',verifiedAt:'2026-09-20'},
  rsOrigin:{title:'Uprava carina Srbije – sporazumi / poreklo',url:'https://www.carina.rs/putnici/uvoz-motornih-vozila/sporazumi.html',verifiedAt:'2026-09-20'},
  rsOldtimer:{title:'ABS – vozila od istorijskog značaja',url:'https://www.abs.gov.rs/rsl/vozila_od_istorijskog_znacaja',verifiedAt:'2026-09-20'},
  deExport:{title:'Deutscher Zoll – Ausfuhr von Kraftfahrzeugen',url:'https://www.zoll.de/DE/Privatpersonen/Reisen/Reisen-nach-Deutschland-aus-einem-nicht-eu-Staat/Zoll-und-Steuern/Kauf-von-Kraftfahrzeugen/kauf-von-kraftfahrzeugen.html',verifiedAt:'2026-09-20'},
  chExport:{title:'BAZG – Vehicle Export from Switzerland',url:'https://www.bazg.admin.ch/en/export-vehicles-switzerland',verifiedAt:'2026-09-20'},
  mobileSecurity:{title:'mobile.de – Sicherheitshinweise',url:'https://www.mobile.de/service/securityAdvice',verifiedAt:'2026-09-20'}
};

function n(value,fallback=0){ const x=Number(value); return Number.isFinite(x)?x:fallback; }
function money(value){ return Math.round(n(value)*100)/100; }
function inferHistoric(year,historicClaim){ return Boolean(historicClaim) || (n(year)>0 && 2026-n(year)>=30); }

function importability(input){
  const historic=inferHistoric(input.year,input.historicClaim);
  const euro=n(input.euroClass);
  const issues=[];
  let status='CHECK';

  if(historic){
    status='HISTORIC_REVIEW';
    issues.push('30+ godina može otvoriti oldtimer/historic put, ali status zavisi od originalnosti, voznog stanja i ABS postupka.');
  } else if(euro>=3){
    status='PASS_BASELINE';
    issues.push('Uneta emisijska klasa zadovoljava osnovni Euro 3 prag; dokumentacija i identifikacija i dalje moraju biti proverene.');
  } else if(euro>0 && euro<3){
    status='STOP';
    issues.push('Standardni uvoz je problematičan jer je uneta klasa ispod Euro 3; proveriti historic režim ako vozilo ispunjava uslove.');
  } else {
    issues.push('Euro norma nije potvrđena. Ne kupovati pre dokumentarne provere.');
  }

  if(input.nonEuSpec) issues.push('NON-EU spec: potreban poseban homologacioni/prepravni pregled pre odluke o kupovini.');
  if(!input.registrationDoc) issues.push('Nedostaje ili nije potvrđena strana saobraćajna dokumentacija.');
  if(!input.ownershipDoc) issues.push('Nedostaje ili nije potvrđen račun/kupoprodajni ugovor.');
  return {status,historic,issues,source:SOURCES.rsCustoms};
}

function originScenarios(input,customsBasis){
  const proof=String(input.originProof||'unknown');
  const zero={name:'preferential',dutyRate:0};
  const full={name:'standard',dutyRate:0.125};
  const scenarios=proof==='verified'?[zero]:proof==='missing'?[full]:[zero,full];

  return scenarios.map(s=>{
    const duty=money(customsBasis*s.dutyRate);
    const vat=money((customsBasis+duty)*0.20);
    return {...s,duty,vat,customsAndVat:money(duty+vat)};
  });
}

function fraudShield(input){
  let score=0;
  const flags=[];
  const add=(points,code,text)=>{ score+=points; flags.push({code,text,points}); };

  if(input.prepaymentRequested) add(35,'PREPAYMENT','Prodavac traži uplatu unapred; veliki oglasnici eksplicitno upozoravaju na ovaj obrazac prevare.');
  if(input.thirdPartyAccount) add(25,'THIRD_PARTY_PAYMENT','Uplata ide na račun trećeg lica.');
  if(!input.vinProvided) add(15,'NO_VIN','VIN nije dostavljen pre kapare/provere.');
  if(!input.registrationDoc) add(15,'NO_REG_DOC','Nije potvrđen original registracionog dokumenta.');
  if(!input.ownershipDoc) add(15,'NO_OWNERSHIP_DOC','Nije potvrđen račun/kupoprodajni ugovor.');
  if(input.priceAnomaly) add(15,'PRICE_ANOMALY','Cena je neuobičajeno niska u odnosu na porediva vozila.');
  if(input.sellerMismatch) add(25,'SELLER_MISMATCH','Prodavac i lice/firma u dokumentima se ne poklapaju.');
  if(input.originProof==='unknown') add(10,'ORIGIN_UNKNOWN','Preferencijalno poreklo nije potvrđeno.');
  if(input.originProof==='promised') add(15,'ORIGIN_PROMISED','Dokaz o poreklu je samo obećan nakon kupovine.');

  score=Math.min(100,score);
  const verdict=score>=60?'STOP':score>=30?'HIGH_CHECK':score>=10?'VERIFY':'LOW_SIGNAL';
  return {score,verdict,flags,source:SOURCES.mobileSecurity};
}

function evaluateImport(input={}){
  const country=String(input.sourceCountry||'DE').toUpperCase();
  const currency=String(input.currency||(country==='CH'?'CHF':'EUR')).toUpperCase();
  const fx=currency==='EUR'?1:n(input.fxToEur,0);
  const purchase=n(input.purchasePrice);
  const purchaseEur=money(purchase*fx);
  const transport=money(n(input.transportToSerbia));
  const exportCosts=money(n(input.exportCosts));
  const inspection=money(n(input.inspectionCost));
  const customsBasisOverride=n(input.customsBasisOverride);
  const customsBasis=money(customsBasisOverride>0?customsBasisOverride:purchaseEur+transport);
  const localCosts=money(n(input.brokerCost)+n(input.complianceCost)+n(input.registrationCost)+n(input.initialService)+n(input.otherCosts));
  const imp=importability(input);
  const scenarios=originScenarios(input,customsBasis).map(s=>{
    const total=money(purchaseEur+transport+exportCosts+inspection+s.customsAndVat+localCosts);
    const market=n(input.serbiaMarketValue);
    const grossSpread=market>0?money(market-total):null;
    const marginPct=market>0?money((grossSpread/market)*100):null;
    return {...s,total,serbiaMarketValue:market||null,grossSpread,marginPct};
  });
  const fraud=fraudShield(input);
  const dna=getModelDna(input.modelDnaKey);
  const best=scenarios.reduce((a,b)=>a.total<=b.total?a:b);
  const worst=scenarios.reduce((a,b)=>a.total>=b.total?a:b);
  const decision=imp.status==='STOP'||fraud.verdict==='STOP'
    ?'DO_NOT_BUY_YET'
    :(String(input.originProof||'unknown')==='unknown'||String(input.originProof||'unknown')==='promised'||fraud.score>=30||imp.status==='CHECK')
      ?'VERIFY_BEFORE_PAYMENT'
      :'CALCULATED_CANDIDATE';

  const checklists={
    beforePayment:[
      'VIN + identitet prodavca + vlasništvo moraju biti međusobno konzistentni.',
      country==='CH'?'Od švajcarskog izvoznika tražiti dokaz o poreklu pre izvoza ako se cilja preferencijalna stopa.':'Pre kupovine proveriti da li postoji validan EUR.1 / odgovarajuća izjava o poreklu.',
      'Potvrditi poreski režim prodaje: bruto/neto/differenzbesteuerung ili privatna prodaja.',
      'Ne tretirati obećani povrat PDV-a kao gotov novac bez pisanih uslova i dokaza izvoza.',
      'Ne plaćati unapred nepoznatom prodavcu samo zato što je oglas na velikom portalu.'
    ],
    diy:[
      'Pre kupovine zaključati identitet vozila, vlasništvo, VIN, tehničke dokumente i poreski režim.',
      country==='DE'?'Pripremiti nemački izvozni postupak; za tipično vozilo iznad 1.000 € / 1.000 kg računati na elektronsku izvoznu deklaraciju.':'Pripremiti švajcarsku izvoznu deklaraciju, Fahrzeugausweis i dokaz o poreklu ako se koristi preferencija.',
      'Izabrati vožnju sa izvoznim tablicama ili profesionalni transport i dokumentovati trošak do srpske granice.',
      'Na ulasku u Srbiju prijaviti vozilo i sprovesti redovan carinski postupak.',
      'Završiti tehničko/ABS usaglašavanje, registraciju i početni servis pre realnog obračuna ukupnog troška.'
    ],
    broker:[
      'Tražiti stavkovnu ponudu: transport, izvoz, špedicija, terminal, ABS/homologacija, registracija i šta nije uključeno.',
      'Ne prihvatati “sve komplet” cenu bez pisanog breakdown-a i odgovornosti za dokumenta.',
      'Uporediti najmanje dve ponude po istoj specifikaciji vozila i istom dokumentacionom scenariju.'
    ]
  };

  return {
    product:'Danini ImportOS',
    version:'0.1-mvp',
    decision,
    route:country+'→RS',
    purchase:{currency,purchasePrice:purchase,fxToEur:fx,purchaseEur},
    customsBasis,
    importability:imp,
    originProof:String(input.originProof||'unknown'),
    scenarios,
    corridor:{best:best.total,worst:worst.total,delta:money(worst.total-best.total)},
    fraud,
    modelDna:dna,
    checklists,
    sources:Object.values(SOURCES)
  };
}

module.exports={SOURCES,evaluateImport,importability,fraudShield,originScenarios};

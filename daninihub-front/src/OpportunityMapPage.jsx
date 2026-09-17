import './OpportunityMapPage.css'

const copy = {
  de: {
    eyebrow:'DANINIHUB · DIGITALER ARBEITSPLAN', title:'AI Opportunity Map', lead:'Aus einer realen Ausgangslage wird ein kleiner, überprüfbarer Markttest – statt einer weiteren Liste von Geschäftsideen.',
    price:'Einführungspreis · 19 €', note:'Ein zweisprachiges PDF-Arbeitsbuch (DE/SR), 13 Seiten, sofort nach dem Kauf als Download.',
    cta:'Kauflink anfordern', check:'Kostenlosen Opportunity Check starten',
    includes:'Was enthalten ist', items:['Inventar Ihrer vorhandenen Werte und Grenzen','Problem, Zielgruppe und heutige Ersatzlösung','Skala für echte Nachfragebelege','Bewertung mehrerer Richtungen','Plan für den ersten Markttest','30-Tage-Umsetzungsplan','AI-Fragen für blinde Flecken','Einseitige Opportunity Map für die Entscheidung'],
    fit:'Für wen es passt', fitText:'Für Menschen, die Wissen, Erfahrung, Kontakte, Zeit, eine Fläche, eine bestehende Website oder eine konkrete Idee besitzen, aber den kleinsten realistischen Weg zum Markt noch nicht kennen.',
    boundary:'Kein Einkommensversprechen', boundaryText:'Das Workbook ist ein Arbeits- und Lernmaterial. Es ersetzt keine Rechts-, Steuer-, Finanz-, Investitions- oder andere Fachberatung und garantiert keinen Umsatz.',
    process:'So nutzen Sie es', steps:[['01','Ausgangslage beschreiben'],['02','Annahmen von Fakten trennen'],['03','Kleinsten Markttest festlegen'],['04','Nach 30 Tagen: weiter, ändern oder stoppen']],
    buySubject:'AI Opportunity Map – Kauflink'
  },
  sr: {
    eyebrow:'DANINIHUB · DIGITALNI RADNI PLAN', title:'AI Opportunity Map', lead:'Od stvarne početne situacije do malog i proverljivog tržišnog testa – umesto još jedne liste poslovnih ideja.',
    price:'Početna cena · 19 €', note:'Dvojezična PDF radna sveska (SR/DE), 13 strana, preuzimanje odmah nakon kupovine.',
    cta:'Zatražite link za kupovinu', check:'Pokrenite besplatni Opportunity Check',
    includes:'Šta paket sadrži', items:['Inventar postojećih resursa i ograničenja','Problem, ciljnu grupu i sadašnje zamensko rešenje','Skalu stvarnih dokaza potražnje','Poređenje i ocenjivanje više pravaca','Plan prvog tržišnog testa','Plan realizacije za 30 dana','AI pitanja koja otkrivaju slepe tačke','Jednostranu Opportunity Map za konačnu odluku'],
    fit:'Kome je namenjen', fitText:'Ljudima koji već imaju znanje, iskustvo, kontakte, vreme, plac, postojeći sajt ili konkretnu ideju, ali još ne znaju najmanji realan put do tržišta.',
    boundary:'Bez obećanja zarade', boundaryText:'Workbook je radni i edukativni materijal. Ne zamenjuje pravni, poreski, finansijski, investicioni ili drugi stručni savet i ne garantuje prihod.',
    process:'Kako se koristi', steps:[['01','Opišite početno stanje'],['02','Odvojite činjenice od pretpostavki'],['03','Odredite najmanji tržišni test'],['04','Posle 30 dana: nastavite, promenite ili zaustavite']],
    buySubject:'AI Opportunity Map – link za kupovinu'
  }
}

export default function OpportunityMapPage({ lang }) {
  const t=copy[lang]
  const check=lang==='sr'?'/sr/opportunity-check':'/de/opportunity-check'
  const buy=`mailto:info@daninihub.com?subject=${encodeURIComponent(t.buySubject)}`
  return <main className="opmap">
    <section className="opmap-hero">
      <div><p className="kicker">{t.eyebrow}</p><h1>{t.title}</h1><p className="opmap-lead">{t.lead}</p><div className="opmap-price">{t.price}</div><p className="opmap-note">{t.note}</p><div className="opmap-actions"><a className="btn" href={buy}>{t.cta} →</a><a className="opmap-link" href={check}>{t.check}</a></div></div>
      <div className="opmap-cover"><small>HUMAN</small><b>+ AI</b><strong>+ TEST</strong><h2>AI Opportunity Map</h2><p>SR · DE</p></div>
    </section>
    <section className="opmap-grid"><article><h2>{t.includes}</h2><ul>{t.items.map(item=><li key={item}>{item}</li>)}</ul></article><article><h2>{t.fit}</h2><p>{t.fitText}</p><div className="opmap-boundary"><strong>{t.boundary}</strong><p>{t.boundaryText}</p></div></article></section>
    <section className="opmap-process"><h2>{t.process}</h2><div>{t.steps.map(([n,x])=><article key={n}><span>{n}</span><p>{x}</p></article>)}</div></section>
    <section className="opmap-final"><h2>{t.title}</h2><p>{t.price} · {t.note}</p><a className="btn" href={buy}>{t.cta} →</a></section>
  </main>
}

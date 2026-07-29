import './ProductSystemSection.css'

const copy={
  de:{
    kicker:'EIN SYSTEM · DREI KLARE EBENEN',
    title:'Eine Transportinformation. Zwei Unternehmen. Ein gemeinsamer Verantwortungsverlauf.',
    lead:'DaniniHub verbindet operative Qualifizierung, Unternehmenszugang und den konkreten Transportfall. Kein zusätzlicher TMS-Zwang und keine autonome KI-Disposition.',
    cards:[
      ['01','DispoLab','Praxisfälle und Dispo-Check für operatives Denken, Kommunikation, Dokumentation und Eskalation.','/de/dispolab','DispoLab öffnen'],
      ['02','Transport Network','Unternehmensprofile, Teammitglieder, Partner und alle zugänglichen Transport Rooms in einem Arbeitsbereich.','/de/transport-network-demo','Transport Network ansehen'],
      ['03','Transport Room','Status, ETA, Kommunikation, Dokumente, Incident, Freigaben und Übergabe für einen konkreten Transport.','/de/transport-room-demo?case=DH-TR-0001','Transport Room ansehen']
    ],
    primary:'Transport Network ansehen',secondary:'Dispo-Check starten'
  },
  sr:{
    kicker:'JEDAN SISTEM · TRI JASNA NIVOA',
    title:'Jedna transportna informacija. Dve kompanije. Jedan zajednički trag odgovornosti.',
    lead:'DaniniHub povezuje operativnu procenu, kompanijski pristup i konkretan transportni slučaj. Bez nametanja novog TMS-a i bez autonomne AI dispozicije.',
    cards:[
      ['01','DispoLab','Praktični slučajevi i Dispo-Check za operativno razmišljanje, komunikaciju, dokumentovanje i eskalaciju.','/sr/dispo-lab','Otvori DispoLab'],
      ['02','Transport Network','Profili firmi, članovi tima, partneri i sve dostupne transportne sobe u jednom radnom prostoru.','/sr/transportna-mreza-demo','Pogledaj Transport Network'],
      ['03','Transport Room','Status, ETA, komunikacija, dokumenti, incident, odobrenja i predaja za jedan konkretan transport.','/sr/transportna-soba-demo?case=DH-TR-0001','Pogledaj Transport Room']
    ],
    primary:'Pogledaj Transport Network',secondary:'Pokreni Dispo-Check'
  }
}

export default function ProductSystemSection({lang}){
  const t=copy[lang]
  const sr=lang==='sr'
  return <section className="product-system section" aria-labelledby="product-system-title">
    <p className="kicker">{t.kicker}</p>
    <div className="product-system-head">
      <h2 id="product-system-title">{t.title}</h2>
      <p>{t.lead}</p>
    </div>
    <div className="product-system-grid">
      {t.cards.map(([number,title,text,href,label])=><article key={title}>
        <span>{number}</span><h3>{title}</h3><p>{text}</p><a href={href}>{label} →</a>
      </article>)}
    </div>
    <div className="product-system-actions">
      <a className="btn" href={sr?'/sr/transportna-mreza-demo':'/de/transport-network-demo'}>{t.primary} →</a>
      <a className="product-system-secondary" href={sr?'/sr/dispo-lab/provera':'/de/dispolab/check'}>{t.secondary} →</a>
    </div>
  </section>
}

import { useState } from 'react'
import './KnowledgeVideoPage.css'

const videos = [
  {
    id: '1jEKzE64EaHneeMk219tF1WgbIkchINia',
    key: 'dispatchers',
    title: {
      de: 'Disponenten vs. Software',
      sr: 'Dispečeri vs. softver',
    },
    description: {
      de: 'Warum TMS, Telematik und KI operative Verantwortung nicht vollständig übernehmen – und wo menschliche Prüfung, Entscheidung und Übergabe weiterhin notwendig bleiben.',
      sr: 'Zašto TMS, telematika i AI ne preuzimaju potpuno operativnu odgovornost i gde su i dalje potrebni ljudska provera, odluka i predaja.',
    },
    context: {
      de: 'Passend zum Grundlagenartikel über TMS und Disposition.',
      sr: 'Dopuna osnovnom članku o TMS-u i dispoziciji.',
    },
  },
  {
    id: '1hR5qcUxPX4emg-_YokPLmWSDNMfQbP4F',
    key: 'balkan-dach',
    title: {
      de: 'DaniniHub Balkan–DACH',
      sr: 'DaniniHub Balkan–DACH',
    },
    description: {
      de: 'Der operative Informationsfluss zwischen DACH-Auftraggebern und Balkan-Frachtführern: Status, Kommunikation, Dokumente, Verantwortung und nachvollziehbare nächste Schritte.',
      sr: 'Operativni tok informacija između DACH naručilaca i balkanskih prevoznika: status, komunikacija, dokumenta, odgovornost i proverljiv sledeći korak.',
    },
    context: {
      de: 'Passend zu Fahrerkommunikation und grenzüberschreitender Zusammenarbeit.',
      sr: 'Dopuna članku o komunikaciji sa vozačima i prekograničnoj saradnji.',
    },
  },
]

const copy = {
  de: {
    eyebrow: 'PRAXIS & WISSEN · VIDEO',
    title: 'DaniniHub Video-Bibliothek',
    lead: 'Zwei kurze Praxisvideos über die Grenze zwischen Software und operativer Verantwortung sowie über die Zusammenarbeit auf Balkan–DACH-Relationen.',
    load: 'Video laden',
    disable: 'Video deaktivieren',
    external: 'In Google Drive öffnen',
    notice: 'Der Google-Drive-Player wird erst nach Ihrem Klick geladen. Dabei kann eine Verbindung zu Google hergestellt werden.',
    access: 'Falls der Player eine Anmeldung verlangt, muss die Freigabe des Drive-Videos auf „Jeder mit dem Link“ gesetzt werden.',
    back: 'Zurück zu Praxis & Wissen',
  },
  sr: {
    eyebrow: 'PRAKSA I ZNANJE · VIDEO',
    title: 'DaniniHub video biblioteka',
    lead: 'Dva kratka praktična videa o granici između softvera i operativne odgovornosti, kao i o saradnji na relacijama Balkan–DACH.',
    load: 'Učitaj video',
    disable: 'Isključi video',
    external: 'Otvori u Google Drive-u',
    notice: 'Google Drive plejer se učitava tek nakon klika. Tada se može uspostaviti veza sa Google servisima.',
    access: 'Ako plejer traži prijavu, deljenje Drive videa mora biti podešeno na „Svako ko ima link“.',
    back: 'Nazad na Praksu i znanje',
  },
}

function DriveVideo({ video, lang }) {
  const [enabled, setEnabled] = useState(false)
  const t = copy[lang]
  return <article className="kv-card">
    <div className="kv-copy">
      <span>VIDEO · DANINIHUB</span>
      <h2>{video.title[lang]}</h2>
      <p>{video.description[lang]}</p>
      <small>{video.context[lang]}</small>
    </div>
    <div className="kv-player-shell">
      <div className="kv-player">
        {enabled ? <iframe
          src={`https://drive.google.com/file/d/${video.id}/preview`}
          title={video.title[lang]}
          allow="autoplay; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        /> : <button type="button" onClick={() => setEnabled(true)} aria-label={`${t.load}: ${video.title[lang]}`}>
          <span aria-hidden="true">▶</span>
          <strong>{t.load}</strong>
        </button>}
      </div>
      <p className="kv-notice">{t.notice}</p>
      <div className="kv-actions">
        {enabled && <button type="button" onClick={() => setEnabled(false)}>{t.disable}</button>}
        <a href={`https://drive.google.com/file/d/${video.id}/view`} target="_blank" rel="noreferrer">{t.external} ↗</a>
      </div>
    </div>
  </article>
}

export default function KnowledgeVideoPage({ lang }) {
  const t = copy[lang]
  const back = lang === 'sr' ? '/sr/praksa-znanje' : '/de/praxis-wissen'
  return <main className="kv-page">
    <section className="kv-hero">
      <a href={back}>← {t.back}</a>
      <span>{t.eyebrow}</span>
      <h1>{t.title}</h1>
      <p>{t.lead}</p>
    </section>
    <section className="kv-list">
      {videos.map(video => <DriveVideo key={video.key} video={video} lang={lang}/>)}
    </section>
    <aside className="kv-access-note">{t.access}</aside>
  </main>
}

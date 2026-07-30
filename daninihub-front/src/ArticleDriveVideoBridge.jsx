import { useEffect } from 'react'

const DRIVE_VIDEOS = {
  de: {
    id: '1hR5qcUxPX4emg-_YokPLmWSDNMfQbP4F',
    title: 'DaniniHub Balkan–DACH',
  },
  sr: {
    id: '1jEKzE64EaHneeMk219tF1WgbIkchINia',
    title: 'Dispečeri vs. softver',
  },
}

export default function ArticleDriveVideoBridge() {
  useEffect(() => {
    const isTmsArticle = /warum-tms-disponenten-nicht-ersetzen|zasto-tms-ne-menja-disponente/.test(location.pathname)
    if (!isTmsArticle) return undefined

    const lang = location.pathname.startsWith('/sr') ? 'sr' : 'de'
    const video = DRIVE_VIDEOS[lang]

    const apply = () => {
      const iframe = document.querySelector('.article-video-viewport iframe')
      if (iframe && !iframe.src.includes(video.id)) {
        iframe.src = `https://drive.google.com/file/d/${video.id}/preview`
        iframe.title = video.title
        iframe.allow = 'autoplay; fullscreen'
      }

      const links = document.querySelectorAll('.video-privacy-note a[target="_blank"]')
      links.forEach(link => {
        link.href = `https://drive.google.com/file/d/${video.id}/view`
        link.textContent = lang === 'sr' ? 'Otvori video u Google Drive-u ↗' : 'Video in Google Drive öffnen ↗'
      })
    }

    apply()
    const observer = new MutationObserver(apply)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return null
}

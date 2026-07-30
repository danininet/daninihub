(() => {
  const replacements = new Map([
    ['FTMCWxUGcig', 'HXJWUm02UlY'],
    ['wGFtA53BirQ', 'iV4XA-h0S40'],
  ])

  function replaceUrl(value) {
    if (!value) return value
    let next = value
    for (const [oldId, newId] of replacements) next = next.replaceAll(oldId, newId)
    return next
  }

  function patch(root = document) {
    root.querySelectorAll?.('iframe[src], a[href]').forEach((element) => {
      const attribute = element.tagName === 'IFRAME' ? 'src' : 'href'
      const current = element.getAttribute(attribute)
      const next = replaceUrl(current)
      if (next && next !== current) element.setAttribute(attribute, next)
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => patch())
  } else {
    patch()
  }

  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) patch(node)
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true })
})()

'use strict'

const fs = require('fs')
const path = require('path')

const file = path.join(__dirname, '..', 'src', 'KnowledgeCenter.jsx')
let source = fs.readFileSync(file, 'utf8')

const replacements = [
  ["id: 'FTMCWxUGcig'", "id: 'HXJWUm02UlY'"],
  ["id: 'wGFtA53BirQ'", "id: 'iV4XA-h0S40'"],
]

for (const [from, to] of replacements) {
  if (source.includes(to)) continue
  if (!source.includes(from)) {
    throw new Error(`Expected video id not found: ${from}`)
  }
  source = source.replace(from, to)
}

fs.writeFileSync(file, source)
console.log('DaniniHub article YouTube IDs patched: DE=HXJWUm02UlY, SR=iV4XA-h0S40')

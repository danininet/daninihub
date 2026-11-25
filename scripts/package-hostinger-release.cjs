'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {buildSync} = require('esbuild');

const output = 'hostinger-release';
const excluded = new Set(['admin.html', 'auto/admin.html', 'nalog.html', 'auto/nalog.html', 'operator']);
fs.rmSync(output, {recursive: true, force: true});
fs.cpSync('dist', output, {
  recursive: true,
  filter(source) {
    return !excluded.has(path.relative('dist', source));
  },
});
buildSync({
  entryPoints: ['hostinger-preview.cjs'],
  outfile: path.join(output, 'hostinger-preview.cjs'),
  platform: 'node',
  target: 'node22',
  bundle: true,
});

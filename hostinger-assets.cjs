'use strict';
const fs = require('node:fs');
const path = require('node:path');

// Hostinger separates the Node release and public_html in its current layout.
// Never use cwd or an arbitrary request path to select the directory to serve.
function resolveAssets(root = __dirname) {
  for (const [layout, directory] of [
    ['dist', path.join(root, 'dist')],
    ['sibling-public-html', path.join(root, '..', 'public_html')],
  ]) {
    if (['de/index.html', 'sr/index.html'].every(file => fs.existsSync(path.join(directory, file)))) {
      return {directory, layout};
    }
  }
  return null;
}

function readRedirects(directory) {
  const file = path.join(directory, '_redirects');
  const routes = new Map();
  if (!fs.existsSync(file)) return routes;
  for (const line of fs.readFileSync(file, 'utf8').trim().split(/\r?\n/)) {
    if (!line || line.startsWith('#')) continue;
    const [from, to, status] = line.trim().split(/\s+/);
    if (!/^\/(?!\/)[^\s?#]*$/.test(from) || !/^\/(?!\/)[^\s]*$/.test(to) || status !== '301') {
      throw new Error('Invalid local redirect manifest');
    }
    routes.set(from, to);
  }
  return routes;
}

module.exports = {resolveAssets, readRedirects};

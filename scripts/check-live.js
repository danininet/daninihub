'use strict';

// Read-only production smoke check. Never creates a customer record.
const origin = (process.argv[2] || process.env.DANINI_PUBLIC_URL || 'https://daninihub.com').replace(/\/$/, '');
const marker = 'daninihub-sales-20260924';

async function check(path, predicate, label) {
  const response = await fetch(origin + path, { signal: AbortSignal.timeout(12000), headers: { 'Cache-Control': 'no-cache' } });
  const body = await response.text();
  if (!response.ok || !predicate(response, body)) throw new Error(`${label}: HTTP ${response.status}; očekivana aplikacija nije dostupna na ${origin + path}`);
  console.log(`OK ${label}: ${origin + path}`);
}

(async () => {
  await check('/health', (r, b) => {
    if (!r.headers.get('content-type')?.includes('application/json')) return false;
    const health = JSON.parse(b);
    if (health.deploymentMarker !== marker) return false;
    console.log(`Skladište: ${health.durableStore ? 'trajna baza podešena' : 'lokalni fajl — proveriti trajnost'}. Plaćanje: ${health.checkoutEnabled ? 'uključeno' : 'isključeno'}.`);
    return true;
  }, 'verzija servera');
  await check('/sr/upit', (r, b) => b.includes('id="service-form"') && b.includes('/api/importos/service-request'), 'srpska stranica za upit');
  await check('/sr/kalkulator', (r, b) => b.includes('id="quickcheck"'), 'kalkulator');
  await check('/api/importos/models', (r, b) => r.headers.get('content-type')?.includes('application/json') && JSON.parse(b).ok === true, 'API');
  console.log('Javna verzija i API su dostupni. Za puni rad još proveriti trajnu bazu, email i probni upit u administratorskom panelu.');
})().catch(error => { console.error('PROVERA NIJE PROŠLA:', error.message); process.exitCode = 1; });

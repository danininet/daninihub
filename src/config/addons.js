const ADDONS = Object.freeze({
  SP_100: {
    id: 'SP_100',
    label: 'Zusätzlicher Arbeitskapazität 100',
    publicName: 'Add-on Arbeitskapazität 100',
    systemPower: 100,
    currency: 'EUR',
    requiresMembership: false,
    visibility: 'public_checkout'
  },
  SP_500: {
    id: 'SP_500',
    label: 'Zusätzlicher Arbeitskapazität 500',
    publicName: 'Add-on Arbeitskapazität 500',
    systemPower: 500,
    currency: 'EUR',
    requiresMembership: false,
    visibility: 'public_checkout'
  },
  SP_1500: {
    id: 'SP_1500',
    label: 'Zusätzlicher Arbeitskapazität 1500',
    publicName: 'Add-on Arbeitskapazität 1500',
    systemPower: 1500,
    currency: 'EUR',
    requiresMembership: false,
    visibility: 'public_checkout'
  }
});

function getAddon(addonId) {
  return ADDONS[addonId] || null;
}

function listAddons() {
  return Object.values(ADDONS);
}

module.exports = { ADDONS, getAddon, listAddons };

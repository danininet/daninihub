const ADDONS = Object.freeze({
  SP_100: {
    id: 'SP_100',
    label: 'Arbeitskapazität 100',
    publicName: 'System Power 100',
    systemPower: 100,
    currency: 'EUR',
    requiresMembership: false,
    visibility: 'blocked_until_payment_stack_connected',
    sellable: false
  },
  SP_500: {
    id: 'SP_500',
    label: 'Arbeitskapazität 500',
    publicName: 'System Power 500',
    systemPower: 500,
    currency: 'EUR',
    requiresMembership: false,
    visibility: 'blocked_until_payment_stack_connected',
    sellable: false
  },
  SP_1500: {
    id: 'SP_1500',
    label: 'Arbeitskapazität 1500',
    publicName: 'System Power 1500',
    systemPower: 1500,
    currency: 'EUR',
    requiresMembership: false,
    visibility: 'blocked_until_payment_stack_connected',
    sellable: false
  }
});

function getAddon(addonId) {
  return ADDONS[addonId] || null;
}

function listAddons() {
  return Object.values(ADDONS);
}

module.exports = { ADDONS, getAddon, listAddons };

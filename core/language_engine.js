// ~/daninihub/core/language_engine.js
const fs = require('fs');

const getTranslation = (key, locale) => {
    const dict = {
        'de': { 'title': 'DaniniHub - Kognitive Infrastruktur', 'btn': 'Fit Check starten' },
        'sr': { 'title': 'DaniniHub - Kognitivna Infrastruktura', 'btn': 'Pokreni Fit Check' }
    };
    return dict[locale]?.[key] || dict['de'][key];
};

module.exports = { getTranslation };

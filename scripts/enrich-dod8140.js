/**
 * Enrich data/certs.json with DoD 8140 data from scripts/data/dod8140-lookup.json.
 * Run after parse-dod8140.js. Matches certs by normalized name; sets dod8140 and dodWorkRoleCodes.
 * Usage: node scripts/enrich-dod8140.js
 */

const fs = require('fs');
const path = require('path');

const certsPath = path.join(__dirname, '..', 'data', 'certs.json');
const lookupPath = path.join(__dirname, 'data', 'dod8140-lookup.json');

function normalize(name) {
  if (name == null || typeof name !== 'string') return '';
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/\+/g, ' ')
    .replace(/[\s\-]+/g, ' ');
}

function main() {
  const certs = JSON.parse(fs.readFileSync(certsPath, 'utf8'));
  let lookupList = [];
  if (fs.existsSync(lookupPath)) {
    lookupList = JSON.parse(fs.readFileSync(lookupPath, 'utf8'));
  } else {
    console.warn('No dod8140-lookup.json found. Run: npm run parse-dod8140 (after placing DoD 8140 xlsx in scripts/data/)');
  }

  const byNormalized = {};
  lookupList.forEach(function (entry) {
    const key = normalize(entry.certName || entry.name || '');
    if (!key) return;
    if (!byNormalized[key]) {
      byNormalized[key] = { dod8140: true, dodWorkRoleCodes: entry.dodWorkRoleCodes || [] };
    } else {
      const codes = byNormalized[key].dodWorkRoleCodes;
      (entry.dodWorkRoleCodes || []).forEach(function (c) {
        if (c && codes.indexOf(c) === -1) codes.push(c);
      });
    }
  });

  let matched = 0;
  certs.forEach(function (cert) {
    const key = normalize(cert.name);
    const hit = byNormalized[key] || byNormalized[key.replace(/^comptia\s+/i, '')] || byNormalized[key.replace(/\s+plus$/i, '+')];
    if (hit) {
      cert.dod8140 = true;
      cert.dodWorkRoleCodes = hit.dodWorkRoleCodes && hit.dodWorkRoleCodes.length ? hit.dodWorkRoleCodes : [];
      matched++;
    } else {
      cert.dod8140 = false;
      if (!cert.dodWorkRoleCodes) cert.dodWorkRoleCodes = [];
    }
  });

  fs.writeFileSync(certsPath, JSON.stringify(certs, null, 2), 'utf8');
  console.log('Enriched', certs.length, 'certs;', matched, 'matched DoD 8140. Wrote', certsPath);
}

main();

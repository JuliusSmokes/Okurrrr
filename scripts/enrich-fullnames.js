#!/usr/bin/env node
/**
 * Enrich certs.json with fullName, vendor, description, and updated costUsd/costNote
 * from the lookup table in scripts/data/enrichment-lookup.json.
 *
 * Usage: node scripts/enrich-fullnames.js
 */

const fs = require('fs');
const path = require('path');

const certsPath = path.join(__dirname, '..', 'data', 'certs.json');
const lookupPath = path.join(__dirname, 'data', 'enrichment-lookup.json');

const certs = JSON.parse(fs.readFileSync(certsPath, 'utf8'));
const lookup = JSON.parse(fs.readFileSync(lookupPath, 'utf8'));

let enriched = 0;
let missing = 0;

certs.forEach(cert => {
  const entry = lookup[cert.id];
  if (!entry) {
    missing++;
    console.warn('WARN: No enrichment data for', cert.id, cert.name);
    if (!cert.fullName) cert.fullName = cert.name;
    if (!cert.vendor) cert.vendor = '';
    if (!cert.description) cert.description = '';
    return;
  }

  if (entry.fullName) cert.fullName = entry.fullName;
  else cert.fullName = cert.name;

  if (entry.vendor) cert.vendor = entry.vendor;
  else cert.vendor = '';

  if (entry.description) cert.description = entry.description;
  else cert.description = '';

  if (entry.costUsd != null && cert.costUsd == null) {
    cert.costUsd = entry.costUsd;
    cert.costNote = entry.costNote || null;
  } else if (entry.costNote && cert.costUsd == null) {
    cert.costNote = entry.costNote;
  }

  enriched++;
});

fs.writeFileSync(certsPath, JSON.stringify(certs, null, 2) + '\n');

console.log(`Done. Enriched: ${enriched}, Missing lookup: ${missing}, Total: ${certs.length}`);

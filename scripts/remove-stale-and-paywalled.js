#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const RESOURCES_PATH = path.resolve(__dirname, '..', 'data', 'free-resources.json');

const removeUrls = [
  // 9 Paid Microsoft portals (require Azure/M365 subscription)
  'https://security.microsoft.com',
  'https://security.microsoft.com/securescore',
  'https://purview.microsoft.com/',
  'https://entra.microsoft.com',
  'https://intune.microsoft.com',
  'https://portal.azure.com/#blade/Microsoft_Azure_Security_Insights/WorkspaceSelectorBlade',
  'https://portal.azure.com/#blade/Microsoft_Azure_Security/SecurityMenuBlade/0',
  'https://security.microsoft.com/attacksimulator',
  'https://idpowertoys.merill.net/ca',

  // 6 Stale/unmaintained projects
  'https://github.com/clong/DetectionLab',           // Archived 2023
  'https://github.com/Cyb3rWard0g/HELK',             // Abandoned 2022
  'https://github.com/cobbr/Covenant',                // Dead since 2021
  'https://cuckoosandbox.org/',                       // Replaced by CAPEv2
  'https://www.arachni-scanner.com/',                 // Abandoned 2021
  'https://github.com/Fortiphyd/GRFICSv2',           // Stale since 2020

  // 2 Paywalled entries
  'https://www.iso.org/standard/27001',               // ISO paywall
  'https://www.gartner.com/en/articles/how-to-manage-cybersecurity-threats-not-episodes' // Gartner paywall
];

var normalizeUrl = function (u) { return u.replace(/\/+$/, '').toLowerCase(); };
var removeSet = new Set(removeUrls.map(normalizeUrl));

console.log('Loading resources...');
var resources = JSON.parse(fs.readFileSync(RESOURCES_PATH, 'utf8'));
console.log('  Before: ' + resources.length);

var removed = [];
resources = resources.filter(function (r) {
  var norm = normalizeUrl(r.url || '');
  if (removeSet.has(norm)) {
    removed.push(r.id + ' | ' + r.name);
    return false;
  }
  return true;
});

resources.forEach(function (r, i) { r.id = 'fr' + String(i + 1).padStart(3, '0'); });
fs.writeFileSync(RESOURCES_PATH, JSON.stringify(resources, null, 2) + '\n');

console.log('  After: ' + resources.length);
console.log('  Removed: ' + removed.length);
removed.forEach(function (r) { console.log('    - ' + r); });

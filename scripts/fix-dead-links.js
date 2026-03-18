#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const RESOURCES_PATH = path.resolve(__dirname, '..', 'data', 'free-resources.json');
const CERTS_PATH = path.resolve(__dirname, '..', 'data', 'certs.json');

// ── Free Resources URL Fixes ──

var resourceUrlFixes = {
  'fr008': {
    url: 'https://www.professormesser.com/get-n10-009-network-plus-certified/',
    name: 'Professor Messer CompTIA Network+ (N10-009)'
  },
  'fr049': {
    url: 'https://github.com/WithSecureLabs/damn-vulnerable-llm-agent',
    name: 'Damn Vulnerable LLM Agent'
  },
  'fr246': {
    url: 'https://sleuthkit.org/autopsy/docs/user-docs/latest/',
    name: 'Autopsy Digital Forensics'
  },
  'fr274': {
    url: 'https://trivy.dev/latest/',
    name: 'Trivy (Aqua Security)'
  },
  'fr335': {
    url: 'https://www.bettercap.org/',
    name: 'Bettercap'
  },
  'fr355': {
    url: 'https://csrc.nist.gov/pubs/sp/800/61/r3/final',
    name: 'NIST SP 800-61 Rev. 3 (IR Guide)',
    description: 'NIST Incident Response guide with updated recommendations for preparing, detecting, analyzing, containing, eradicating, and recovering from cybersecurity incidents.'
  },
  'fr365': {
    url: 'https://portswigger.net/burp/communitydownload',
    name: 'Burp Suite Community'
  },
  'fr393': {
    url: 'https://www.sans.org/posters/incident-handlers-handbook/',
    name: 'SANS Incident Handling Cheat Sheet'
  },
  'fr397': {
    url: 'https://www.sans.org/blog/sans-pen-test-cheat-sheet-powershell/',
    name: 'SANS PowerShell Cheat Sheet'
  },
  'fr396': {
    url: 'https://www.sans.org/posters/linux-essentials-cheat-sheet/',
    name: 'SANS Linux CLI Cheat Sheet'
  },
  'fr394': {
    url: 'https://www.sans.org/posters/tcp-ip-and-tcpdump/',
    name: 'SANS TCP/IP and tcpdump Cheat Sheet'
  },
  'fr400': {
    url: 'https://www.sans.org/posters/multicloud-cheat-sheet/',
    name: 'SANS Multicloud Security Cheat Sheet'
  },
  'fr427': {
    url: 'https://azure.microsoft.com/en-us/pricing/calculator/',
    name: 'Azure Pricing Calculator'
  },
  'fr503': {
    url: 'https://www.iriusrisk.com/community/',
    name: 'IriusRisk Community Edition'
  },
  'fr509': {
    url: 'https://csrc.nist.gov/pubs/sp/800/66/r2/final',
    name: 'NIST SP 800-66 Rev. 2: HIPAA Security Rule Implementation Guide'
  },
  'fr495': {
    url: 'https://csrc.nist.gov/pubs/sp/800/154/ipd',
    name: 'NIST SP 800-154: Guide to Data-Centric Threat Modeling (Draft)'
  },
  'fr510': {
    url: 'https://hitrustalliance.net/hitrust-framework/',
    name: 'HITRUST CSF Overview'
  },
  'fr519': {
    url: 'https://www.cisa.gov/resources-tools/resources/mitigation-guide-healthcare-and-public-health-hph-sector',
    name: 'CISA Healthcare and Public Health Mitigation Guide'
  },
  'fr521': {
    url: 'https://www.sans.org/mlp/healthcare-cybersecurity/',
    name: 'SANS Healthcare Cybersecurity Forum'
  },
  'fr531': {
    url: 'https://www.medcrypt.com/',
    name: 'MedCrypt Medical Device Security'
  }
};

// These free resource 404s should be removed (content permanently gone, no replacement)
var resourceIdsToRemove = [
  'fr229',  // Quantum Computing Playground (Google shut it down)
  'fr379',  // Python for Cybersecurity (SANS blog post removed; SANS SEC573 is paid)
  'fr524',  // OWASP Medical Device Security Guide (project inactive/removed)
];

// ── Cert URL Fixes ──

var certFixes = {};

// CSFA -- moved to CyberSecurity Institute
// (c26 in current numbering)
// CSBA -- being retired, remove

var certIdsToRemove = [
  // c274 -- CSBA (PeopleCert retiring Business Analysis certs)
];

// We'll find and fix these by fullName or url match instead of hardcoded IDs
// since cert IDs may shift after prior dedup

// ── Execute Fixes ──

console.log('=== FIXING FREE RESOURCES ===\n');

var resources = JSON.parse(fs.readFileSync(RESOURCES_PATH, 'utf8'));
var resBefore = resources.length;

// Apply URL fixes
var fixedCount = 0;
resources.forEach(function (r) {
  if (resourceUrlFixes[r.id]) {
    var fix = resourceUrlFixes[r.id];
    console.log('  FIX: ' + r.id + ' "' + r.name + '"');
    console.log('    Old URL: ' + r.url);
    r.url = fix.url;
    if (fix.name) r.name = fix.name;
    if (fix.description) r.description = fix.description;
    console.log('    New URL: ' + r.url);
    fixedCount++;
  }
});

// Remove dead entries
var removeSet = new Set(resourceIdsToRemove);
var removedNames = [];
resources = resources.filter(function (r) {
  if (removeSet.has(r.id)) {
    removedNames.push(r.id + ' "' + r.name + '"');
    return false;
  }
  return true;
});
removedNames.forEach(function (n) { console.log('  REMOVE: ' + n); });

// Re-index IDs
resources.forEach(function (r, i) {
  r.id = 'fr' + String(i + 1).padStart(3, '0');
});

fs.writeFileSync(RESOURCES_PATH, JSON.stringify(resources, null, 2) + '\n');
console.log('\n  URLs fixed: ' + fixedCount);
console.log('  Entries removed: ' + removedNames.length);
console.log('  Free resources: ' + resBefore + ' -> ' + resources.length);

// ── Fix Certs ──

console.log('\n=== FIXING CERTS ===\n');

var certs = JSON.parse(fs.readFileSync(CERTS_PATH, 'utf8'));
var certsBefore = certs.length;
var certFixCount = 0;

certs.forEach(function (c) {
  // Fix CSFA -- csiac.org -> cybersecurityforensicanalyst.com
  if (c.url && c.url.includes('csiac.org') && c.fullName && c.fullName.includes('Forensic Analyst')) {
    console.log('  FIX: ' + c.id + ' "' + c.name + '" (' + c.fullName + ')');
    console.log('    Old: ' + c.url);
    c.url = 'https://cybersecurityforensicanalyst.com/';
    console.log('    New: ' + c.url);
    certFixCount++;
  }

  // Fix CSBA -- softwarecertifications.org is dead, cert being retired
  if (c.url && c.url.includes('softwarecertifications.org/csba')) {
    console.log('  REMOVE: ' + c.id + ' "' + c.name + '" (' + c.fullName + ') -- cert being retired');
    c._remove = true;
    certFixCount++;
  }

  // Fix MAD SOCA / MAD CTI -- mitre-engenuity.org -> mad20.com
  if (c.url && c.url.includes('mitre-engenuity.org')) {
    console.log('  FIX: ' + c.id + ' "' + c.name + '" URL');
    console.log('    Old: ' + c.url);
    c.url = c.url.replace('mitre-engenuity.org', 'mad20.io');
    console.log('    New: ' + c.url);
    certFixCount++;
  }
  if (c.freeTrainingUrl && c.freeTrainingUrl.includes('mitre-engenuity.org')) {
    console.log('  FIX: ' + c.id + ' "' + c.name + '" freeTrainingUrl');
    c.freeTrainingUrl = c.freeTrainingUrl.replace('mitre-engenuity.org', 'mad20.io');
    console.log('    New: ' + c.freeTrainingUrl);
    certFixCount++;
  }

  // Fix Citrix training URLs
  if (c.freeTrainingUrl && c.freeTrainingUrl.includes('training.citrix.com')) {
    console.log('  FIX: ' + c.id + ' "' + c.name + '" freeTrainingUrl');
    c.freeTrainingUrl = 'https://www.citrix.com/training/';
    console.log('    New: ' + c.freeTrainingUrl);
    certFixCount++;
  }

  // Fix Zachman URLs
  if (c.url && c.url.includes('zachman.com/certification')) {
    console.log('  FIX: ' + c.id + ' "' + c.name + '" URL');
    console.log('    Old: ' + c.url);
    c.url = 'https://zachman-feac.com/';
    console.log('    New: ' + c.url);
    certFixCount++;
  }
});

// Remove marked certs
certs = certs.filter(function (c) { return !c._remove; });

// Re-index
certs.forEach(function (c, i) {
  c.id = 'c' + (i + 1);
});

fs.writeFileSync(CERTS_PATH, JSON.stringify(certs, null, 2) + '\n');
console.log('\n  Cert fixes applied: ' + certFixCount);
console.log('  Certs: ' + certsBefore + ' -> ' + certs.length);

console.log('\nDone!');

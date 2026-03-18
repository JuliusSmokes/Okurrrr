#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const PATHS_FILE = path.resolve(__dirname, '..', 'data', 'career-paths.json');

var paths = JSON.parse(fs.readFileSync(PATHS_FILE, 'utf8'));

var wiring = {
  'soc-analyst': ['OSINT', 'Digital Forensics', 'Network Security'],
  'penetration-tester': ['OSINT', 'Application Security', 'Cryptography', 'Network Security'],
  'cloud-security-engineer': ['Supply Chain Security', 'GRC and Compliance'],
  'grc-analyst': ['GRC and Compliance'],
  'dfir-specialist': ['Digital Forensics', 'OSINT', 'Network Security'],
  'appsec-engineer': ['Application Security', 'Supply Chain Security'],
  'security-architect': ['GRC and Compliance', 'Privacy and Legal', 'Network Security', 'Cryptography'],
  'threat-intel-analyst': ['OSINT'],
  'vuln-mgmt-analyst': ['Vulnerability Management', 'Network Security', 'Application Security'],
  'iam-engineer': ['GRC and Compliance'],
  'devsecops-engineer': ['Supply Chain Security', 'Application Security'],
  'malware-analyst': ['Digital Forensics'],
  'red-team-operator': ['OSINT', 'Application Security', 'Network Security', 'Cryptography'],
  'security-awareness-trainer': ['Privacy and Legal'],
  'network-security-engineer': ['Network Security', 'Cryptography', 'OSINT'],
  'privacy-engineer': ['GRC and Compliance'],
  'cybercrime-investigator': ['Digital Forensics', 'OSINT'],
  'ot-ics-security-engineer': ['GRC and Compliance', 'Network Security']
};

var changes = 0;
paths.forEach(function (p) {
  var additions = wiring[p.id];
  if (!additions) return;
  var existing = new Set(p.resourceCategories);
  additions.forEach(function (cat) {
    if (!existing.has(cat)) {
      p.resourceCategories.push(cat);
      existing.add(cat);
      changes++;
      console.log('  ' + p.id + ' += ' + cat);
    }
  });
});

fs.writeFileSync(PATHS_FILE, JSON.stringify(paths, null, 2) + '\n');
console.log('Career path wiring done: ' + changes + ' category links added.');

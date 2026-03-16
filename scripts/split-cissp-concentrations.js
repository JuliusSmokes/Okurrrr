const fs = require('fs');
const path = require('path');

const certsPath = path.join(__dirname, '..', 'data', 'certs.json');
const certs = JSON.parse(fs.readFileSync(certsPath, 'utf8'));

const before = certs.length;
const removed = certs.filter(c => c.id === 'c16');
const filtered = certs.filter(c => c.id !== 'c16');

const newEntries = [
  {
    id: 'c637',
    name: 'ISSAP',
    url: 'https://www.isc2.org/certifications/issap',
    category: 'GRC',
    level: 'Expert',
    niceWorkRoleIds: ['OG-WRL-002', 'OG-WRL-008', 'OG-WRL-016'],
    costUsd: 599,
    costNote: null,
    dod8140: true,
    dodWorkRoleCodes: [],
    fullName: 'Information Systems Security Architecture Professional',
    vendor: '(ISC)2',
    description: 'Validates expertise in developing and analyzing security solutions using architecture and design principles; requires active CISSP.',
    status: 'active',
    statusNote: null,
    freeTraining: true,
    freeTrainingUrl: 'https://www.isc2.org/landing/1mcc',
    cisspDomains: ['cissp-d1', 'cissp-d3', 'cissp-d4'],
    regions: ['Global']
  },
  {
    id: 'c638',
    name: 'ISSEP',
    url: 'https://www.isc2.org/certifications/issep',
    category: 'GRC',
    level: 'Expert',
    niceWorkRoleIds: ['OG-WRL-002', 'OG-WRL-008', 'OG-WRL-016'],
    costUsd: 599,
    costNote: null,
    dod8140: true,
    dodWorkRoleCodes: [],
    fullName: 'Information Systems Security Engineering Professional',
    vendor: '(ISC)2',
    description: 'Validates expertise in applying systems engineering principles to develop secure systems; requires active CISSP.',
    status: 'active',
    statusNote: null,
    freeTraining: true,
    freeTrainingUrl: 'https://www.isc2.org/landing/1mcc',
    cisspDomains: ['cissp-d3', 'cissp-d6', 'cissp-d8'],
    regions: ['Global']
  },
  {
    id: 'c639',
    name: 'ISSMP',
    url: 'https://www.isc2.org/certifications/issmp',
    category: 'GRC',
    level: 'Expert',
    niceWorkRoleIds: ['OG-WRL-002', 'OG-WRL-008', 'OG-WRL-016'],
    costUsd: 599,
    costNote: null,
    dod8140: true,
    dodWorkRoleCodes: [],
    fullName: 'Information Systems Security Management Professional',
    vendor: '(ISC)2',
    description: 'Validates expertise in establishing and managing cybersecurity programs and leadership; requires active CISSP.',
    status: 'active',
    statusNote: null,
    freeTraining: true,
    freeTrainingUrl: 'https://www.isc2.org/landing/1mcc',
    cisspDomains: ['cissp-d1', 'cissp-d2', 'cissp-d7'],
    regions: ['Global']
  }
];

const final = filtered.concat(newEntries);
fs.writeFileSync(certsPath, JSON.stringify(final, null, 2), 'utf8');

console.log('Removed:', removed.length, 'entry (c16 -', removed.map(r => r.fullName).join(', '), ')');
console.log('Added:', newEntries.length, 'entries:', newEntries.map(e => e.name + ' (' + e.fullName + ')').join(', '));
console.log('Before:', before, '-> After:', final.length);

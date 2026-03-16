const fs = require('fs');
const path = require('path');

const certsPath = path.join(__dirname, '..', 'data', 'certs.json');
const certs = JSON.parse(fs.readFileSync(certsPath, 'utf8'));

const VENDOR_REGIONS = {
  'CREST':                        ['UK', 'Australia', 'Asia-Pacific'],
  'BCS':                          ['UK'],
  'NCSC':                         ['UK'],
  'The Cyber Scheme':             ['UK'],
  'CIISec':                       ['UK'],
  'IT Governance':                ['UK'],
  'IT Governance / IBITGQ':       ['UK'],
  'Institute of Strategic Management': ['UK'],
  'AXELOS':                       ['Europe', 'UK'],
  'AXELOS/PeopleCert':            ['Europe', 'UK'],
  'APMG International':           ['Europe', 'UK'],
  'SECO-Institute':               ['Europe'],
  'SECO Institute':               ['Europe'],
  'EXIN':                         ['Europe'],
  'EXIN/Cloud Credential Council': ['Europe'],
  'PECB':                         ['Europe'],
  'TÜV':                          ['DACH', 'Europe'],
  'TÜV SÜD / Certipedia':        ['DACH', 'Europe'],
  'TÜV/IS-ITS':                   ['DACH', 'Europe'],
  'Limes Security':               ['DACH', 'Europe'],
  'Limes Security / TÜV':         ['DACH', 'Europe'],
  'Exida CACE':                   ['DACH', 'Europe'],
  'exida':                        ['DACH', 'Europe'],
  'DSCI':                         ['India'],
  'IACIS':                        ['North America'],
  'ISFCE':                        ['North America'],
  'ecfirst':                      ['North America'],
  'ecfirst / Cyber AB':           ['North America'],
  'ISMI':                         ['North America'],
  'ISECOM':                       ['Europe', 'North America'],
  'Cyber Struggle':               ['Europe', 'Middle East']
};

let tagged = 0;
let regionSpecific = 0;

certs.forEach(function (cert) {
  const lookup = VENDOR_REGIONS[cert.vendor];
  if (lookup) {
    cert.regions = lookup.slice();
    regionSpecific++;
  } else {
    cert.regions = ['Global'];
  }
  tagged++;
});

fs.writeFileSync(certsPath, JSON.stringify(certs, null, 2), 'utf8');

const allRegions = new Set();
certs.forEach(function (c) { c.regions.forEach(function (r) { allRegions.add(r); }); });

console.log('Tagged', tagged, 'certs');
console.log('Region-specific:', regionSpecific);
console.log('Global:', tagged - regionSpecific);
console.log('Unique regions:', [...allRegions].sort().join(', '));

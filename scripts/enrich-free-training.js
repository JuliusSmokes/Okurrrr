const fs = require('fs');
const path = require('path');

const certsPath = path.join(__dirname, '..', 'data', 'certs.json');
const certs = JSON.parse(fs.readFileSync(certsPath, 'utf8'));

// ── CISSP Domain mapping: category -> domain IDs ──
const CATEGORY_TO_CISSP = {
  'GRC':                                   ['cissp-d1', 'cissp-d2'],
  'Security Operations':                   ['cissp-d1', 'cissp-d2', 'cissp-d6', 'cissp-d7'],
  'Cloud/SysOps':                          ['cissp-d2', 'cissp-d4', 'cissp-d7'],
  'Security Architecture and Engineering': ['cissp-d3'],
  'Software Security':                     ['cissp-d3', 'cissp-d8'],
  'ICS/IoT':                               ['cissp-d3', 'cissp-d4'],
  '*nix':                                  ['cissp-d3', 'cissp-d7'],
  'Communication and Network Security':    ['cissp-d4'],
  'IAM':                                   ['cissp-d5'],
  'Penetration Testing':                   ['cissp-d6'],
  'Exploitation':                          ['cissp-d6'],
  'Forensics':                             ['cissp-d7'],
  'Incident Handling':                     ['cissp-d7']
};

// ── Vendor-level free training lookup ──
// Key: vendor name (or prefix). Value: { free: bool, url: string|null }
// Vendor names must match exactly OR be a prefix of cert.vendor
const VENDOR_TRAINING = {
  'CompTIA':              { free: true,  url: 'https://www.comptia.org/training/resources' },
  'Cisco':                { free: true,  url: 'https://skillsforall.com/' },
  'Amazon Web Services':  { free: true,  url: 'https://aws.amazon.com/training/digital/' },
  'Microsoft':            { free: true,  url: 'https://learn.microsoft.com/training/' },
  'Microsoft / GitHub':   { free: true,  url: 'https://learn.microsoft.com/training/' },
  'Google Cloud':         { free: true,  url: 'https://cloud.google.com/training/free' },
  'Google':               { free: true,  url: 'https://cloud.google.com/training/free' },
  '(ISC)2':               { free: true,  url: 'https://www.isc2.org/landing/1mcc' },
  '(ISC)²':               { free: true,  url: 'https://www.isc2.org/landing/1mcc' },
  'GIAC':                 { free: false, url: null },
  'GIAC/SANS':            { free: false, url: null },
  'SANS Institute':       { free: false, url: null },
  'Splunk':               { free: true,  url: 'https://education.splunk.com/catalog' },
  'Palo Alto Networks':   { free: true,  url: 'https://beacon.paloaltonetworks.com/' },
  'Fortinet':             { free: true,  url: 'https://training.fortinet.com/' },
  'Red Hat':              { free: true,  url: 'https://www.redhat.com/en/services/training-and-certification' },
  'PortSwigger':          { free: true,  url: 'https://portswigger.net/web-security' },
  'Zscaler':              { free: true,  url: 'https://partneracademy.zscaler.com/' },
  'Okta':                 { free: true,  url: 'https://certification.okta.com/page/study-guides' },
  'Salesforce':           { free: true,  url: 'https://trailhead.salesforce.com/' },
  'TryHackMe':            { free: true,  url: 'https://tryhackme.com/' },
  'Hack The Box':         { free: true,  url: 'https://academy.hackthebox.com/' },
  'HackTheBox':           { free: true,  url: 'https://academy.hackthebox.com/' },
  'CrowdStrike':          { free: true,  url: 'https://university.crowdstrike.com/' },
  'EC-Council':           { free: true,  url: 'https://codered.eccouncil.org/' },
  'ISACA':                { free: true,  url: 'https://www.isaca.org/resources' },
  'HashiCorp':            { free: true,  url: 'https://developer.hashicorp.com/tutorials' },
  'OneTrust':             { free: true,  url: 'https://www.onetrust.com/certifications/' },
  'SailPoint':            { free: true,  url: 'https://university.sailpoint.com/' },
  'Oracle':               { free: true,  url: 'https://education.oracle.com/learning-explorer' },
  'IBM':                  { free: true,  url: 'https://www.ibm.com/training/free' },
  'NVIDIA':               { free: true,  url: 'https://learn.nvidia.com/' },
  'Databricks':           { free: true,  url: 'https://www.databricks.com/learn' },
  'Snowflake':            { free: true,  url: 'https://learn.snowflake.com/' },
  'Check Point':          { free: true,  url: 'https://training-certifications.checkpoint.com/' },
  'Juniper Networks':     { free: true,  url: 'https://learningportal.juniper.net/' },
  'CertNexus':            { free: true,  url: 'https://certnexus.com/resources/' },
  'CNCF':                 { free: true,  url: 'https://www.cncf.io/training/' },
  'CNCF / Linux Foundation': { free: true, url: 'https://www.cncf.io/training/' },
  'CNCF/Linux Foundation':   { free: true, url: 'https://www.cncf.io/training/' },
  'Cloud Native Computing Foundation': { free: true, url: 'https://www.cncf.io/training/' },
  'Linux Foundation':     { free: true,  url: 'https://training.linuxfoundation.org/resources/' },
  'Linux Professional Institute': { free: true, url: 'https://learning.lpi.org/' },
  'Cloud Security Alliance': { free: true, url: 'https://cloudsecurityalliance.org/education/' },
  'Offensive Security':   { free: false, url: null },
  'OffSec':               { free: false, url: null },
  'PECB':                 { free: true,  url: 'https://pecb.com/en/education-and-certification-for-individuals' },
  'EXIN':                 { free: false, url: null },
  'EXIN/Cloud Credential Council': { free: false, url: null },
  'Mile2':                { free: false, url: null },
  'CREST':                { free: false, url: null },
  'GAQM':                 { free: false, url: null },
  'DRI International':    { free: false, url: null },
  'IAPP':                 { free: true,  url: 'https://iapp.org/resources/' },
  'PMI':                  { free: false, url: null },
  'Identity Management Institute': { free: false, url: null },
  'INE Security':         { free: true,  url: 'https://ine.com/learning/paths' },
  'INE/eLearnSecurity':   { free: true,  url: 'https://ine.com/learning/paths' },
  'MOSSE Institute':      { free: true,  url: 'https://www.mosse-institute.com/' },
  'Mossé Cyber Security Institute': { free: true, url: 'https://www.mosse-institute.com/' },
  'Mosse Institute':      { free: true,  url: 'https://www.mosse-institute.com/' },
  'SecOps Group':         { free: false, url: null },
  'SECO-Institute':       { free: false, url: null },
  'SECO Institute':       { free: false, url: null },
  'Scrum.org':            { free: true,  url: 'https://www.scrum.org/resources' },
  'AXELOS':               { free: false, url: null },
  'AXELOS/PeopleCert':    { free: false, url: null },
  'BCS':                  { free: false, url: null },
  'APMG International':   { free: false, url: null },
  'IT Governance':        { free: false, url: null },
  'IT Governance / IBITGQ': { free: false, url: null },
  'SABSA Institute':      { free: false, url: null },
  'ASIS International':   { free: false, url: null },
  'F5':                   { free: true,  url: 'https://www.f5.com/learn' },
  'F5 Networks':          { free: true,  url: 'https://www.f5.com/learn' },
  'Citrix':               { free: true,  url: 'https://training.citrix.com/' },
  'VMware':               { free: true,  url: 'https://www.vmware.com/learning.html' },
  'VMware (Broadcom)':    { free: true,  url: 'https://www.vmware.com/learning.html' },
  'SUSE':                 { free: true,  url: 'https://www.suse.com/training/' },
  'Wiz':                  { free: true,  url: 'https://www.wiz.io/academy' },
  'ISA':                  { free: false, url: null },
  'International Society of Automation': { free: false, url: null },
  '0xDarkVortex':         { free: false, url: null },
  'TCM Security':         { free: true,  url: 'https://academy.tcm-sec.com/' },
  'Security Blue Team':   { free: true,  url: 'https://www.securityblue.team/' },
  'Zero Point Security':  { free: false, url: null },
  'Practical DevSecOps':  { free: false, url: null },
  'Pentester Academy':    { free: false, url: null },
  'ISECOM':               { free: true,  url: 'https://www.isecom.org/research.html' },
  'MITRE Engenuity':      { free: true,  url: 'https://mitre-engenuity.org/' },
  'The Open Group':       { free: false, url: null },
  'Zachman International': { free: false, url: null },
  'OCEG':                 { free: true,  url: 'https://www.oceg.org/resources/' },
  'Shared Assessments':   { free: false, url: null },
  'NCSC':                 { free: true,  url: 'https://www.ncsc.gov.uk/section/education-skills/cyber-security-training' },
  'IACIS':                { free: false, url: null },
  'ISFCE':                { free: false, url: null },
  'AccessData':           { free: false, url: null },
  'OpenText':             { free: false, url: null },
  'PCI Security Standards Council': { free: true, url: 'https://www.pcisecuritystandards.org/program_training_and_qualification/' },
  'The Cyber Scheme':     { free: false, url: null },
  'Cyber Struggle':       { free: false, url: null },
  'CyberDefenders':       { free: true,  url: 'https://cyberdefenders.org/' },
  'Limes Security':       { free: false, url: null },
  'Limes Security / TÜV': { free: false, url: null },
  'TÜV':                  { free: false, url: null },
  'TÜV SÜD / Certipedia': { free: false, url: null },
  'TÜV/IS-ITS':           { free: false, url: null },
  'Exida CACE':           { free: false, url: null },
  'exida':                { free: false, url: null },
  'DSCI':                 { free: false, url: null },
  'ecfirst':              { free: false, url: null },
  'ecfirst / Cyber AB':   { free: false, url: null },
  'CSIAC':                { free: false, url: null },
  'The H Layer':          { free: false, url: null },
  'InfoSec Institute':    { free: true,  url: 'https://www.infosecinstitute.com/resources/' },
  'Infosec':              { free: true,  url: 'https://www.infosecinstitute.com/resources/' },
  'Infosec Institute':    { free: true,  url: 'https://www.infosecinstitute.com/resources/' },
  'RiskLens':             { free: false, url: null },
  'Mirantis':             { free: true,  url: 'https://www.mirantis.com/trainings/' },
  'CWNP':                 { free: false, url: null },
  'Chappell University':  { free: false, url: null },
  'IDPro':                { free: true,  url: 'https://idpro.org/body-of-knowledge/' },
  'Software Certification Institute': { free: false, url: null },
  'Apple':                { free: true,  url: 'https://training.apple.com/' },
  'EITCA Academy':        { free: false, url: null },
  'IIBA':                 { free: false, url: null },
  'ISMI':                 { free: false, url: null },
  'IntelTechniques / OSIP': { free: false, url: null },
  'The Institute of Internal Auditors': { free: false, url: null },
  'Institute of Strategic Management': { free: false, url: null },
  'Certiport/Pearson VUE': { free: false, url: null },
  'CIISec':               { free: false, url: null },
  'Mirantis':             { free: true,  url: 'https://www.mirantis.com/trainings/' }
};

let enriched = 0;
let cisspMapped = 0;

certs.forEach(cert => {
  // Free training enrichment
  if (cert.freeTraining === undefined || cert.freeTraining === null) {
    const lookup = VENDOR_TRAINING[cert.vendor];
    if (lookup) {
      cert.freeTraining = lookup.free;
      cert.freeTrainingUrl = lookup.url;
    } else {
      cert.freeTraining = false;
      cert.freeTrainingUrl = null;
    }
    enriched++;
  }

  // CISSP domain mapping from category
  if (!cert.cisspDomains || cert.cisspDomains.length === 0) {
    const domains = CATEGORY_TO_CISSP[cert.category];
    cert.cisspDomains = domains ? domains.slice() : [];
    if (cert.cisspDomains.length > 0) cisspMapped++;
  }
});

fs.writeFileSync(certsPath, JSON.stringify(certs, null, 2), 'utf8');
console.log('Enriched free training for', enriched, 'certs');
console.log('CISSP domain-mapped', cisspMapped, 'certs');
console.log('Total certs:', certs.length);

// Stats
const withFree = certs.filter(c => c.freeTraining).length;
const withCissp = certs.filter(c => c.cisspDomains && c.cisspDomains.length > 0).length;
const noVendorMatch = certs.filter(c => !VENDOR_TRAINING[c.vendor]).length;
console.log('Certs with free training:', withFree);
console.log('Certs with CISSP domains:', withCissp);
if (noVendorMatch > 0) {
  const missing = new Set();
  certs.filter(c => !VENDOR_TRAINING[c.vendor]).forEach(c => missing.add(c.vendor));
  console.log('Vendors not in lookup (' + noVendorMatch + ' certs):', [...missing].join(', '));
}

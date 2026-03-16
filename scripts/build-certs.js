/**
 * Build data/certs.json from Paul Jerimy roadmap content.
 * Run from repo root: node scripts/build-certs.js [path-to-roadmap-text]
 * If no path given, reads scripts/roadmap-sample.txt
 */

const fs = require('fs');
const path = require('path');

const roadmapPath = process.argv[2] || path.join(__dirname, 'roadmap-sample.txt');
const outPath = path.join(__dirname, '..', 'data', 'certs.json');

// Paul Jerimy category -> NICE Work Role IDs (best-effort mapping)
const CATEGORY_TO_NICE = {
  'Communication and Network Security': ['OG-WRL-001', 'IO-WRL-004'],
  'IAM': ['IO-WRL-005', 'DD-WRL-001'],
  'Security Architecture and Engineering': ['DD-WRL-001', 'DD-WRL-006'],
  'Asset Security': ['OG-WRL-012', 'PD-WRL-007'],
  'Security and Risk Management': ['OG-WRL-002', 'OG-WRL-007', 'OG-WRL-013'],
  'Security Assessment and Testing': ['OG-WRL-012', 'DD-WRL-007', 'PD-WRL-007'],
  'Software Security': ['DD-WRL-003', 'DD-WRL-004', 'DD-WRL-005'],
  'Security Operations': ['PD-WRL-001', 'PD-WRL-003', 'IO-WRL-006'],
  'Cloud/SysOps': ['IO-WRL-004', 'IO-WRL-005', 'DD-WRL-001'],
  '*nix': ['IO-WRL-005'],
  'ICS/IoT': ['DD-WRL-009', 'PD-WRL-004'],
  'GRC': ['OG-WRL-002', 'OG-WRL-008', 'OG-WRL-016'],
  'Forensics': ['IN-WRL-002', 'PD-WRL-002', 'IN-WRL-001'],
  'Incident Handling': ['PD-WRL-003'],
  'Penetration Testing': ['PD-WRL-007', 'DD-WRL-007'],
  'Exploitation': ['PD-WRL-007', 'DD-WRL-008']
};

function inferCategory(name) {
  const n = name.toUpperCase();
  if (/\b(FORENSIC|GCFA|GCFE|GNFA|EnCE|ACE|CFCE|CHFI|CCE|GX-FA|GBFA|CFSR|CSFA|MDFIR|eCIR|eCDFP)\b/i.test(n)) return 'Forensics';
  if (/\b(PENTEST|OSCP|OSEP|OSED|GPEN|CEH|PNPT|CPENT|eJPT|CRTO|LPT|CREST CRT|CREST CPSA|CREST CCTAPP|CREST CSAS|CREST CCSAS|BSCP|OSWA|OSDA|eMAPT|CAPen|CNPen|CBBH|C\)PTC|C\)PTE|C\)PEH|GCPEH|MPT|CPTS|CCTINF|CWEE)\b/i.test(n)) return 'Penetration Testing';
  if (/\b(EXPLOIT|OSCE|OSWE|OSMR|MRT|MVRE|MCD|GXPN)\b/i.test(n)) return 'Exploitation';
  if (/\b(INCIDENT|ECIH|GCIH|GEIR|PACES|GSOC|IR\b|CIRM)\b/i.test(n)) return 'Incident Handling';
  if (/\b(GRC|CISSP|CISM|CISA|CRISC|CGRC|27001|27005|ISO.*27001|PECB|APMG|EXIN.*ISM|CIS RM|CIS IA|CIS LA|CIS LI|BCS FISMP|BCS PCIRM|BCS PCIAA|CCRMP|DCRMP|DACRP|SSAP|GRCP|GRCA|CTPRP|CTPRA|M_o_R|C\)ISSO|C\)ISSM|C\)HISSP|C\)ISMS|C\)ISRM|C\)ISSA)\b/i.test(n)) return 'GRC';
  if (/\b(CLOUD|AWS|AZ-|AZURE|GCP|Google (ACE|PCSA|PCSE)|CCSK|CCSP|GPCS|GCSA|GCLD|FCP PCS|FCSS PCS|VCP|LFCA|LFCS|CKAD|CKA|KCNA|CKS)\b/i.test(n)) return 'Cloud/SysOps';
  if (/\b(LINUX|LPIC|RHCSA|RHCE|RHCA|SCE|SCA|DCA|LFCS)\b/i.test(n)) return '*nix';
  if (/\b(ICS|IOT|ISA CDS|ISA CAP|ISA CFS|ISA CRAS|ISA CE|GICSP|TUV COSP|TUV COTCP|TUV COSTE|FCSS OT)\b/i.test(n)) return 'ICS/IoT';
  if (/\b(SECURE.*SOFTWARE|CSSLP|CASE|C\)SLO|C\)SWAE|C-SPL|S-SPF|DevSecOps|CDRP|PDSO|MDSO|MASE|CSST|CASST)\b/i.test(n)) return 'Software Security';
  if (/\b(ARCHITECT|TOGAF|SABSA|GDSA|SC-100|CCDE|Zach|EAPro|EAP|EAA)\b/i.test(n)) return 'Security Architecture and Engineering';
  if (/\b(IAM|IDENTITY|CIAM|CIMP|CIGE|CIPA|CDP|CIDPRO|CAMS|CRFS|CIST|SC-300|CIAMD)\b/i.test(n)) return 'IAM';
  if (/\b(DEFENSE|DEFENSIVE|SOC|BLUE|BTL|CDSA|CFR|GDAT|GCED|GCDA|GMON|GCTD|MTH|MBT|MRT|CREST CCNIA|CREST CPIA|CREST CCHIA|CRIA|CTIA|CPTIA|C\)TIA|C\)NFE)\b/i.test(n)) return 'Security Operations';
  if (/\b(NETWORK|CCNA|CCNP|JNCI|PCNSA|FCSS NS|FCP NS|F5 |WCNA)\b/i.test(n)) return 'Communication and Network Security';
  return 'Security Operations';
}

const raw = fs.readFileSync(roadmapPath, 'utf8');
const lines = raw.split(/\r?\n/);
const certs = [];
let level = 'Expert';
const linkRe = /\[([^\]]+)\]\((h?https?:\/\/[^\)]+)\)/g;
let id = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.trim() === 'Intermediate') { level = 'Intermediate'; continue; }
  if (line.trim() === 'Beginner') { level = 'Beginner'; continue; }
  if (/^\d+ certifications listed/.test(line)) break;
  let m;
  while ((m = linkRe.exec(line)) !== null) {
    const name = m[1].trim();
    let url = m[2].trim();
    if (url.startsWith('hhttps')) url = 'https' + url.slice(6);
    if (!url.startsWith('http')) continue;
    if (name === 'View source on Github' || name === 'Order a Print' || name === 'Donate on Patreon') continue;
    if (name === 'Programming Language') continue;
    const category = inferCategory(name);
    const niceWorkRoleIds = CATEGORY_TO_NICE[category] || ['PD-WRL-001'];
    certs.push({
      id: 'c' + (++id),
      name,
      url,
      category,
      level,
      niceWorkRoleIds,
      costUsd: null,
      costNote: 'See vendor'
    });
  }
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(certs, null, 2), 'utf8');
console.log('Wrote', certs.length, 'certs to', outPath);

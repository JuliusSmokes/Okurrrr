#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const NIST_JSON_PATH = path.resolve('d:/Downloads/glossary-export-temp/glossary-export.json');
const AI_XLSX_PATH = path.resolve('d:/Downloads/The Language of Trustworthy AI_ An In-Depth Glossary of Terms (updated August 4, 2024).xlsx');
const CAREER_PATHS_PATH = path.resolve(__dirname, '..', 'data', 'career-paths.json');
const OUTPUT_PATH = path.resolve(__dirname, '..', 'data', 'nist-glossary.json');

const CISSP_DOMAIN_KEYWORDS = {
  'cissp-d1': [
    'risk', 'governance', 'compliance', 'policy', 'regulatory', 'legal', 'ethics',
    'business continuity', 'BCP', 'BIA', 'business impact', 'disaster recovery',
    'code of ethics', 'intellectual property', 'due diligence', 'due care',
    'security governance', 'risk management', 'risk assessment', 'security policy',
    'liability', 'regulation', 'law', 'legislation', 'standard of care',
    'awareness', 'training', 'education', 'personnel security', 'hiring',
    'acquisition', 'procurement', 'vendor management', 'supply chain',
    'threat modeling', 'risk analysis', 'quantitative risk', 'qualitative risk',
    'annualized loss', 'single loss', 'exposure factor', 'safeguard',
    'control', 'countermeasure', 'mitigation', 'acceptance', 'avoidance',
    'transfer', 'SLA', 'SLE', 'ALE', 'ARO'
  ],
  'cissp-d2': [
    'classification', 'data lifecycle', 'retention', 'ownership', 'privacy',
    'PII', 'PHI', 'data handling', 'data remanence', 'data destruction',
    'information lifecycle', 'labeling', 'data custodian', 'data owner',
    'data steward', 'data processor', 'data controller', 'sensitive data',
    'confidential', 'top secret', 'secret', 'unclassified',
    'data at rest', 'data in transit', 'data in use', 'asset management',
    'media sanitization', 'degaussing', 'secure disposal', 'baseline',
    'scoping', 'tailoring', 'data security', 'information asset'
  ],
  'cissp-d3': [
    'cryptography', 'cipher', 'encrypt', 'decrypt', 'hash', 'key management',
    'PKI', 'TLS', 'SSL', 'certificate', 'digital signature', 'symmetric',
    'asymmetric', 'AES', 'RSA', 'elliptic curve', 'block cipher',
    'stream cipher', 'key exchange', 'Diffie-Hellman', 'public key',
    'private key', 'certificate authority', 'security model', 'Bell-LaPadula',
    'Biba', 'Clark-Wilson', 'lattice', 'state machine', 'information flow',
    'security architecture', 'trusted computing', 'TPM', 'HSM',
    'secure design', 'defense in depth', 'security kernel', 'reference monitor',
    'covert channel', 'side channel', 'TEMPEST', 'emanation',
    'virtualization', 'hypervisor', 'cloud computing', 'IaaS', 'PaaS', 'SaaS',
    'microservice', 'serverless', 'container', 'sandbox'
  ],
  'cissp-d4': [
    'network', 'firewall', 'TCP', 'IP', 'DNS', 'routing', 'VPN', 'protocol',
    'packet', 'OSI', 'switch', 'router', 'subnet', 'VLAN', 'NAT',
    'proxy', 'load balancer', 'gateway', 'DMZ', 'perimeter',
    'wireless', 'Wi-Fi', 'Bluetooth', 'SSID', 'WPA', '802.11',
    'IDS', 'IPS', 'intrusion detection', 'intrusion prevention',
    'network segmentation', 'micro-segmentation', 'SDN', 'SD-WAN',
    'MPLS', 'BGP', 'OSPF', 'IPSec', 'SSH', 'SNMP', 'ICMP',
    'port', 'socket', 'bandwidth', 'latency', 'throughput',
    'HTTPS', 'HTTP', 'FTP', 'SMTP', 'IMAP', 'POP3',
    'DDoS', 'denial of service', 'spoofing', 'ARP', 'MAC address',
    'network access control', 'NAC', '802.1X', 'RADIUS', 'TACACS'
  ],
  'cissp-d5': [
    'authentication', 'authorization', 'identity', 'access control',
    'RBAC', 'MFA', 'credential', 'SSO', 'federation', 'SAML', 'OAuth',
    'OpenID', 'Kerberos', 'LDAP', 'Active Directory', 'directory service',
    'biometric', 'token', 'smart card', 'password', 'passphrase',
    'multi-factor', 'two-factor', 'single sign-on', 'identity management',
    'identity provider', 'service provider', 'provisioning', 'deprovisioning',
    'entitlement', 'privilege', 'least privilege', 'separation of duties',
    'need to know', 'mandatory access control', 'MAC', 'DAC',
    'discretionary access control', 'ABAC', 'attribute-based',
    'role-based', 'rule-based', 'context-based', 'risk-based',
    'account management', 'session management', 'access review',
    'PAM', 'privileged access', 'identity governance', 'FIDO',
    'zero trust', 'identity verification'
  ],
  'cissp-d6': [
    'audit', 'vulnerability', 'penetration', 'assessment', 'testing',
    'scan', 'compliance verification', 'security assessment', 'pentest',
    'vulnerability assessment', 'vulnerability scanning', 'security audit',
    'log review', 'code review', 'security testing', 'SAST', 'DAST',
    'fuzzing', 'fuzz testing', 'red team', 'blue team', 'purple team',
    'tabletop exercise', 'war game', 'simulation', 'BAS',
    'breach and attack', 'continuous monitoring', 'KPI', 'KRI',
    'metric', 'benchmark', 'baseline assessment', 'gap analysis',
    'maturity model', 'CMMI', 'security control', 'control testing',
    'SOC 2', 'attestation', 'third-party assessment',
    'CVE', 'CVSS', 'exploit', 'proof of concept', 'disclosure'
  ],
  'cissp-d7': [
    'incident', 'SIEM', 'forensic', 'triage', 'playbook',
    'detection', 'response', 'monitoring', 'log', 'alert', 'SOC',
    'security operations', 'incident response', 'incident handling',
    'containment', 'eradication', 'recovery', 'lessons learned',
    'chain of custody', 'evidence', 'digital forensics', 'memory forensics',
    'disk forensics', 'network forensics', 'malware analysis',
    'reverse engineering', 'threat hunting', 'indicator of compromise', 'IOC',
    'threat intelligence', 'STIX', 'TAXII', 'MITRE ATT&CK', 'kill chain',
    'YARA', 'Snort', 'Suricata', 'Zeek', 'Wireshark', 'PCAP',
    'sandbox', 'behavioral analysis', 'signature', 'anomaly detection',
    'heuristic', 'machine learning detection', 'SOAR', 'orchestration',
    'automation', 'patch management', 'change management', 'configuration management',
    'backup', 'restore', 'disaster recovery', 'business continuity',
    'physical security', 'access badge', 'CCTV', 'mantrap', 'guard',
    'fire suppression', 'HVAC', 'UPS', 'generator'
  ],
  'cissp-d8': [
    'SDLC', 'secure coding', 'injection', 'input validation', 'API security',
    'OWASP', 'software development', 'application security',
    'code review', 'static analysis', 'dynamic analysis', 'runtime',
    'buffer overflow', 'XSS', 'cross-site', 'CSRF', 'SQL injection',
    'command injection', 'deserialization', 'race condition',
    'secure design', 'threat modeling', 'STRIDE',
    'software composition', 'open source', 'library', 'dependency',
    'DevSecOps', 'CI/CD', 'pipeline', 'build', 'deploy',
    'containerization', 'Docker', 'Kubernetes', 'microservice',
    'database security', 'ORM', 'stored procedure', 'parameterized query',
    'web application firewall', 'WAF', 'bot management',
    'software assurance', 'code signing', 'integrity verification',
    'SBOM', 'software bill of materials', 'supply chain',
    'maturity model', 'BSIMM', 'SAMM', 'secure development lifecycle'
  ]
};

function stripHtml(s) {
  return s.replace(/<[^>]*>/g, '').trim();
}

function getFirstLetter(term) {
  var cleaned = term.replace(/^[^a-zA-Z0-9]+/, '');
  if (!cleaned) return '#';
  var ch = cleaned.charAt(0).toUpperCase();
  if (ch >= 'A' && ch <= 'Z') return ch;
  if (ch >= '0' && ch <= '9') return '#';
  return '#';
}

function normalizeTerm(term) {
  return stripHtml(term).toLowerCase().trim();
}

/* Step 1: Load and merge both glossaries */

console.log('Loading NIST CSRC glossary...');
var nistRaw = fs.readFileSync(NIST_JSON_PATH, 'utf8').replace(/^\uFEFF/, '');
var nistData = JSON.parse(nistRaw);
var nistTerms = nistData.parentTerms || [];
console.log('  Loaded ' + nistTerms.length + ' CSRC terms');

console.log('Loading NIST AI glossary...');
var workbook = XLSX.readFile(AI_XLSX_PATH);
var sheet = workbook.Sheets[workbook.SheetNames[0]];
var aiRows = XLSX.utils.sheet_to_json(sheet);
console.log('  Loaded ' + aiRows.length + ' AI rows');

var merged = {};
var csrcCount = 0;
var aiCount = 0;

nistTerms.forEach(function (entry) {
  if (!entry.term) return;
  var termName = stripHtml(entry.term);
  var key = normalizeTerm(termName);
  if (!key) return;

  var defs = [];
  if (entry.definitions) {
    entry.definitions.forEach(function (d) {
      if (d.text) {
        var citations = [];
        if (d.sources) {
          d.sources.forEach(function (s) { if (s.text) citations.push(s.text); });
        }
        defs.push({ t: d.text, c: citations.join('; ') || '' });
      }
    });
  }

  merged[key] = {
    term: termName,
    letter: getFirstLetter(termName),
    src: 'CSRC',
    link: entry.link || '',
    defs: defs
  };
  csrcCount++;
});

aiRows.forEach(function (row) {
  var termName = row['Terms'] || row['Term'] || row['terms'] || row['term'];
  if (!termName || typeof termName !== 'string') return;
  termName = termName.trim();
  if (!termName) return;

  var key = normalizeTerm(termName);
  var defs = [];

  for (var i = 1; i <= 5; i++) {
    var defKey = 'Definition ' + i;
    var citeKey = 'Citation ' + i;
    var defText = row[defKey];
    if (defText && typeof defText === 'string' && defText.trim()) {
      var cite = (row[citeKey] && typeof row[citeKey] === 'string') ? row[citeKey].trim() : '';
      defs.push({ t: defText.trim(), c: cite });
    }
  }

  if (defs.length === 0) return;

  if (merged[key]) {
    defs.forEach(function (d) { merged[key].defs.push(d); });
    if (merged[key].src === 'CSRC') merged[key].src = 'BOTH';
  } else {
    merged[key] = {
      term: termName,
      letter: getFirstLetter(termName),
      src: 'AI',
      link: '',
      defs: defs
    };
  }
  aiCount++;
});

var terms = Object.values(merged);
terms.sort(function (a, b) { return a.term.toLowerCase().localeCompare(b.term.toLowerCase()); });

var idx = 1;
terms.forEach(function (t) {
  t.id = 'g' + String(idx).padStart(5, '0');
  idx++;
});

console.log('\nMerge complete:');
console.log('  Unique terms: ' + terms.length);
console.log('  CSRC-only entries processed: ' + csrcCount);
console.log('  AI entries processed: ' + aiCount);

var letterCounts = {};
terms.forEach(function (t) {
  letterCounts[t.letter] = (letterCounts[t.letter] || 0) + 1;
});
console.log('\nPer-letter distribution:');
Object.keys(letterCounts).sort().forEach(function (l) {
  console.log('  ' + l + ': ' + letterCounts[l]);
});

var srcCounts = { CSRC: 0, AI: 0, BOTH: 0 };
terms.forEach(function (t) { srcCounts[t.src] = (srcCounts[t.src] || 0) + 1; });
console.log('\nSource breakdown:');
console.log('  CSRC only: ' + srcCounts.CSRC);
console.log('  AI only: ' + srcCounts.AI);
console.log('  Both sources: ' + srcCounts.BOTH);

/* Step 2: Build career path term mappings */

console.log('\nBuilding career path term mappings...');
var careerPaths = JSON.parse(fs.readFileSync(CAREER_PATHS_PATH, 'utf8'));

function extractSkillKeywords(skillStr) {
  var keywords = [];
  var cleaned = skillStr
    .replace(/\(([^)]+)\)/g, function (_, inner) {
      inner.split(/[,\/]/).forEach(function (s) {
        var trimmed = s.trim();
        if (trimmed.length >= 2) keywords.push(trimmed.toLowerCase());
      });
      return '';
    });

  cleaned.split(/[,;\/]/).forEach(function (part) {
    var trimmed = part.trim().toLowerCase();
    if (trimmed.length >= 3 && !/^(and|the|for|with|from|into|basics|fundamentals|advanced)$/.test(trimmed)) {
      keywords.push(trimmed);
      var words = trimmed.split(/\s+/);
      if (words.length > 1) {
        words.forEach(function (w) {
          if (w.length >= 3 && !/^(and|the|for|with|from|into)$/.test(w)) {
            keywords.push(w);
          }
        });
      }
    }
  });

  return keywords;
}

function buildTermSearchText(term) {
  var text = term.term.toLowerCase();
  term.defs.forEach(function (d) {
    text += ' ' + d.t.toLowerCase();
  });
  return text;
}

var termSearchTexts = {};
terms.forEach(function (t) {
  termSearchTexts[t.id] = buildTermSearchText(t);
});

var pathMap = {};

careerPaths.forEach(function (cp) {
  var keywordSet = new Set();

  if (cp.cisspDomains) {
    cp.cisspDomains.forEach(function (domId) {
      var domKeywords = CISSP_DOMAIN_KEYWORDS[domId];
      if (domKeywords) {
        domKeywords.forEach(function (kw) { keywordSet.add(kw.toLowerCase()); });
      }
    });
  }

  if (cp.phases) {
    cp.phases.forEach(function (phase) {
      if (phase.skills) {
        phase.skills.forEach(function (skill) {
          var extracted = extractSkillKeywords(skill);
          extracted.forEach(function (kw) { keywordSet.add(kw); });
        });
      }
    });
  }

  var keywords = [];
  keywordSet.forEach(function (kw) { keywords.push(kw); });
  keywords.sort(function (a, b) { return b.length - a.length; });

  var matchedIds = [];

  var multiWordKws = keywords.filter(function (kw) { return kw.indexOf(' ') !== -1 && kw.length >= 6; });
  var singleWordKws = keywords.filter(function (kw) { return kw.indexOf(' ') === -1 && kw.length >= 3; });

  var singleWordPatterns = singleWordKws.map(function (kw) {
    return new RegExp('\\b' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
  });

  terms.forEach(function (t) {
    var termLower = t.term.toLowerCase();
    var searchText = termSearchTexts[t.id];
    var score = 0;

    for (var i = 0; i < multiWordKws.length; i++) {
      if (termLower.indexOf(multiWordKws[i]) !== -1) { score += 3; break; }
      if (searchText.indexOf(multiWordKws[i]) !== -1) { score += 1; }
      if (score >= 1) break;
    }

    if (score === 0) {
      for (var j = 0; j < singleWordPatterns.length; j++) {
        if (singleWordPatterns[j].test(termLower)) { score += 2; break; }
      }
    }

    if (score >= 1) matchedIds.push(t.id);
  });

  pathMap[cp.id] = matchedIds;
  console.log('  ' + cp.id + ': ' + matchedIds.length + ' terms matched');
});

/* Step 3: Write output */

var output = { terms: terms, pathMap: pathMap };
var json = JSON.stringify(output);
fs.writeFileSync(OUTPUT_PATH, json);

var sizeMB = (Buffer.byteLength(json) / (1024 * 1024)).toFixed(2);
console.log('\nOutput written to ' + OUTPUT_PATH);
console.log('  File size: ' + sizeMB + ' MB');
console.log('  Terms: ' + terms.length);
console.log('\nDone!');

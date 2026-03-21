#!/usr/bin/env node
/**
 * Refresh the NIST CSRC glossary by downloading the official JSON export,
 * merging with the existing local glossary data, enriching abbreviation-only
 * terms, and regenerating the metadata file.
 *
 * Data source: https://csrc.nist.gov/csrc/media/glossary/glossary-export.zip
 *              (updated daily at 6:15 pm ET by NIST)
 *
 * Usage:  node scripts/refresh-nist-glossary.js
 * Exit:   0 = changes written, 1 = no changes needed, 2 = error
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const DATA_DIR = path.resolve(__dirname, '..', 'data');
const GLOSSARY_PATH = path.join(DATA_DIR, 'nist-glossary.json');
const META_PATH = path.join(DATA_DIR, 'nist-glossary-meta.json');
const CAREER_PATHS_PATH = path.join(DATA_DIR, 'career-paths.json');
const ZIP_URL = 'https://csrc.nist.gov/csrc/media/glossary/glossary-export.zip';
const TEMP_ZIP = path.join(DATA_DIR, '_glossary-export.zip');
const TEMP_JSON = path.join(DATA_DIR, '_glossary-export.json');

const CONCURRENCY = 5;
const DELAY_MS = 200;

const CISSP_DOMAIN_KEYWORDS = {
  'cissp-d1': ['risk','governance','compliance','policy','regulatory','legal','ethics','business continuity','BCP','BIA','business impact','disaster recovery','code of ethics','intellectual property','due diligence','due care','security governance','risk management','risk assessment','security policy','liability','regulation','law','legislation','standard of care','awareness','training','education','personnel security','hiring','acquisition','procurement','vendor management','supply chain','threat modeling','risk analysis','quantitative risk','qualitative risk','annualized loss','single loss','exposure factor','safeguard','control','countermeasure','mitigation','acceptance','avoidance','transfer','SLA','SLE','ALE','ARO'],
  'cissp-d2': ['classification','data lifecycle','retention','ownership','privacy','PII','PHI','data handling','data remanence','data destruction','information lifecycle','labeling','data custodian','data owner','data steward','data processor','data controller','sensitive data','confidential','top secret','secret','unclassified','data at rest','data in transit','data in use','asset management','media sanitization','degaussing','secure disposal','baseline','scoping','tailoring','data security','information asset'],
  'cissp-d3': ['cryptography','cipher','encrypt','decrypt','hash','key management','PKI','TLS','SSL','certificate','digital signature','symmetric','asymmetric','AES','RSA','elliptic curve','block cipher','stream cipher','key exchange','Diffie-Hellman','public key','private key','certificate authority','security model','Bell-LaPadula','Biba','Clark-Wilson','lattice','state machine','information flow','security architecture','trusted computing','TPM','HSM','secure design','defense in depth','security kernel','reference monitor','covert channel','side channel','TEMPEST','emanation','virtualization','hypervisor','cloud computing','IaaS','PaaS','SaaS','microservice','serverless','container','sandbox'],
  'cissp-d4': ['network','firewall','TCP','IP','DNS','routing','VPN','protocol','packet','OSI','switch','router','subnet','VLAN','NAT','proxy','load balancer','gateway','DMZ','perimeter','wireless','Wi-Fi','Bluetooth','SSID','WPA','802.11','IDS','IPS','intrusion detection','intrusion prevention','network segmentation','micro-segmentation','SDN','SD-WAN','MPLS','BGP','OSPF','IPSec','SSH','SNMP','ICMP','port','socket','bandwidth','latency','throughput','HTTPS','HTTP','FTP','SMTP','IMAP','POP3','DDoS','denial of service','spoofing','ARP','MAC address','network access control','NAC','802.1X','RADIUS','TACACS'],
  'cissp-d5': ['authentication','authorization','identity','access control','RBAC','MFA','credential','SSO','federation','SAML','OAuth','OpenID','Kerberos','LDAP','Active Directory','directory service','biometric','token','smart card','password','passphrase','multi-factor','two-factor','single sign-on','identity management','identity provider','service provider','provisioning','deprovisioning','entitlement','privilege','least privilege','separation of duties','need to know','mandatory access control','MAC','DAC','discretionary access control','ABAC','attribute-based','role-based','rule-based','context-based','risk-based','account management','session management','access review','PAM','privileged access','identity governance','FIDO','zero trust','identity verification'],
  'cissp-d6': ['audit','vulnerability','penetration','assessment','testing','scan','compliance verification','security assessment','pentest','vulnerability assessment','vulnerability scanning','security audit','log review','code review','security testing','SAST','DAST','fuzzing','fuzz testing','red team','blue team','purple team','tabletop exercise','war game','simulation','BAS','breach and attack','continuous monitoring','KPI','KRI','metric','benchmark','baseline assessment','gap analysis','maturity model','CMMI','security control','control testing','SOC 2','attestation','third-party assessment','CVE','CVSS','exploit','proof of concept','disclosure'],
  'cissp-d7': ['incident','SIEM','forensic','triage','playbook','detection','response','monitoring','log','alert','SOC','security operations','incident response','incident handling','containment','eradication','recovery','lessons learned','chain of custody','evidence','digital forensics','memory forensics','disk forensics','network forensics','malware analysis','reverse engineering','threat hunting','indicator of compromise','IOC','threat intelligence','STIX','TAXII','MITRE ATT&CK','kill chain','YARA','Snort','Suricata','Zeek','Wireshark','PCAP','sandbox','behavioral analysis','signature','anomaly detection','heuristic','machine learning detection','SOAR','orchestration','automation','patch management','change management','configuration management','backup','restore','disaster recovery','business continuity','physical security','access badge','CCTV','mantrap','guard','fire suppression','HVAC','UPS','generator'],
  'cissp-d8': ['SDLC','secure coding','injection','input validation','API security','OWASP','software development','application security','code review','static analysis','dynamic analysis','runtime','buffer overflow','XSS','cross-site','CSRF','SQL injection','command injection','deserialization','race condition','secure design','threat modeling','STRIDE','software composition','open source','library','dependency','DevSecOps','CI/CD','pipeline','build','deploy','containerization','Docker','Kubernetes','microservice','database security','ORM','stored procedure','parameterized query','web application firewall','WAF','bot management','software assurance','code signing','integrity verification','SBOM','software bill of materials','supply chain','maturity model','BSIMM','SAMM','secure development lifecycle']
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

function httpsGet(url) {
  return new Promise(function (resolve, reject) {
    var chunks = [];
    https.get(url, { headers: { 'User-Agent': 'OkurrrrBot/1.0 (cybersecurity education)' } }, function (res) {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return httpsGet(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error('HTTP ' + res.statusCode + ' for ' + url));
      }
      res.on('data', function (c) { chunks.push(c); });
      res.on('end', function () { resolve(Buffer.concat(chunks)); });
      res.on('error', reject);
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(function (r) { setTimeout(r, ms); });
}

function scrapeAbbrevs(termLink) {
  return httpsGet(termLink).then(function (buf) {
    var html = buf.toString('utf8');
    var abbrevs = [];
    var re = /id="term-abbr-text-\d+"[^>]*>([^<]+)</gi;
    var m;
    while ((m = re.exec(html)) !== null) {
      var txt = m[1].trim();
      if (txt) abbrevs.push(txt);
    }
    return abbrevs;
  }).catch(function () { return []; });
}

async function enrichAbbrevs(terms) {
  var toEnrich = terms.filter(function (t) { return t.defs.length === 0 && t.link && (!t.abbrevs || t.abbrevs.length === 0); });
  if (toEnrich.length === 0) {
    console.log('  No terms need abbreviation enrichment.');
    return;
  }
  console.log('  Enriching abbreviations for ' + toEnrich.length + ' terms...');

  var done = 0;
  var enriched = 0;

  for (var i = 0; i < toEnrich.length; i += CONCURRENCY) {
    var batch = toEnrich.slice(i, i + CONCURRENCY);
    var results = await Promise.all(batch.map(function (t) { return scrapeAbbrevs(t.link); }));
    for (var j = 0; j < batch.length; j++) {
      if (results[j].length > 0) {
        batch[j].abbrevs = results[j];
        enriched++;
      }
    }
    done += batch.length;
    if (done % 500 === 0 || done === toEnrich.length) {
      console.log('    ' + done + '/' + toEnrich.length + ' scraped (' + enriched + ' enriched)');
    }
    if (i + CONCURRENCY < toEnrich.length) await sleep(DELAY_MS);
  }
  console.log('  Abbreviation enrichment complete: ' + enriched + ' terms enriched.');
}

function buildPathMap(terms) {
  var careerPaths;
  try {
    careerPaths = JSON.parse(fs.readFileSync(CAREER_PATHS_PATH, 'utf8'));
  } catch (e) {
    console.log('  Warning: could not load career-paths.json, skipping pathMap.');
    return {};
  }

  function extractSkillKeywords(skillStr) {
    var keywords = [];
    var cleaned = skillStr.replace(/\(([^)]+)\)/g, function (_, inner) {
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
            if (w.length >= 3 && !/^(and|the|for|with|from|into)$/.test(w)) keywords.push(w);
          });
        }
      }
    });
    return keywords;
  }

  var termSearchTexts = {};
  terms.forEach(function (t) {
    var text = t.term.toLowerCase();
    t.defs.forEach(function (d) { text += ' ' + d.t.toLowerCase(); });
    termSearchTexts[t.id] = text;
  });

  var pathMap = {};
  careerPaths.forEach(function (cp) {
    var keywordSet = new Set();
    if (cp.cisspDomains) {
      cp.cisspDomains.forEach(function (domId) {
        var domKeywords = CISSP_DOMAIN_KEYWORDS[domId];
        if (domKeywords) domKeywords.forEach(function (kw) { keywordSet.add(kw.toLowerCase()); });
      });
    }
    if (cp.phases) {
      cp.phases.forEach(function (phase) {
        if (phase.skills) phase.skills.forEach(function (skill) {
          extractSkillKeywords(skill).forEach(function (kw) { keywordSet.add(kw); });
        });
      });
    }
    var keywords = [];
    keywordSet.forEach(function (kw) { keywords.push(kw); });
    keywords.sort(function (a, b) { return b.length - a.length; });

    var multiWordKws = keywords.filter(function (kw) { return kw.indexOf(' ') !== -1 && kw.length >= 6; });
    var singleWordKws = keywords.filter(function (kw) { return kw.indexOf(' ') === -1 && kw.length >= 3; });
    var singleWordPatterns = singleWordKws.map(function (kw) {
      return new RegExp('\\b' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
    });

    var matchedIds = [];
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
  });
  return pathMap;
}

async function main() {
  console.log('=== NIST Glossary Refresh ===\n');

  // Step 1: Download the official NIST JSON export
  console.log('Step 1: Downloading NIST glossary export...');
  var zipBuf;
  try {
    zipBuf = await httpsGet(ZIP_URL);
    fs.writeFileSync(TEMP_ZIP, zipBuf);
    console.log('  Downloaded ' + (zipBuf.length / 1024).toFixed(0) + ' KB');
  } catch (err) {
    console.error('  Failed to download: ' + err.message);
    process.exit(2);
  }

  // Step 2: Extract JSON from ZIP
  console.log('\nStep 2: Extracting JSON from ZIP...');
  try {
    execSync('tar -xf "' + TEMP_ZIP + '" -C "' + DATA_DIR + '"', { stdio: 'pipe' });
    var extracted = fs.readdirSync(DATA_DIR).filter(function (f) {
      return f.match(/glossary-export.*\.json$/i) && f !== 'nist-glossary.json' && f !== 'nist-glossary-meta.json';
    });
    if (extracted.length === 0) throw new Error('No glossary JSON found in ZIP');
    var extractedPath = path.join(DATA_DIR, extracted[0]);
    if (extractedPath !== TEMP_JSON) fs.renameSync(extractedPath, TEMP_JSON);
    console.log('  Extracted: ' + extracted[0]);
  } catch (err) {
    console.error('  Extraction failed: ' + err.message);
    cleanup();
    process.exit(2);
  }

  // Step 3: Parse and merge
  console.log('\nStep 3: Parsing NIST export...');
  var nistRaw;
  try {
    var rawText = fs.readFileSync(TEMP_JSON, 'utf8');
    if (rawText.charCodeAt(0) === 0xFEFF) rawText = rawText.slice(1);
    nistRaw = JSON.parse(rawText);
  } catch (err) {
    console.error('  Parse failed: ' + err.message);
    cleanup();
    process.exit(2);
  }

  var nistTerms = nistRaw.parentTerms || [];
  console.log('  NIST export contains ' + nistTerms.length + ' terms');

  // Load existing local glossary to preserve AI terms and abbrevs
  var existing = {};
  try {
    var local = JSON.parse(fs.readFileSync(GLOSSARY_PATH, 'utf8'));
    (local.terms || []).forEach(function (t) {
      existing[normalizeTerm(t.term)] = t;
    });
    console.log('  Local glossary has ' + Object.keys(existing).length + ' terms');
  } catch (e) {
    console.log('  No existing glossary found, starting fresh.');
  }

  // Build merged term map
  var merged = {};

  // First, bring in all CSRC terms from the fresh export
  var csrcCount = 0;
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
          if (d.sources) d.sources.forEach(function (s) { if (s.text) citations.push(s.text); });
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

    // Preserve abbrevs from previous enrichment
    if (existing[key] && existing[key].abbrevs && existing[key].abbrevs.length > 0) {
      merged[key].abbrevs = existing[key].abbrevs;
    }

    csrcCount++;
  });

  // Then layer in any AI-only terms from the existing glossary
  var aiKept = 0;
  Object.keys(existing).forEach(function (key) {
    var ex = existing[key];
    if (merged[key]) {
      if (ex.src === 'BOTH' || ex.src === 'AI') {
        var aiDefs = ex.defs.filter(function (d) {
          return !merged[key].defs.some(function (md) { return md.t === d.t; });
        });
        if (aiDefs.length > 0) {
          aiDefs.forEach(function (d) { merged[key].defs.push(d); });
          merged[key].src = 'BOTH';
        }
      }
    } else if (ex.src === 'AI' || ex.src === 'BOTH') {
      merged[key] = ex;
      aiKept++;
    }
  });

  console.log('  CSRC terms: ' + csrcCount + ', AI-only preserved: ' + aiKept);

  // Sort and assign IDs
  var terms = Object.values(merged);
  terms.sort(function (a, b) { return a.term.toLowerCase().localeCompare(b.term.toLowerCase()); });
  var idx = 1;
  terms.forEach(function (t) {
    t.id = 'g' + String(idx).padStart(5, '0');
    idx++;
  });

  console.log('  Total merged terms: ' + terms.length);

  // Step 4: Enrich abbreviations for terms with empty definitions
  console.log('\nStep 4: Enriching abbreviation-only terms...');
  await enrichAbbrevs(terms);

  // Step 5: Build career path mappings
  console.log('\nStep 5: Building career path term mappings...');
  var pathMap = buildPathMap(terms);
  var pathCount = Object.keys(pathMap).length;
  console.log('  Mapped ' + pathCount + ' career paths');

  // Step 6: Compare with existing and write if changed
  console.log('\nStep 6: Writing output...');
  var output = { terms: terms, pathMap: pathMap };
  var json = JSON.stringify(output);

  var existingJson = '';
  try { existingJson = fs.readFileSync(GLOSSARY_PATH, 'utf8'); } catch (e) {}

  var changed = json !== existingJson;
  if (changed) {
    fs.writeFileSync(GLOSSARY_PATH, json);
    var sizeMB = (Buffer.byteLength(json) / (1024 * 1024)).toFixed(2);
    console.log('  Glossary updated: ' + terms.length + ' terms (' + sizeMB + ' MB)');
  } else {
    console.log('  No changes detected in glossary data.');
  }

  // Always regenerate meta
  var meta = JSON.stringify({ count: terms.length });
  fs.writeFileSync(META_PATH, meta);
  console.log('  Meta updated: ' + meta);

  cleanup();

  if (changed) {
    console.log('\nDone! Glossary data has been updated.');
    process.exit(0);
  } else {
    console.log('\nDone! No changes needed.');
    process.exit(1);
  }
}

function cleanup() {
  try { fs.unlinkSync(TEMP_ZIP); } catch (e) {}
  try { fs.unlinkSync(TEMP_JSON); } catch (e) {}
}

main().catch(function (err) {
  console.error('Fatal error: ' + err.message);
  cleanup();
  process.exit(2);
});

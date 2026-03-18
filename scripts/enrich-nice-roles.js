#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const CERTS_PATH = path.resolve(__dirname, '..', 'data', 'certs.json');
const ROLES_PATH = path.resolve(__dirname, '..', 'data', 'nice-work-roles.json');

var certs = JSON.parse(fs.readFileSync(CERTS_PATH, 'utf8'));
var roles = JSON.parse(fs.readFileSync(ROLES_PATH, 'utf8'));

// Snapshot existing mappings for regression check
var beforeSnapshot = {};
certs.forEach(function (c) {
  beforeSnapshot[c.id] = (c.niceWorkRoleIds || []).slice().sort().join(',');
});

// ── Mapping rules for orphaned roles ──
// Each rule: { roleId, keywords (match in fullName+description+name), categories, cisspDomains, exactIds }
// A cert matches if ANY condition is met. exactIds are always added regardless.

var mappingRules = [
  {
    roleId: 'OG-WRL-003',
    roleName: 'Cybersecurity Workforce Management',
    keywords: ['workforce', 'human resource', 'staffing', 'talent', 'personnel security'],
    categories: [],
    cisspDomains: [],
    exactIds: ['c23', 'c29', 'c42', 'c97', 'c339']
  },
  {
    roleId: 'OG-WRL-004',
    roleName: 'Cybersecurity Curriculum Development',
    keywords: ['curriculum', 'training program', 'courseware', 'instructional design', 'education'],
    categories: [],
    cisspDomains: [],
    exactIds: ['c29', 'c339', 'c438']
  },
  {
    roleId: 'OG-WRL-005',
    roleName: 'Cybersecurity Instruction',
    keywords: ['trainer', 'instruction', 'teaching', 'educator', 'awareness training'],
    categories: [],
    cisspDomains: [],
    exactIds: ['c29', 'c339', 'c438', 'c373']
  },
  {
    roleId: 'OG-WRL-006',
    roleName: 'Cybersecurity Legal Advice',
    keywords: ['privacy', 'legal', 'regulatory', 'compliance officer', 'data protection', 'gdpr', 'hipaa', 'law'],
    categories: [],
    cisspDomains: [],
    exactIds: ['c114', 'c115', 'c166', 'c195', 'c239', 'c96']
  },
  {
    roleId: 'OG-WRL-007',
    roleName: 'Executive Cybersecurity Leadership',
    keywords: ['chief information', 'executive', 'ciso', 'leadership', 'c-suite', 'strategic leader', 'director', 'management professional', 'board'],
    categories: [],
    cisspDomains: [],
    exactIds: ['c23', 'c29', 'c42', 'c97', 'c69', 'c4', 'c15']
  },
  {
    roleId: 'OG-WRL-009',
    roleName: 'Product Support Management',
    keywords: ['product manag', 'product security', 'product support', 'service management', 'service delivery', 'itil'],
    categories: [],
    cisspDomains: [],
    exactIds: ['c4', 'c69', 'c92', 'c459', 'c22', 'c116']
  },
  {
    roleId: 'OG-WRL-010',
    roleName: 'Program Management',
    keywords: ['program manag', 'portfolio manag', 'project manag', 'pmp', 'pgmp', 'scrum', 'agile'],
    categories: [],
    cisspDomains: [],
    exactIds: ['c15', 'c22', 'c116', 'c142', 'c197']
  },
  {
    roleId: 'OG-WRL-011',
    roleName: 'Secure Project Management',
    keywords: ['project manag', 'secure development lifecycle', 'sdlc', 'scrum', 'agile', 'devops'],
    categories: [],
    cisspDomains: [],
    exactIds: ['c22', 'c116', 'c142', 'c197']
  },
  {
    roleId: 'OG-WRL-012',
    roleName: 'Security Control Assessment',
    keywords: ['control assess', 'security assess', 'audit', 'gap analysis', 'compliance assess', 'authorization', 'fedramp', 'rmf'],
    categories: [],
    cisspDomains: [],
    exactIds: ['c120', 'c122', 'c46', 'c96', 'c29']
  },
  {
    roleId: 'OG-WRL-013',
    roleName: 'Systems Authorization',
    keywords: ['authorization', 'accreditation', 'ato', 'rmf', 'fedramp', 'fisma', 'system security plan', 'security control'],
    categories: [],
    cisspDomains: [],
    exactIds: ['c96', 'c29', 'c120']
  },
  {
    roleId: 'OG-WRL-014',
    roleName: 'Systems Security Management',
    keywords: ['systems security', 'security management', 'information security management', 'isms', 'iso 27001', 'security manager'],
    categories: [],
    cisspDomains: [],
    exactIds: ['c23', 'c29', 'c113', 'c122']
  },
  {
    roleId: 'OG-WRL-015',
    roleName: 'Technology Portfolio Management',
    keywords: ['portfolio', 'technology management', 'enterprise governance', 'it governance', 'cgeit', 'togaf', 'cobit'],
    categories: [],
    cisspDomains: [],
    exactIds: ['c15', 'c69', 'c21', 'c70']
  },
  {
    roleId: 'DD-WRL-002',
    roleName: 'Enterprise Architecture',
    keywords: ['enterprise architect', 'togaf', 'zachman', 'sabsa', 'solution architect', 'security architect', 'architecture framework'],
    categories: ['Security Architecture and Engineering'],
    cisspDomains: [],
    exactIds: ['c3', 'c9', 'c21', 'c36', 'c70', 'c330']
  },
  {
    roleId: 'IO-WRL-001',
    roleName: 'Data Analysis',
    keywords: ['data analy', 'data science', 'analytics', 'osint', 'log analysis', 'siem', 'big data', 'machine learning', 'artificial intelligence'],
    categories: [],
    cisspDomains: [],
    exactIds: ['c362']
  },
  {
    roleId: 'IO-WRL-002',
    roleName: 'Database Administration',
    keywords: ['database', 'data admin', 'sql', 'oracle dba', 'data warehouse', 'data governance'],
    categories: [],
    cisspDomains: [],
    exactIds: ['c548']
  },
  {
    roleId: 'IO-WRL-003',
    roleName: 'Knowledge Management',
    keywords: ['knowledge management', 'information management', 'documentation', 'records management', 'information governance', 'itil', 'service management', 'iso 27001', 'isms'],
    categories: [],
    cisspDomains: [],
    exactIds: ['c4', 'c92', 'c459', 'c113']
  },
  {
    roleId: 'IO-WRL-007',
    roleName: 'Technical Support',
    keywords: ['technical support', 'help desk', 'service desk', 'desktop support', 'end user', 'troubleshoot', 'support technician'],
    categories: [],
    cisspDomains: [],
    exactIds: ['c438', 'c412', 'c459', 'c554', 'c555']
  },
  {
    roleId: 'PD-WRL-005',
    roleName: 'Insider Threat Analysis',
    keywords: ['insider threat', 'insider risk', 'user behavior', 'ueba', 'anomaly detection', 'data loss prevention', 'dlp', 'privilege misuse'],
    categories: [],
    cisspDomains: [],
    exactIds: ['c472', 'c23', 'c29']
  },
  {
    roleId: 'PD-WRL-006',
    roleName: 'Threat Analysis',
    keywords: ['threat intel', 'threat analy', 'cyber threat', 'adversary', 'threat hunt', 'att&ck', 'mitre att', 'malware analy', 'threat landscape', 'threat model'],
    categories: [],
    cisspDomains: [],
    exactIds: ['c33', 'c59', 'c105', 'c182', 'c281']
  }
];

// ── Apply mappings ──

var totalAdded = 0;
var roleResults = {};

mappingRules.forEach(function (rule) {
  var roleId = rule.roleId;
  var matched = new Set(rule.exactIds || []);

  certs.forEach(function (c) {
    if (matched.has(c.id)) return;

    var searchText = ((c.fullName || '') + ' ' + (c.description || '') + ' ' + (c.name || '')).toLowerCase();

    // Keyword match
    var kwMatch = rule.keywords.some(function (kw) {
      return searchText.indexOf(kw.toLowerCase()) !== -1;
    });
    if (kwMatch) { matched.add(c.id); return; }

    // Category match
    if (rule.categories.length > 0) {
      var catMatch = rule.categories.indexOf(c.category) !== -1;
      if (catMatch) { matched.add(c.id); return; }
    }

    // CISSP domain match
    if (rule.cisspDomains && rule.cisspDomains.length > 0 && c.cisspDomains) {
      var domMatch = rule.cisspDomains.some(function (d) {
        return c.cisspDomains.indexOf(d) !== -1;
      });
      if (domMatch) { matched.add(c.id); }
    }
  });

  var addedForRole = 0;
  certs.forEach(function (c) {
    if (!matched.has(c.id)) return;
    if (!c.niceWorkRoleIds) c.niceWorkRoleIds = [];
    if (c.niceWorkRoleIds.indexOf(roleId) === -1) {
      c.niceWorkRoleIds.push(roleId);
      addedForRole++;
    }
  });

  roleResults[roleId] = { name: rule.roleName, matched: matched.size, added: addedForRole };
  totalAdded += addedForRole;
});

// ── Verify no regressions ──

var regressions = 0;
certs.forEach(function (c) {
  var before = beforeSnapshot[c.id] || '';
  var beforeSet = new Set(before ? before.split(',') : []);
  var after = (c.niceWorkRoleIds || []).slice().sort();

  // Every role that was there before must still be there
  beforeSet.forEach(function (roleId) {
    if (roleId && after.indexOf(roleId) === -1) {
      console.error('REGRESSION: ' + c.id + ' lost role ' + roleId);
      regressions++;
    }
  });
});

// ── Save ──

fs.writeFileSync(CERTS_PATH, JSON.stringify(certs, null, 2) + '\n');

// ── Report ──

console.log('========================================');
console.log('   NICE WORK ROLE ENRICHMENT REPORT');
console.log('========================================\n');

Object.keys(roleResults).sort().forEach(function (roleId) {
  var r = roleResults[roleId];
  console.log('  ' + roleId + ' (' + r.name + ')');
  console.log('    Matched certs: ' + r.matched + ', New mappings added: ' + r.added);
});

console.log('\n  Total new role-cert mappings added: ' + totalAdded);
console.log('  Regressions detected: ' + regressions);

// Verify all 19 orphans now have certs
var allRoleIds = roles.map(function (r) { return r.id; });
var certRoleUsage = {};
certs.forEach(function (c) {
  (c.niceWorkRoleIds || []).forEach(function (rid) {
    certRoleUsage[rid] = (certRoleUsage[rid] || 0) + 1;
  });
});

var stillOrphaned = allRoleIds.filter(function (rid) { return !certRoleUsage[rid]; });
console.log('\n  Roles still with zero certs: ' + stillOrphaned.length);
if (stillOrphaned.length > 0) {
  stillOrphaned.forEach(function (rid) {
    var role = roles.find(function (r) { return r.id === rid; });
    console.log('    ' + rid + ': ' + (role ? role.name : '?'));
  });
}

console.log('\n  Final role coverage: ' + Object.keys(certRoleUsage).length + '/' + allRoleIds.length + ' roles have certs');
console.log('\nDone!');

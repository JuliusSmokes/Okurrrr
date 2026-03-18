#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const RESOURCES_PATH = path.resolve(__dirname, '..', 'data', 'free-resources.json');

const newEntries = [
  // ── EFF Resources ──

  {
    name: "EFF Surveillance Self-Defense (SSD)",
    provider: "Electronic Frontier Foundation",
    url: "https://ssd.eff.org/",
    description: "Comprehensive guide to protecting yourself from digital surveillance. Covers threat modeling, secure communication, encrypted messaging, device security, and online privacy across multiple languages.",
    category: "Privacy and Legal",
    tags: ["EFF", "surveillance", "privacy", "encryption", "digital rights"],
    level: "Beginner",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversight and Governance"],
    relatedCertIds: []
  },
  {
    name: "EFF Security Education Companion",
    provider: "Electronic Frontier Foundation",
    url: "https://sec.eff.org/",
    description: "Resource for security trainers with lesson plans, teaching materials, and guides for running digital security workshops. Designed for people who teach others about cybersecurity.",
    category: "Courses",
    tags: ["EFF", "security training", "education", "lesson plans", "awareness"],
    level: "Beginner",
    cisspDomains: ["cissp-d1"],
    niceCategories: ["Oversight and Governance"],
    relatedCertIds: []
  },
  {
    name: "EFF Privacy Badger",
    provider: "Electronic Frontier Foundation",
    url: "https://privacybadger.org/",
    description: "Free browser extension that automatically blocks invisible trackers. Learns to block hidden tracking based on behavior rather than lists, complementing ad blockers.",
    category: "Privacy and Legal",
    tags: ["EFF", "privacy", "browser extension", "tracking", "anti-surveillance"],
    level: "Beginner",
    cisspDomains: ["cissp-d2"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "EFF Certbot (Let's Encrypt Client)",
    provider: "Electronic Frontier Foundation",
    url: "https://certbot.eff.org/",
    description: "Free, open-source tool for automating TLS/SSL certificate deployment via Let's Encrypt. Simplifies HTTPS configuration for web servers with automatic certificate renewal.",
    category: "DevSecOps Tools",
    tags: ["EFF", "TLS", "SSL", "certificates", "Let's Encrypt", "HTTPS"],
    level: "Beginner",
    cisspDomains: ["cissp-d3", "cissp-d4"],
    niceCategories: ["Implementation and Operation"],
    relatedCertIds: []
  },
  {
    name: "EFF Deeplinks Blog",
    provider: "Electronic Frontier Foundation",
    url: "https://www.eff.org/deeplinks",
    description: "Daily analysis of cybersecurity legislation, court rulings, surveillance technology, and digital rights policy from one of the leading digital civil liberties organizations.",
    category: "Community and News",
    tags: ["EFF", "digital rights", "legislation", "policy", "surveillance"],
    level: "Beginner",
    cisspDomains: ["cissp-d1"],
    niceCategories: ["Oversight and Governance"],
    relatedCertIds: []
  },
  {
    name: "EFF Atlas of Surveillance",
    provider: "Electronic Frontier Foundation",
    url: "https://atlasofsurveillance.org/",
    description: "Crowdsourced, searchable database documenting surveillance technologies used by law enforcement agencies across the United States, including drones, facial recognition, and stingrays.",
    category: "Research",
    tags: ["EFF", "surveillance", "law enforcement", "facial recognition", "database"],
    level: "Beginner",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversight and Governance"],
    relatedCertIds: []
  },
  {
    name: "EFF Know Your Rights",
    provider: "Electronic Frontier Foundation",
    url: "https://www.eff.org/issues/know-your-rights",
    description: "Legal guides on digital rights at the U.S. border, interactions with law enforcement regarding electronic devices, and government surveillance protections.",
    category: "Privacy and Legal",
    tags: ["EFF", "legal rights", "border search", "law enforcement", "digital privacy"],
    level: "Beginner",
    cisspDomains: ["cissp-d1"],
    niceCategories: ["Oversight and Governance"],
    relatedCertIds: []
  },
  {
    name: "EFF Street Level Surveillance",
    provider: "Electronic Frontier Foundation",
    url: "https://www.eff.org/issues/street-level-surveillance",
    description: "Comprehensive resource hub covering surveillance technologies including body cameras, automated license plate readers, cell-site simulators, and facial recognition systems.",
    category: "Privacy and Legal",
    tags: ["EFF", "surveillance tech", "ALPR", "stingray", "facial recognition"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversight and Governance"],
    relatedCertIds: []
  },
  {
    name: "EFF Who Has Your Back Report",
    provider: "Electronic Frontier Foundation",
    url: "https://www.eff.org/who-has-your-back",
    description: "Annual report grading major tech companies on their privacy practices, government data-sharing policies, transparency reporting, and user notification of data requests.",
    category: "Research",
    tags: ["EFF", "vendor assessment", "privacy", "transparency", "third-party risk"],
    level: "Beginner",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversight and Governance"],
    relatedCertIds: []
  },
  {
    name: "Let's Encrypt",
    provider: "Internet Security Research Group",
    url: "https://letsencrypt.org/",
    description: "Free, automated, open certificate authority providing TLS certificates to over 300 million websites. Co-founded by EFF to make HTTPS the default for the web.",
    category: "Hardening and Compliance",
    tags: ["TLS", "SSL", "certificate authority", "HTTPS", "free certificates"],
    level: "Beginner",
    cisspDomains: ["cissp-d3", "cissp-d4"],
    niceCategories: ["Implementation and Operation"],
    relatedCertIds: []
  },

  // ── Threat Modeling: Methodologies and Frameworks ──

  {
    name: "OWASP Threat Modeling Guide",
    provider: "OWASP",
    url: "https://owasp.org/www-community/Threat_Modeling",
    description: "Comprehensive guide to threat modeling processes from OWASP, covering STRIDE, PASTA, attack trees, and practical approaches for identifying and mitigating threats during design.",
    category: "Threat Modeling",
    tags: ["OWASP", "STRIDE", "PASTA", "attack trees", "secure design"],
    level: "Beginner",
    cisspDomains: ["cissp-d1", "cissp-d8"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "OWASP Threat Modeling Cheat Sheet",
    provider: "OWASP",
    url: "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html",
    description: "Quick-reference guide for conducting threat modeling sessions, including step-by-step workflows, common pitfalls, and integration with SDLC stages.",
    category: "Threat Modeling",
    tags: ["OWASP", "cheat sheet", "quick reference", "SDLC"],
    level: "Intermediate",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "Threat Modeling Manifesto",
    provider: "Threat Modeling Community",
    url: "https://www.threatmodelingmanifesto.org/",
    description: "Community-driven statement of principles and values for threat modeling, authored and signed by industry leaders. Defines what threat modeling should achieve and common anti-patterns to avoid.",
    category: "Threat Modeling",
    tags: ["manifesto", "principles", "community", "best practices"],
    level: "Beginner",
    cisspDomains: ["cissp-d1", "cissp-d8"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "STRIDE Threat Classification",
    provider: "Microsoft",
    url: "https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool-threats",
    description: "Microsoft's documentation on the STRIDE threat classification model: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege.",
    category: "Threat Modeling",
    tags: ["STRIDE", "Microsoft", "threat classification", "DFD"],
    level: "Beginner",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "LINDDUN Privacy Threat Modeling",
    provider: "KU Leuven",
    url: "https://linddun.org/",
    description: "Privacy-focused threat modeling framework covering Linkability, Identifiability, Non-repudiation, Detectability, Disclosure of information, Unawareness, and Non-compliance.",
    category: "Threat Modeling",
    tags: ["LINDDUN", "privacy", "data protection", "GDPR", "threat framework"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversight and Governance"],
    relatedCertIds: []
  },
  {
    name: "PASTA Threat Modeling Process",
    provider: "VerSprite",
    url: "https://versprite.com/blog/what-is-pasta-threat-modeling/",
    description: "Overview of the Process for Attack Simulation and Threat Analysis (PASTA), a seven-stage risk-centric threat modeling methodology that aligns business objectives with technical requirements.",
    category: "Threat Modeling",
    tags: ["PASTA", "risk-centric", "attack simulation", "methodology"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d6"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "NIST SP 800-154: Guide to Data-Centric Threat Modeling (Draft)",
    provider: "NIST",
    url: "https://csrc.nist.gov/publications/detail/sp/800-154/draft",
    description: "NIST's guide to data-centric system threat modeling, focusing on identifying and mitigating threats to data throughout its lifecycle within information systems.",
    category: "Threat Modeling",
    tags: ["NIST", "data-centric", "threat modeling", "SP 800-154"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "Attack Trees (Bruce Schneier)",
    provider: "Bruce Schneier",
    url: "https://www.schneier.com/academic/archives/1999/12/attack_trees.html",
    description: "Bruce Schneier's foundational 1999 paper on attack trees -- a formal, systematic method for describing and analyzing the security of systems based on possible attack scenarios.",
    category: "Threat Modeling",
    tags: ["attack trees", "Schneier", "formal methods", "threat analysis"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d6"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "SAFECode Tactical Threat Modeling",
    provider: "SAFECode",
    url: "https://safecode.org/resource-secure-development-practices/tactical-threat-modeling/",
    description: "Industry guidance on practical, lightweight threat modeling for development teams. Focuses on integrating threat modeling into agile workflows without excessive ceremony.",
    category: "Threat Modeling",
    tags: ["SAFECode", "tactical", "agile", "lightweight", "SDLC"],
    level: "Intermediate",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },

  // ── Threat Modeling: Tools ──

  {
    name: "Microsoft Threat Modeling Tool",
    provider: "Microsoft",
    url: "https://learn.microsoft.com/en-us/azure/security/develop/threat-modeling-tool",
    description: "Free desktop tool for creating data flow diagram-based threat models with automatic STRIDE threat generation. Includes templates for Azure, web apps, and enterprise systems.",
    category: "Threat Modeling",
    tags: ["Microsoft", "STRIDE", "DFD", "automated", "desktop tool"],
    level: "Beginner",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "OWASP Threat Dragon",
    provider: "OWASP",
    url: "https://owasp.org/www-project-threat-dragon/",
    description: "Free, open-source threat modeling tool providing threat model diagramming and rule-based threat generation. Available as a web app and desktop application.",
    category: "Threat Modeling",
    tags: ["OWASP", "open source", "diagramming", "threat generation"],
    level: "Beginner",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "Threagile",
    provider: "Christian Schneider",
    url: "https://threagile.io/",
    description: "Agile threat modeling as code -- define your architecture in YAML, auto-generate risk reports, data flow diagrams, and security recommendations. Integrates into CI/CD pipelines.",
    category: "Threat Modeling",
    tags: ["threat modeling as code", "YAML", "CI/CD", "agile", "automated"],
    level: "Intermediate",
    cisspDomains: ["cissp-d8", "cissp-d3"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "OWASP pytm",
    provider: "OWASP",
    url: "https://github.com/OWASP/pytm",
    description: "Pythonic framework for threat modeling -- define your system architecture in Python code, automatically generate data flow diagrams, sequence diagrams, and threat lists.",
    category: "Threat Modeling",
    tags: ["OWASP", "Python", "automation", "DFD", "programmatic"],
    level: "Intermediate",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "Deciduous Attack Tree Builder",
    provider: "Kelly Shortridge",
    url: "https://www.deciduous.app/",
    description: "Free browser-based visual attack tree builder. Create and share attack trees with a simple text-based syntax that renders as interactive diagrams. No installation required.",
    category: "Threat Modeling",
    tags: ["attack trees", "visual", "browser-based", "lightweight"],
    level: "Beginner",
    cisspDomains: ["cissp-d1", "cissp-d6"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "IriusRisk Community Edition",
    provider: "IriusRisk",
    url: "https://www.iriusrisk.com/community-edition",
    description: "Free tier of the enterprise threat modeling platform with questionnaire-driven threat identification, component-based modeling, and countermeasure recommendations.",
    category: "Threat Modeling",
    tags: ["enterprise", "questionnaire", "component-based", "countermeasures"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d8"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "CAIRIS",
    provider: "Bournemouth University",
    url: "https://cairis.org/",
    description: "Open-source platform for security, usability, and requirements engineering with built-in threat modeling, attack tree generation, and risk analysis capabilities.",
    category: "Threat Modeling",
    tags: ["open source", "requirements engineering", "risk analysis", "academic"],
    level: "Expert",
    cisspDomains: ["cissp-d1", "cissp-d8"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },

  // ── Threat Modeling: Training ──

  {
    name: "Threat Modeling Resources (Adam Shostack)",
    provider: "Adam Shostack",
    url: "https://shostack.org/resources/threat-modeling",
    description: "Free companion resources from the author of 'Threat Modeling: Designing for Security,' including presentations, worksheets, and links to the Elevation of Privilege card game.",
    category: "Threat Modeling",
    tags: ["Adam Shostack", "training", "worksheets", "presentations"],
    level: "Beginner",
    cisspDomains: ["cissp-d1", "cissp-d8"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "Elevation of Privilege Card Game",
    provider: "Adam Shostack / Microsoft",
    url: "https://github.com/adamshostack/eop",
    description: "Gamified threat modeling through a card game that teaches STRIDE categories via collaborative play. Teams draw cards describing threats and discuss whether they apply to the system under review.",
    category: "Threat Modeling",
    tags: ["card game", "STRIDE", "gamification", "collaborative", "training"],
    level: "Beginner",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "EFF Threat Modeling Guide (Your Security Plan)",
    provider: "Electronic Frontier Foundation",
    url: "https://ssd.eff.org/module/your-security-plan",
    description: "EFF's beginner-friendly introduction to threat modeling for individuals. Teaches how to identify assets, adversaries, threats, and capabilities as the foundation for a personal security plan.",
    category: "Threat Modeling",
    tags: ["EFF", "personal security", "beginner", "threat assessment", "security plan"],
    level: "Beginner",
    cisspDomains: ["cissp-d1"],
    niceCategories: ["Oversight and Governance"],
    relatedCertIds: []
  }
];

console.log('Loading existing resources...');
var resources = JSON.parse(fs.readFileSync(RESOURCES_PATH, 'utf8'));
console.log('  Current count: ' + resources.length);

var existingUrls = new Set();
resources.forEach(function (r) {
  if (r.url) existingUrls.add(r.url.replace(/\/+$/, '').toLowerCase());
});

var added = 0;
var skipped = 0;

newEntries.forEach(function (entry) {
  var normalizedUrl = entry.url.replace(/\/+$/, '').toLowerCase();
  if (existingUrls.has(normalizedUrl)) {
    console.log('  SKIP (duplicate): ' + entry.name);
    skipped++;
    return;
  }
  existingUrls.add(normalizedUrl);
  resources.push(entry);
  added++;
});

resources.forEach(function (r, i) {
  r.id = 'fr' + String(i + 1).padStart(3, '0');
});

fs.writeFileSync(RESOURCES_PATH, JSON.stringify(resources, null, 2) + '\n');

console.log('\nResults:');
console.log('  Added: ' + added);
console.log('  Skipped (duplicate): ' + skipped);
console.log('  New total: ' + resources.length);

var cats = {};
newEntries.forEach(function (e) {
  cats[e.category] = (cats[e.category] || 0) + 1;
});
console.log('\nNew entries by category:');
Object.keys(cats).sort().forEach(function (c) {
  console.log('  ' + c + ': ' + cats[c]);
});

console.log('\nDone!');

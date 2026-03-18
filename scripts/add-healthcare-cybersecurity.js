#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const RESOURCES_PATH = path.resolve(__dirname, '..', 'data', 'free-resources.json');
const CERTS_PATH = path.resolve(__dirname, '..', 'data', 'certs.json');

// ── Part 1: Add Healthcare Cybersecurity resources ──

const newEntries = [
  // Frameworks, Regulations & Guidance

  {
    name: "HHS 405(d) Health Industry Cybersecurity Practices (HICP)",
    provider: "HHS",
    url: "https://405d.hhs.gov/",
    description: "Free, voluntary cybersecurity practices for the healthcare industry developed by HHS and industry experts. Includes tailored guidance for small, medium, and large organizations with specific threat mitigations.",
    category: "Healthcare Cybersecurity",
    tags: ["HHS", "405d", "HICP", "healthcare", "best practices"],
    level: "Beginner",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversight and Governance"],
    relatedCertIds: []
  },
  {
    name: "NIST SP 800-66 Rev. 2: HIPAA Security Rule Implementation Guide",
    provider: "NIST",
    url: "https://csrc.nist.gov/publications/detail/sp/800-66/rev-2/final",
    description: "NIST's definitive guide for implementing the HIPAA Security Rule. Maps HIPAA requirements to NIST Cybersecurity Framework controls with practical implementation guidance for healthcare organizations.",
    category: "Healthcare Cybersecurity",
    tags: ["NIST", "HIPAA", "SP 800-66", "security rule", "implementation"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversight and Governance"],
    relatedCertIds: []
  },
  {
    name: "HITRUST CSF Overview",
    provider: "HITRUST Alliance",
    url: "https://hitrustalliance.net/csf/",
    description: "Overview of the HITRUST Common Security Framework, the most widely adopted security and privacy framework in the U.S. healthcare industry. Integrates HIPAA, NIST, ISO, PCI, and other standards into a single certifiable framework.",
    category: "Healthcare Cybersecurity",
    tags: ["HITRUST", "CSF", "healthcare", "compliance", "framework"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversight and Governance"],
    relatedCertIds: []
  },
  {
    name: "HHS Cybersecurity Performance Goals (CPGs) for Healthcare",
    provider: "HHS",
    url: "https://hphcyber.hhs.gov/performance-goals.html",
    description: "Sector-specific cybersecurity performance goals for healthcare and public health organizations. Defines essential and enhanced goals across access control, asset management, email security, incident response, and more.",
    category: "Healthcare Cybersecurity",
    tags: ["HHS", "CPGs", "performance goals", "healthcare", "baseline"],
    level: "Beginner",
    cisspDomains: ["cissp-d1", "cissp-d7"],
    niceCategories: ["Oversight and Governance"],
    relatedCertIds: []
  },
  {
    name: "FDA Premarket Cybersecurity Guidance for Medical Devices",
    provider: "FDA",
    url: "https://www.fda.gov/regulatory-information/search-fda-guidance-documents/cybersecurity-medical-devices-quality-system-considerations-and-content-premarket-submissions",
    description: "FDA guidance requiring medical device manufacturers to address cybersecurity throughout the product lifecycle. Covers threat modeling, SBOM requirements, vulnerability management, and secure design for connected medical devices.",
    category: "Healthcare Cybersecurity",
    tags: ["FDA", "medical devices", "premarket", "SBOM", "secure design"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d3", "cissp-d8"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "NIST Cybersecurity Framework Healthcare Profile",
    provider: "NIST",
    url: "https://csrc.nist.gov/projects/cybersecurity-framework/nist-cybersecurity-framework-a-quick-start-guide",
    description: "NIST CSF quick-start resources with healthcare sector-specific guidance. Maps the Framework's core functions to healthcare-relevant controls, supporting HIPAA compliance and health sector risk management.",
    category: "Healthcare Cybersecurity",
    tags: ["NIST", "CSF", "healthcare", "framework", "risk management"],
    level: "Beginner",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversight and Governance"],
    relatedCertIds: []
  },
  {
    name: "HIPAA Security Rule Crosswalk to NIST CSF",
    provider: "HHS",
    url: "https://www.hhs.gov/hipaa/for-professionals/security/guidance/cybersecurity/index.html",
    description: "Official HHS crosswalk mapping HIPAA Security Rule requirements to NIST Cybersecurity Framework subcategories. Essential for organizations aligning healthcare compliance with broader cybersecurity standards.",
    category: "Healthcare Cybersecurity",
    tags: ["HIPAA", "NIST CSF", "crosswalk", "compliance mapping", "HHS"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversight and Governance"],
    relatedCertIds: []
  },

  // Threat Intelligence & Coordination

  {
    name: "HHS HC3 – Health Sector Cybersecurity Coordination Center",
    provider: "HHS",
    url: "https://www.hhs.gov/about/agencies/asa/ocio/hc3/index.html",
    description: "HHS's cybersecurity threat intelligence center for the healthcare sector. Publishes analyst notes, threat briefings, vulnerability bulletins, and sector-specific alerts on ransomware, APTs, and emerging threats.",
    category: "Healthcare Cybersecurity",
    tags: ["HC3", "HHS", "threat intelligence", "healthcare", "alerts"],
    level: "Beginner",
    cisspDomains: ["cissp-d1", "cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "Health-ISAC",
    provider: "Health-ISAC",
    url: "https://www.health-isac.org/",
    description: "The healthcare sector's Information Sharing and Analysis Center. Provides threat intelligence sharing, vulnerability alerts, best practice guides, and a community of healthcare security professionals.",
    category: "Healthcare Cybersecurity",
    tags: ["Health-ISAC", "ISAC", "threat sharing", "healthcare", "community"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "CISA Healthcare and Public Health Sector Resources",
    provider: "CISA",
    url: "https://www.cisa.gov/topics/critical-infrastructure-security-and-resilience/critical-infrastructure-sectors/healthcare-and-public-health-sector",
    description: "CISA's dedicated resource hub for healthcare and public health critical infrastructure. Includes sector risk assessments, mitigation guides, incident response support, and vulnerability advisories specific to healthcare.",
    category: "Healthcare Cybersecurity",
    tags: ["CISA", "healthcare", "critical infrastructure", "HPH", "resilience"],
    level: "Beginner",
    cisspDomains: ["cissp-d1", "cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "MITRE Medical Device Cybersecurity Playbook",
    provider: "MITRE",
    url: "https://www.mitre.org/news-insights/publication/medical-device-cybersecurity-regional-incident-preparedness-and-response",
    description: "MITRE's regional incident preparedness and response playbook for medical device cybersecurity. Covers response planning, stakeholder coordination, and recovery procedures for healthcare delivery organizations.",
    category: "Healthcare Cybersecurity",
    tags: ["MITRE", "medical devices", "incident response", "playbook", "healthcare"],
    level: "Intermediate",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },

  // Training & Education

  {
    name: "CISA Healthcare Cybersecurity Toolkit",
    provider: "CISA",
    url: "https://www.cisa.gov/resources-tools/resources/healthcare-and-public-health-hph-cybersecurity-toolkit",
    description: "Free cybersecurity toolkit for healthcare organizations from CISA. Includes risk assessment templates, incident response checklists, staff training materials, and implementation guides tailored to healthcare environments.",
    category: "Healthcare Cybersecurity",
    tags: ["CISA", "toolkit", "healthcare", "training", "risk assessment"],
    level: "Beginner",
    cisspDomains: ["cissp-d1", "cissp-d7"],
    niceCategories: ["Oversight and Governance"],
    relatedCertIds: []
  },
  {
    name: "(ISC)² HCISPP Overview and Study Resources",
    provider: "(ISC)²",
    url: "https://www.isc2.org/certifications/hcispp",
    description: "Overview of the HealthCare Information Security and Privacy Practitioner certification. Includes the exam outline, domain summaries, and free study resources for professionals managing healthcare data security.",
    category: "Healthcare Cybersecurity",
    tags: ["ISC2", "HCISPP", "certification", "healthcare", "privacy"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversight and Governance"],
    relatedCertIds: []
  },
  {
    name: "SANS Health Care Cybersecurity Summit Recordings",
    provider: "SANS Institute",
    url: "https://www.sans.org/cyber-security-summit/archives/healthcare",
    description: "Archived talks from SANS Health Care Cybersecurity Summits. Features expert presentations on healthcare threat landscape, medical device security, incident response in hospitals, and regulatory compliance strategies.",
    category: "Healthcare Cybersecurity",
    tags: ["SANS", "summit", "healthcare", "presentations", "training"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d7"],
    niceCategories: ["Oversight and Governance"],
    relatedCertIds: []
  },
  {
    name: "I Am The Cavalry – Hippocratic Oath for Connected Medical Devices",
    provider: "I Am The Cavalry",
    url: "https://iamthecavalry.org/hippocratic-oath/",
    description: "Grassroots cybersecurity initiative advocating for safety and security in medical devices and healthcare systems. The Hippocratic Oath for Connected Medical Devices outlines five principles for patient safety.",
    category: "Healthcare Cybersecurity",
    tags: ["I Am The Cavalry", "medical devices", "patient safety", "advocacy", "principles"],
    level: "Beginner",
    cisspDomains: ["cissp-d1", "cissp-d3"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },

  // Technical Standards & Medical Device Security

  {
    name: "HL7 FHIR Security and Privacy Module",
    provider: "HL7 International",
    url: "https://hl7.org/fhir/security.html",
    description: "Security guidance for the HL7 FHIR healthcare interoperability standard. Covers authentication, authorization, audit logging, access control, digital signatures, and encryption for healthcare data exchange APIs.",
    category: "Healthcare Cybersecurity",
    tags: ["HL7", "FHIR", "interoperability", "API security", "healthcare data"],
    level: "Intermediate",
    cisspDomains: ["cissp-d3", "cissp-d4"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "OWASP Medical Device Security Guide",
    provider: "OWASP",
    url: "https://owasp.org/www-project-medical-device-security/",
    description: "OWASP project addressing cybersecurity risks in connected medical devices. Covers common attack surfaces, firmware analysis, wireless protocol vulnerabilities, and secure development practices for medical IoT.",
    category: "Healthcare Cybersecurity",
    tags: ["OWASP", "medical devices", "IoMT", "firmware", "attack surface"],
    level: "Intermediate",
    cisspDomains: ["cissp-d3", "cissp-d8"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "CISA Medical Device Cybersecurity Advisories",
    provider: "CISA",
    url: "https://www.cisa.gov/news-events/cybersecurity-advisories?search_api_fulltext=medical&field_advisory_type=All",
    description: "CISA's advisories database filtered for medical device vulnerabilities. Includes ICS-CERT alerts, vulnerability disclosures, and mitigation guidance for healthcare equipment from major manufacturers.",
    category: "Healthcare Cybersecurity",
    tags: ["CISA", "ICS-CERT", "medical devices", "advisories", "vulnerabilities"],
    level: "Intermediate",
    cisspDomains: ["cissp-d6", "cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "NTIA/CISA Healthcare SBOM Proof of Concept",
    provider: "CISA / NTIA",
    url: "https://www.cisa.gov/sbom",
    description: "CISA's Software Bill of Materials initiative with healthcare as a key use case. Includes SBOM format guidance, healthcare PoC results, tooling recommendations, and frameworks for medical device supply chain transparency.",
    category: "Healthcare Cybersecurity",
    tags: ["SBOM", "CISA", "NTIA", "supply chain", "medical devices"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d8"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },

  // Research & Community

  {
    name: "HC3 Analyst Notes and Threat Briefs",
    provider: "HHS HC3",
    url: "https://www.hhs.gov/about/agencies/asa/ocio/hc3/products/index.html",
    description: "Library of HC3 publications including analyst notes on ransomware groups targeting healthcare, vulnerability bulletins for medical systems, sector alerts, and white papers on emerging threats to the health sector.",
    category: "Healthcare Cybersecurity",
    tags: ["HC3", "analyst notes", "threat briefs", "ransomware", "healthcare"],
    level: "Intermediate",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "Archimedes Center for Healthcare and Device Security",
    provider: "University of Michigan",
    url: "https://archimedes.engin.umich.edu/",
    description: "Academic research center focused on healthcare cybersecurity and medical device security. Publishes research on clinical system vulnerabilities, implantable device security, and healthcare network defense.",
    category: "Healthcare Cybersecurity",
    tags: ["academic", "research", "medical devices", "healthcare", "University of Michigan"],
    level: "Expert",
    cisspDomains: ["cissp-d3", "cissp-d8"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "HHS HIPAA Breach Portal (Wall of Shame)",
    provider: "HHS OCR",
    url: "https://ocrportal.hhs.gov/ocr/breach/breach_report.jsf",
    description: "HHS Office for Civil Rights breach reporting portal listing all reported healthcare data breaches affecting 500+ individuals. Invaluable for studying breach trends, attack vectors, and regulatory enforcement patterns in healthcare.",
    category: "Healthcare Cybersecurity",
    tags: ["HHS", "OCR", "breach portal", "HIPAA", "breach notification"],
    level: "Beginner",
    cisspDomains: ["cissp-d1", "cissp-d7"],
    niceCategories: ["Oversight and Governance"],
    relatedCertIds: []
  },
  {
    name: "Cynerio Healthcare Cybersecurity Research",
    provider: "Cynerio",
    url: "https://www.cynerio.com/resources",
    description: "Healthcare IoT security vendor research covering medical device vulnerability trends, clinical network attack patterns, and state of healthcare cybersecurity reports. Free research reports available.",
    category: "Healthcare Cybersecurity",
    tags: ["IoMT", "research", "medical devices", "clinical networks", "reports"],
    level: "Intermediate",
    cisspDomains: ["cissp-d3", "cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "MedCrypt Medical Device Security Resources",
    provider: "MedCrypt",
    url: "https://www.medcrypt.com/resources",
    description: "Medical device cybersecurity company providing free resources on FDA compliance, embedded device encryption, SBOM management, and secure development practices for healthcare technology manufacturers.",
    category: "Healthcare Cybersecurity",
    tags: ["medical devices", "FDA", "encryption", "embedded security", "SBOM"],
    level: "Intermediate",
    cisspDomains: ["cissp-d3", "cissp-d8"],
    niceCategories: ["Design and Development"],
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

console.log('\nFree Resources Results:');
console.log('  Added: ' + added);
console.log('  Skipped (duplicate): ' + skipped);
console.log('  New total: ' + resources.length);

// ── Part 2: Remove duplicate cert c259 ──

console.log('\nFixing duplicate cert...');
var certs = JSON.parse(fs.readFileSync(CERTS_PATH, 'utf8'));
var certsBefore = certs.length;

certs = certs.filter(function (c) {
  return c.id !== 'c259';
});

certs.forEach(function (c, i) {
  c.id = 'c' + (i + 1);
});

fs.writeFileSync(CERTS_PATH, JSON.stringify(certs, null, 2) + '\n');
console.log('  Removed duplicate c259 (C)CSA / Certified HIPAA Security Specialist)');
console.log('  Certs before: ' + certsBefore + ', after: ' + certs.length);

console.log('\nDone!');

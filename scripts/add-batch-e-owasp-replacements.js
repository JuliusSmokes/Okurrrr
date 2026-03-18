#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const RESOURCES_PATH = path.resolve(__dirname, '..', 'data', 'free-resources.json');

const newEntries = [
  // ═══════════════════════════════════════════════
  // OWASP PROJECTS (~20)
  // ═══════════════════════════════════════════════
  {
    name: "OWASP CycloneDX – SBOM Standard",
    provider: "OWASP",
    url: "https://cyclonedx.org/",
    description: "Full-stack Bill of Materials standard supporting software, hardware, ML models, services, and vulnerability disclosure. ECMA-424 standard.",
    category: "Supply Chain Security",
    tags: ["OWASP", "SBOM", "CycloneDX", "supply chain", "standard"],
    level: "Intermediate",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: []
  },
  {
    name: "OWASP DefectDojo – Vulnerability Management",
    provider: "OWASP",
    url: "https://www.defectdojo.org/",
    description: "Open-source vulnerability management platform. Aggregates findings from 150+ security tools, tracks remediation, and measures program maturity.",
    category: "Vulnerability Management",
    tags: ["OWASP", "DefectDojo", "vulnerability management", "aggregation"],
    level: "Intermediate",
    cisspDomains: ["cissp-d6"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "OWASP Dependency-Check",
    provider: "OWASP",
    url: "https://owasp.org/www-project-dependency-check/",
    description: "Software composition analysis tool detecting publicly disclosed vulnerabilities in project dependencies. Supports Java, .NET, Python, Ruby, and Node.",
    category: "Supply Chain Security",
    tags: ["OWASP", "SCA", "dependencies", "CVE", "open source"],
    level: "Intermediate",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: []
  },
  {
    name: "OWASP Dependency-Track",
    provider: "OWASP",
    url: "https://dependencytrack.org/",
    description: "Intelligent component analysis platform consuming SBOMs and identifying risk. Continuous monitoring of software supply chain.",
    category: "Supply Chain Security",
    tags: ["OWASP", "SBOM", "component analysis", "continuous monitoring"],
    level: "Intermediate",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: []
  },
  {
    name: "OWASP Core Rule Set (CRS) for WAF",
    provider: "OWASP",
    url: "https://coreruleset.org/",
    description: "Generic attack detection rules for WAFs (ModSecurity, Coraza, etc.). Protects against SQL injection, XSS, RFI, and other OWASP Top 10 attacks.",
    category: "Application Security",
    tags: ["OWASP", "CRS", "WAF", "detection rules"],
    level: "Intermediate",
    cisspDomains: ["cissp-d4", "cissp-d8"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "OWASP Coraza WAF – Web Application Firewall",
    provider: "OWASP",
    url: "https://coraza.io/",
    description: "Enterprise-grade open-source WAF library. Go-native, ModSecurity-compatible, runs as middleware, sidecar, or standalone proxy.",
    category: "Application Security",
    tags: ["OWASP", "Coraza", "WAF", "Go", "ModSecurity"],
    level: "Intermediate",
    cisspDomains: ["cissp-d4", "cissp-d8"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "OWASP Proactive Controls 2024",
    provider: "OWASP",
    url: "https://owasp.org/www-project-proactive-controls/",
    description: "Top 10 security techniques developers should implement — parameterized queries, output encoding, authentication, access control, and more.",
    category: "Application Security",
    tags: ["OWASP", "proactive", "secure coding", "developers"],
    level: "Beginner",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: []
  },
  {
    name: "OWASP SAMM – Software Assurance Maturity Model",
    provider: "OWASP",
    url: "https://owaspsamm.org/",
    description: "Framework for assessing and improving software security practices. Self-assessment and roadmap tool for AppSec programs.",
    category: "Application Security",
    tags: ["OWASP", "SAMM", "maturity model", "AppSec"],
    level: "Intermediate",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: []
  },
  {
    name: "OWASP Secure Headers Project",
    provider: "OWASP",
    url: "https://owasp.org/www-project-secure-headers/",
    description: "Guidance on HTTP security headers — Content-Security-Policy, HSTS, X-Frame-Options, Permissions-Policy, and more.",
    category: "Application Security",
    tags: ["OWASP", "HTTP headers", "CSP", "HSTS", "hardening"],
    level: "Beginner",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: []
  },
  {
    name: "OWASP Non-Human Identities Top 10",
    provider: "OWASP",
    url: "https://owasp.org/www-project-non-human-identities-top-10/",
    description: "Top 10 risks for service accounts, API keys, tokens, and machine identities — secret sprawl, overprivilege, long-lived credentials.",
    category: "Auth and Identity",
    tags: ["OWASP", "NHI", "service accounts", "API keys", "machine identity"],
    level: "Intermediate",
    cisspDomains: ["cissp-d5"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: []
  },
  {
    name: "OWASP Top 10 for MCP (Model Context Protocol)",
    provider: "OWASP",
    url: "https://owasp.org/www-project-top-10-for-mcp/",
    description: "Security risks specific to Model Context Protocol servers and clients — tool poisoning, excessive permissions, and prompt injection.",
    category: "AI and LLM Security",
    tags: ["OWASP", "MCP", "AI", "LLM", "tool security"],
    level: "Intermediate",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: []
  },
  {
    name: "OWASP Docker Top 10",
    provider: "OWASP",
    url: "https://owasp.org/www-project-docker-top-10/",
    description: "Top 10 security risks in Docker container environments — insecure defaults, secrets management, image verification, and network segmentation.",
    category: "Cloud Security",
    tags: ["OWASP", "Docker", "container", "security", "top 10"],
    level: "Intermediate",
    cisspDomains: ["cissp-d3", "cissp-d8"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: []
  },
  {
    name: "OWASP Code Review Guide",
    provider: "OWASP",
    url: "https://owasp.org/www-project-code-review-guide/",
    description: "Comprehensive guide for security code review — methodology, language-specific pitfalls, and checklists for reviewers.",
    category: "Application Security",
    tags: ["OWASP", "code review", "secure coding", "methodology"],
    level: "Intermediate",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: []
  },
  {
    name: "OWASP Automated Threats to Web Applications",
    provider: "OWASP",
    url: "https://owasp.org/www-project-automated-threats-to-web-applications/",
    description: "Classification of automated attacks — credential stuffing, scalping, scraping, carding, account creation, and ad fraud.",
    category: "Application Security",
    tags: ["OWASP", "bots", "automated threats", "credential stuffing"],
    level: "Intermediate",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "OWASP WrongSecrets – Secret Management Training",
    provider: "OWASP",
    url: "https://owasp.org/www-project-wrongsecrets/",
    description: "Vulnerable-by-design app for learning secret management pitfalls — hardcoded secrets, vault misuse, cloud secrets, and CI/CD exposure.",
    category: "Labs",
    tags: ["OWASP", "secrets", "training", "vulnerable", "CTF"],
    level: "Beginner",
    cisspDomains: ["cissp-d3", "cissp-d5"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: []
  },
  {
    name: "OWASP Security Shepherd",
    provider: "OWASP",
    url: "https://owasp.org/www-project-security-shepherd/",
    description: "Web and mobile application security training platform — CTF-style challenges covering OWASP Top 10 and mobile risks.",
    category: "Labs",
    tags: ["OWASP", "training", "CTF", "mobile", "web security"],
    level: "Beginner",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "OWASP Secure Coding Practices Quick Reference",
    provider: "OWASP",
    url: "https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/",
    description: "Technology-agnostic secure coding checklist — input validation, output encoding, authentication, session management, and error handling.",
    category: "Application Security",
    tags: ["OWASP", "secure coding", "checklist", "quick reference"],
    level: "Beginner",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: []
  },
  {
    name: "OWASP DevSecOps Maturity Model (DSOMM)",
    provider: "OWASP",
    url: "https://dsomm.owasp.org/",
    description: "Maturity model for implementing DevSecOps — dimensions covering build/deployment, culture, information gathering, and test/verification.",
    category: "Application Security",
    tags: ["OWASP", "DevSecOps", "maturity model", "pipeline"],
    level: "Intermediate",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: []
  },
  {
    name: "OWASP Smart Contract Top 10",
    provider: "OWASP",
    url: "https://owasp.org/www-project-smart-contract-top-10/",
    description: "Top 10 vulnerabilities in smart contracts — reentrancy, integer overflow, access control, front-running, and oracle manipulation.",
    category: "Application Security",
    tags: ["OWASP", "smart contract", "blockchain", "Web3", "top 10"],
    level: "Advanced",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: []
  },
  {
    name: "OWASP Top 10 Privacy Risks",
    provider: "OWASP",
    url: "https://owasp.org/www-project-top-10-privacy-risks/",
    description: "Top 10 privacy risks in web applications — data leakage, insufficient consent, non-transparent policies, and collection limitation failures.",
    category: "Privacy and Legal",
    tags: ["OWASP", "privacy", "top 10", "data leakage"],
    level: "Intermediate",
    cisspDomains: ["cissp-d2"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },

  // ═══════════════════════════════════════════════
  // REPLACEMENTS (2)
  // ═══════════════════════════════════════════════
  {
    name: "CAPEv2 – Malware Analysis Sandbox",
    provider: "CAPE Sandbox Project",
    url: "https://github.com/kevoreilly/CAPEv2",
    description: "Advanced malware analysis sandbox (successor to Cuckoo Sandbox). Automated extraction of malware configs, payloads, and shellcode.",
    category: "Digital Forensics",
    tags: ["malware analysis", "sandbox", "CAPEv2", "automated", "open source"],
    level: "Advanced",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Investigate"],
    relatedCertIds: []
  },
  {
    name: "Elastic Detection Rules",
    provider: "Elastic",
    url: "https://github.com/elastic/detection-rules",
    description: "Community-maintained detection rules for Elastic Security — SIEM rules, ML jobs, and threat hunting queries mapped to MITRE ATT&CK.",
    category: "Threat Intelligence",
    tags: ["Elastic", "detection rules", "SIEM", "MITRE ATT&CK", "open source"],
    level: "Intermediate",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  }
];

var normalizeUrl = function (u) { return u.replace(/\/+$/, '').toLowerCase(); };
var resources = JSON.parse(fs.readFileSync(RESOURCES_PATH, 'utf8'));
var existingUrls = new Set(resources.map(function (r) { return normalizeUrl(r.url); }));
var added = 0, skipped = 0;

newEntries.forEach(function (entry) {
  var norm = normalizeUrl(entry.url);
  if (existingUrls.has(norm)) {
    console.log('  SKIP (dup): ' + entry.name);
    skipped++;
    return;
  }
  existingUrls.add(norm);
  resources.push(entry);
  added++;
});

resources.forEach(function (r, i) { r.id = 'fr' + String(i + 1).padStart(3, '0'); });
fs.writeFileSync(RESOURCES_PATH, JSON.stringify(resources, null, 2) + '\n');
console.log('Batch E complete: added ' + added + ', skipped ' + skipped + ', total now ' + resources.length);

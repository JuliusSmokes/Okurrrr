#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const RESOURCES_PATH = path.resolve(__dirname, '..', 'data', 'free-resources.json');

const newEntries = [

  // ══════════════════════════════════════════════════════════════
  // GDPR, CCPA & CYBERSECURITY LAW
  // ══════════════════════════════════════════════════════════════

  { name: "CCPA / CPRA Official Text", provider: "California DOJ", url: "https://oag.ca.gov/privacy/ccpa", description: "Official California Consumer Privacy Act and California Privacy Rights Act text, regulations, FAQs, and enforcement actions from the California Attorney General's office.", category: "Privacy and Legal", tags: ["CCPA", "CPRA", "California", "privacy", "consumer rights"], level: "Intermediate", cisspDomains: ["cissp-d1", "cissp-d2"], niceCategories: ["Oversight and Governance"], relatedCertIds: [] },
  { name: "GDPR Official Text (Intersoft Consulting)", provider: "Intersoft Consulting", url: "https://gdpr-info.eu/", description: "Searchable, cross-referenced version of the complete GDPR text with recitals, articles, and expert commentary. The most user-friendly way to navigate the 99 articles and 173 recitals.", category: "Privacy and Legal", tags: ["GDPR", "EU", "privacy", "data protection", "regulation"], level: "Intermediate", cisspDomains: ["cissp-d1", "cissp-d2"], niceCategories: ["Oversight and Governance"], relatedCertIds: [] },
  { name: "EU ENISA Cybersecurity Guidance", provider: "ENISA", url: "https://www.enisa.europa.eu/publications", description: "EU Agency for Cybersecurity publications covering NIS2 Directive guidance, threat landscapes, supply chain security, cloud security, and incident reporting requirements for EU member states.", category: "Privacy and Legal", tags: ["ENISA", "NIS2", "EU", "cybersecurity", "regulation"], level: "Intermediate", cisspDomains: ["cissp-d1"], niceCategories: ["Oversight and Governance"], relatedCertIds: [] },
  { name: "DOJ Cybercrime Resources", provider: "U.S. Department of Justice", url: "https://www.justice.gov/criminal/criminal-ccips", description: "U.S. DOJ Computer Crime and Intellectual Property Section resources. Covers the Computer Fraud and Abuse Act (CFAA), prosecutorial guidance, case summaries, and digital evidence best practices.", category: "Privacy and Legal", tags: ["DOJ", "CFAA", "cybercrime", "law", "prosecution"], level: "Intermediate", cisspDomains: ["cissp-d1"], niceCategories: ["Oversight and Governance"], relatedCertIds: [] },
  { name: "NIST Privacy Framework", provider: "NIST", url: "https://www.nist.gov/privacy-framework", description: "Voluntary framework for managing privacy risks. Maps to NIST CSF and covers data processing, consent management, and privacy engineering with the Identify-Govern-Control-Communicate-Protect structure.", category: "Privacy and Legal", tags: ["NIST", "privacy", "framework", "risk management", "consent"], level: "Intermediate", cisspDomains: ["cissp-d1", "cissp-d2"], niceCategories: ["Oversight and Governance"], relatedCertIds: [] },

  // ══════════════════════════════════════════════════════════════
  // RISK ANALYSIS (expanded)
  // ══════════════════════════════════════════════════════════════

  { name: "FAIR Institute: Factor Analysis of Information Risk", provider: "FAIR Institute", url: "https://www.fairinstitute.org/", description: "Home of the FAIR model -- the only international standard for quantitative information risk analysis (OpenFAIR). Provides methodology, community resources, and the FAIR-CAM controls analytics model.", category: "Governance and Service Management", tags: ["FAIR", "quantitative risk", "risk analysis", "OpenFAIR", "cyber risk"], level: "Intermediate", cisspDomains: ["cissp-d1"], niceCategories: ["Oversight and Governance"], relatedCertIds: [] },
  { name: "NIST SP 800-30 Rev. 1: Risk Assessment Guide", provider: "NIST", url: "https://csrc.nist.gov/pubs/sp/800/30/r1/final", description: "NIST's guide for conducting risk assessments. Covers threat identification, vulnerability analysis, likelihood determination, impact analysis, and risk determination with qualitative and semi-quantitative approaches.", category: "Governance and Service Management", tags: ["NIST", "risk assessment", "SP 800-30", "threat analysis", "impact"], level: "Intermediate", cisspDomains: ["cissp-d1"], niceCategories: ["Oversight and Governance"], relatedCertIds: [] },
  { name: "RiskLens FAIR Fundamentals Training", provider: "RiskLens", url: "https://www.risklens.com/resource-center", description: "Free resources for learning the FAIR quantitative risk analysis model including webinars, white papers, and case studies on translating cyber risk into financial terms for executive communication.", category: "Governance and Service Management", tags: ["RiskLens", "FAIR", "quantitative risk", "financial impact", "executive"], level: "Intermediate", cisspDomains: ["cissp-d1"], niceCategories: ["Oversight and Governance"], relatedCertIds: [] },

  // ══════════════════════════════════════════════════════════════
  // DATA CLASSIFICATION
  // ══════════════════════════════════════════════════════════════

  { name: "NIST SP 800-60: Guide to Mapping Information Types", provider: "NIST", url: "https://csrc.nist.gov/pubs/sp/800/60/v1/r1/final", description: "NIST guide for mapping information types to security categories. Essential for data classification programs -- provides the taxonomy and methodology for categorizing federal information systems.", category: "Governance and Service Management", tags: ["NIST", "data classification", "information types", "FIPS 199", "categorization"], level: "Intermediate", cisspDomains: ["cissp-d2"], niceCategories: ["Oversight and Governance"], relatedCertIds: [] },

  // ══════════════════════════════════════════════════════════════
  // DIGITAL FORENSICS (expanded)
  // ══════════════════════════════════════════════════════════════

  { name: "NIST SP 800-86: Guide to Integrating Forensic Techniques", provider: "NIST", url: "https://csrc.nist.gov/pubs/sp/800/86/final", description: "NIST guide for incorporating forensic techniques into incident response. Covers data collection from files, OS, network traffic, and applications with chain of custody procedures and legal considerations.", category: "Blue Team and DFIR", tags: ["NIST", "forensics", "chain of custody", "incident response", "SP 800-86"], level: "Intermediate", cisspDomains: ["cissp-d7"], niceCategories: ["Protect and Defend"], relatedCertIds: [] },
  { name: "SANS Digital Forensics and Incident Response Blog", provider: "SANS", url: "https://www.sans.org/blog/?focus-area=digital-forensics", description: "SANS DFIR blog with case studies, tool tutorials, memory forensics techniques, and investigation walkthroughs from certified forensic examiners.", category: "Blue Team and DFIR", tags: ["SANS", "DFIR", "forensics", "blog", "case studies"], level: "Intermediate", cisspDomains: ["cissp-d7"], niceCategories: ["Protect and Defend"], relatedCertIds: [] },
  { name: "Digital Forensics with Kali Linux (Free Resources)", provider: "Kali Linux", url: "https://www.kali.org/tools/#forensics", description: "Kali Linux forensics tool catalog including Autopsy, Binwalk, bulk_extractor, dc3dd, Foremost, Galleta, hashdeep, and volatility. Each tool page includes usage documentation and examples.", category: "Blue Team and DFIR", tags: ["Kali", "forensics tools", "disk forensics", "memory", "evidence"], level: "Intermediate", cisspDomains: ["cissp-d7"], niceCategories: ["Protect and Defend"], relatedCertIds: [] },

  // ══════════════════════════════════════════════════════════════
  // BLOCKCHAIN & DEFI (expanded)
  // ══════════════════════════════════════════════════════════════

  { name: "Ethereum Security Best Practices (ConsenSys)", provider: "ConsenSys", url: "https://consensys.github.io/smart-contract-best-practices/", description: "Comprehensive smart contract security guide covering known attacks (reentrancy, front-running, integer overflow), secure development patterns, tools, and security considerations for Solidity developers.", category: "Courses", tags: ["Ethereum", "smart contracts", "Solidity", "security", "ConsenSys"], level: "Intermediate", cisspDomains: ["cissp-d8"], niceCategories: ["Design and Development"], relatedCertIds: [] },
  { name: "Blockchain Security Database (SlowMist)", provider: "SlowMist", url: "https://hacked.slowmist.io/", description: "Database of blockchain security incidents tracking DeFi hacks, bridge exploits, and smart contract vulnerabilities with loss amounts, attack vectors, and post-mortems.", category: "Research", tags: ["blockchain", "DeFi", "hacks", "security incidents", "database"], level: "Intermediate", cisspDomains: ["cissp-d8"], niceCategories: ["Protect and Defend"], relatedCertIds: [] },

  // ══════════════════════════════════════════════════════════════
  // UNIFIED COMMUNICATIONS & VOIP
  // ══════════════════════════════════════════════════════════════

  { name: "OWASP VoIP Security Testing Guide", provider: "OWASP", url: "https://wiki.owasp.org/index.php/VoIP_Security_Testing_Guide", description: "Guide for testing VoIP infrastructure security covering SIP protocol attacks, RTP interception, toll fraud, eavesdropping, and denial of service against unified communications platforms.", category: "Networking and Infrastructure", tags: ["VoIP", "SIP", "RTP", "unified communications", "telephony"], level: "Intermediate", cisspDomains: ["cissp-d4"], niceCategories: ["Protect and Defend"], relatedCertIds: [] },
  { name: "SRTP: Secure Real-time Transport Protocol (RFC 3711)", provider: "IETF", url: "https://datatracker.ietf.org/doc/html/rfc3711", description: "IETF specification for encrypting voice and video communications. Defines how RTP media streams are secured with confidentiality, authentication, and replay protection.", category: "Networking and Infrastructure", tags: ["SRTP", "VoIP", "encryption", "RFC 3711", "real-time"], level: "Expert", cisspDomains: ["cissp-d3", "cissp-d4"], niceCategories: ["Design and Development"], relatedCertIds: [] },

  // ══════════════════════════════════════════════════════════════
  // PHYSICAL SECURITY
  // ══════════════════════════════════════════════════════════════

  { name: "ASIS Physical Security Professional (PSP) Resources", provider: "ASIS International", url: "https://www.asisonline.org/certification/physical-security-professional-psp/", description: "Overview of the PSP certification and free study resources for physical security professionals. Covers physical security assessment, access control systems, surveillance, and security design.", category: "Hardening and Compliance", tags: ["ASIS", "physical security", "PSP", "access control", "surveillance"], level: "Intermediate", cisspDomains: ["cissp-d3"], niceCategories: ["Implementation and Operation"], relatedCertIds: [] },
  { name: "CISA Physical Security Guidance", provider: "CISA", url: "https://www.cisa.gov/physical-security", description: "CISA's physical security resources including active shooter preparedness, bomb threat guidance, facility security, mail screening, and physical security assessment checklists.", category: "Hardening and Compliance", tags: ["CISA", "physical security", "facility", "assessment", "preparedness"], level: "Beginner", cisspDomains: ["cissp-d3"], niceCategories: ["Oversight and Governance"], relatedCertIds: [] },
  { name: "NIST SP 800-116 Rev. 1: PIV Card for Physical Access", provider: "NIST", url: "https://csrc.nist.gov/pubs/sp/800/116/r1/final", description: "NIST guidelines for using Personal Identity Verification (PIV) credentials for physical access control systems. Covers authentication mechanisms, PACS architecture, and federal facility integration.", category: "Hardening and Compliance", tags: ["NIST", "PIV", "physical access", "smart card", "PACS"], level: "Intermediate", cisspDomains: ["cissp-d3", "cissp-d5"], niceCategories: ["Implementation and Operation"], relatedCertIds: [] },
  { name: "The Open Organisation of Lockpickers (TOOOL)", provider: "TOOOL", url: "https://toool.us/", description: "Nonprofit organization providing education on physical security and lock vulnerabilities. Resources include lockpicking tutorials, physical security assessment techniques, and educational presentations at DEF CON.", category: "Red Team and Adversary Simulation", tags: ["lockpicking", "physical security", "TOOOL", "DEF CON", "bypass"], level: "Beginner", cisspDomains: ["cissp-d3"], niceCategories: ["Protect and Defend"], relatedCertIds: [] },

  // ══════════════════════════════════════════════════════════════
  // AEROSPACE CYBERSECURITY
  // ══════════════════════════════════════════════════════════════

  { name: "NIST SP 800-183: Networks of Things (IoT/Aerospace)", provider: "NIST", url: "https://csrc.nist.gov/pubs/sp/800/183/final", description: "NIST framework for understanding networks of things including aerospace, satellite, and aviation systems. Covers composition patterns, trust relationships, and security considerations for cyber-physical systems.", category: "Networking and Infrastructure", tags: ["NIST", "IoT", "aerospace", "cyber-physical", "SP 800-183"], level: "Expert", cisspDomains: ["cissp-d3", "cissp-d4"], niceCategories: ["Design and Development"], relatedCertIds: [] },
  { name: "Aviation ISAC Resources", provider: "Aviation ISAC", url: "https://www.a-isac.com/", description: "Aviation sector Information Sharing and Analysis Center providing cybersecurity threat intelligence, best practices, and incident coordination for airlines, airports, and aerospace manufacturers.", category: "Community and News", tags: ["A-ISAC", "aviation", "aerospace", "threat intelligence", "ISAC"], level: "Intermediate", cisspDomains: ["cissp-d1", "cissp-d7"], niceCategories: ["Protect and Defend"], relatedCertIds: [] },

  // ══════════════════════════════════════════════════════════════
  // GAMING CONTROL BOARD MICS
  // ══════════════════════════════════════════════════════════════

  { name: "Nevada Gaming Control Board MICS", provider: "Nevada GCB", url: "https://gaming.nv.gov/index.aspx?page=177", description: "Minimum Internal Control Standards for Nevada gaming operations covering IT security, surveillance, access control, and cybersecurity requirements for casinos and gaming technology.", category: "Hardening and Compliance", tags: ["gaming", "MICS", "Nevada", "casino", "compliance"], level: "Expert", cisspDomains: ["cissp-d1", "cissp-d3"], niceCategories: ["Oversight and Governance"], relatedCertIds: [] },

  // ══════════════════════════════════════════════════════════════
  // MACHINE LEARNING SECURITY (expanded)
  // ══════════════════════════════════════════════════════════════

  { name: "Adversarial Robustness Toolbox (ART)", provider: "IBM / LF AI & Data", url: "https://github.com/Trusted-AI/adversarial-robustness-toolbox", description: "Python library for ML security covering adversarial attacks, defenses, robustness verification, and certification. Supports TensorFlow, Keras, PyTorch, and scikit-learn.", category: "DevSecOps Tools", tags: ["ART", "adversarial ML", "robustness", "IBM", "machine learning"], level: "Expert", cisspDomains: ["cissp-d8"], niceCategories: ["Design and Development"], relatedCertIds: [] },
  { name: "MITRE ATLAS: Adversarial Threat Landscape for AI Systems", provider: "MITRE", url: "https://atlas.mitre.org/", description: "Knowledge base of adversary tactics and techniques targeting AI/ML systems. Modeled after ATT&CK, ATLAS covers ML supply chain attacks, model evasion, data poisoning, and AI system exploitation.", category: "Research", tags: ["MITRE", "ATLAS", "AI threats", "adversarial ML", "tactics"], level: "Intermediate", cisspDomains: ["cissp-d1", "cissp-d6"], niceCategories: ["Protect and Defend"], relatedCertIds: [] },

  // ══════════════════════════════════════════════════════════════
  // ROBOTIC PROCESS AUTOMATION
  // ══════════════════════════════════════════════════════════════

  { name: "UiPath Academy (Free RPA Courses)", provider: "UiPath", url: "https://academy.uipath.com/", description: "Free RPA training platform with 150+ courses on robotic process automation. Covers RPA security, credential management, bot governance, and secure automation design for enterprise workflows.", category: "Courses", tags: ["UiPath", "RPA", "automation", "bots", "governance"], level: "Beginner", cisspDomains: ["cissp-d8"], niceCategories: ["Implementation and Operation"], relatedCertIds: [] },

  // ══════════════════════════════════════════════════════════════
  // HYBRID CLOUD & CLOUD NETWORKING
  // ══════════════════════════════════════════════════════════════

  { name: "AWS VPC Documentation", provider: "AWS", url: "https://docs.aws.amazon.com/vpc/", description: "Complete AWS Virtual Private Cloud documentation covering subnets, route tables, security groups, NACLs, VPC peering, transit gateways, PrivateLink, and flow logs for cloud network security.", category: "Cloud Security", tags: ["AWS", "VPC", "networking", "security groups", "NACLs"], level: "Intermediate", cisspDomains: ["cissp-d4"], niceCategories: ["Implementation and Operation"], relatedCertIds: [] },
  { name: "Azure Networking Documentation", provider: "Microsoft", url: "https://learn.microsoft.com/en-us/azure/networking/", description: "Azure networking fundamentals covering VNets, NSGs, Azure Firewall, DDoS Protection, Private Link, ExpressRoute, and network security best practices for hybrid and multi-cloud architectures.", category: "Cloud Security", tags: ["Azure", "networking", "VNet", "NSG", "firewall"], level: "Intermediate", cisspDomains: ["cissp-d4"], niceCategories: ["Implementation and Operation"], relatedCertIds: [] },

  // ══════════════════════════════════════════════════════════════
  // MOBILE DEVICE MANAGEMENT (expanded)
  // ══════════════════════════════════════════════════════════════

  { name: "CIS Benchmarks for Mobile Devices", provider: "Center for Internet Security", url: "https://www.cisecurity.org/cis-benchmarks", description: "Free hardening guides for Apple iOS, Android, and mobile device management platforms. Covers device encryption, app permissions, network configuration, and enterprise mobility security baselines.", category: "Hardening and Compliance", tags: ["CIS", "mobile", "iOS", "Android", "MDM", "hardening"], level: "Intermediate", cisspDomains: ["cissp-d3"], niceCategories: ["Implementation and Operation"], relatedCertIds: [] },

  // ══════════════════════════════════════════════════════════════
  // AWS PAYMENT & ANTIFRAUD
  // ══════════════════════════════════════════════════════════════

  { name: "AWS Fraud Detector", provider: "AWS", url: "https://docs.aws.amazon.com/frauddetector/", description: "Documentation for AWS's ML-powered fraud detection service. Covers online payment fraud, account takeover, fake account creation, and loyalty program abuse detection using custom ML models.", category: "Cloud Security", tags: ["AWS", "fraud detection", "ML", "payments", "anti-fraud"], level: "Intermediate", cisspDomains: ["cissp-d2", "cissp-d8"], niceCategories: ["Implementation and Operation"], relatedCertIds: [] },
  { name: "PCI DSS v4.0 Quick Reference Guide", provider: "PCI SSC", url: "https://www.pcisecuritystandards.org/document_library/", description: "Free resources from the PCI Security Standards Council including the PCI DSS v4.0 quick reference guide, SAQ templates, and payment security guidance for merchants and service providers.", category: "Hardening and Compliance", tags: ["PCI DSS", "payment security", "compliance", "credit card", "v4.0"], level: "Intermediate", cisspDomains: ["cissp-d1", "cissp-d2"], niceCategories: ["Oversight and Governance"], relatedCertIds: [] },

  // ══════════════════════════════════════════════════════════════
  // POLICY AS CODE (expanded)
  // ══════════════════════════════════════════════════════════════

  { name: "Open Policy Agent Documentation", provider: "CNCF", url: "https://www.openpolicyagent.org/docs/latest/", description: "Complete OPA documentation covering the Rego policy language, Kubernetes admission control, API authorization, Terraform policy enforcement, and integration patterns for policy-as-code across the stack.", category: "DevSecOps Tools", tags: ["OPA", "Rego", "policy as code", "Kubernetes", "authorization"], level: "Intermediate", cisspDomains: ["cissp-d3", "cissp-d5"], niceCategories: ["Design and Development"], relatedCertIds: [] },
  { name: "Kyverno: Kubernetes Native Policy Engine", provider: "CNCF", url: "https://kyverno.io/", description: "Kubernetes-native policy engine that validates, mutates, and generates configurations using YAML policies (no Rego needed). Enforce security baselines, image signing, and resource quotas.", category: "DevSecOps Tools", tags: ["Kyverno", "Kubernetes", "policy", "admission control", "YAML"], level: "Intermediate", cisspDomains: ["cissp-d3"], niceCategories: ["Implementation and Operation"], relatedCertIds: [] },

  // ══════════════════════════════════════════════════════════════
  // REMAINING GAPS
  // ══════════════════════════════════════════════════════════════

  { name: "OWASP Internet of Things Security", provider: "OWASP", url: "https://owasp.org/www-project-internet-of-things/", description: "OWASP IoT project covering the IoT attack surface, top 10 IoT vulnerabilities, firmware analysis, and embedded device security testing for connected devices.", category: "Networking and Infrastructure", tags: ["OWASP", "IoT", "embedded", "firmware", "connected devices"], level: "Intermediate", cisspDomains: ["cissp-d3"], niceCategories: ["Design and Development"], relatedCertIds: [] },
  { name: "NIST SP 800-150: Guide to Cyber Threat Information Sharing", provider: "NIST", url: "https://csrc.nist.gov/pubs/sp/800/150/final", description: "NIST guide on sharing cyber threat indicators, defensive measures, and security alerts. Covers STIX/TAXII formats, sharing communities, trust models, and privacy considerations.", category: "Threat Intelligence", tags: ["NIST", "threat sharing", "STIX", "TAXII", "SP 800-150"], level: "Intermediate", cisspDomains: ["cissp-d1", "cissp-d7"], niceCategories: ["Protect and Defend"], relatedCertIds: [] },
  { name: "Enterprise Storage Security (SNIA)", provider: "SNIA", url: "https://www.snia.org/education/what-is-storage-security", description: "Storage Networking Industry Association's education on storage security. Covers SAN/NAS security, encryption at rest, storage access controls, backup security, and data lifecycle protection.", category: "Networking and Infrastructure", tags: ["SNIA", "storage security", "SAN", "NAS", "encryption at rest"], level: "Intermediate", cisspDomains: ["cissp-d2", "cissp-d3"], niceCategories: ["Implementation and Operation"], relatedCertIds: [] }
];

console.log('Loading existing resources...');
var resources = JSON.parse(fs.readFileSync(RESOURCES_PATH, 'utf8'));
console.log('  Current count: ' + resources.length);

var existingUrls = new Set();
resources.forEach(function (r) {
  if (r.url) existingUrls.add(r.url.replace(/\/+$/, '').toLowerCase());
});

var added = 0, skipped = 0;
newEntries.forEach(function (entry) {
  var norm = entry.url.replace(/\/+$/, '').toLowerCase();
  if (existingUrls.has(norm)) { console.log('  SKIP: ' + entry.name); skipped++; return; }
  existingUrls.add(norm);
  resources.push(entry);
  added++;
});

resources.forEach(function (r, i) { r.id = 'fr' + String(i + 1).padStart(3, '0'); });
fs.writeFileSync(RESOURCES_PATH, JSON.stringify(resources, null, 2) + '\n');

console.log('\nBatch 3 Results:');
console.log('  Added: ' + added);
console.log('  Skipped: ' + skipped);
console.log('  New total: ' + resources.length);

var cats = {};
newEntries.forEach(function (e) { cats[e.category] = (cats[e.category] || 0) + 1; });
console.log('\nBy category:');
Object.keys(cats).sort().forEach(function (c) { console.log('  ' + c + ': ' + cats[c]); });

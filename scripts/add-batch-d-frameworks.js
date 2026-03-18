#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const RESOURCES_PATH = path.resolve(__dirname, '..', 'data', 'free-resources.json');

const newEntries = [
  // ═══════════════════════════════════════════════
  // SECURITY & COMPLIANCE FRAMEWORKS (~19)
  // ═══════════════════════════════════════════════
  {
    name: "COBIT 2019 Framework: Introduction & Methodology (Free)",
    provider: "ISACA",
    url: "https://www.isaca.org/resources/cobit",
    description: "IT governance and management framework aligning IT strategy with business goals. Free overview and interactive model available.",
    category: "GRC and Compliance",
    tags: ["COBIT", "governance", "ISACA", "IT management"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "ITIL 4 Foundation Overview (Axelos)",
    provider: "Axelos / PeopleCert",
    url: "https://www.axelos.com/certifications/itil-service-management/itil-4-foundation",
    description: "Overview of ITIL 4 IT service management framework. Free introductory resources covering service value system and guiding principles.",
    category: "GRC and Compliance",
    tags: ["ITIL", "service management", "ITSM", "framework"],
    level: "Beginner",
    cisspDomains: ["cissp-d1"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "SOC 2 Compliance Overview",
    provider: "Vanta",
    url: "https://www.vanta.com/collection/soc-2",
    description: "Comprehensive free guide to SOC 2 compliance covering Trust Services Criteria, audit preparation, controls, and evidence collection.",
    category: "GRC and Compliance",
    tags: ["SOC 2", "audit", "trust services", "compliance"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "PCI DSS v4.0 Standard (PCI SSC)",
    provider: "PCI Security Standards Council",
    url: "https://docs-prv.pcisecuritystandards.org/PCI%20DSS/Standard/PCI-DSS-v4_0.pdf",
    description: "Full text of the PCI Data Security Standard v4.0 — free download covering all 12 requirement families for payment card security.",
    category: "GRC and Compliance",
    tags: ["PCI DSS", "payment security", "standard", "compliance"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d3"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "HIPAA Security Rule (HHS.gov)",
    provider: "U.S. Dept. of Health and Human Services",
    url: "https://www.hhs.gov/hipaa/for-professionals/security/index.html",
    description: "Official HIPAA Security Rule guidance covering administrative, physical, and technical safeguards for electronic protected health information.",
    category: "GRC and Compliance",
    tags: ["HIPAA", "healthcare", "PHI", "security rule"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "FedRAMP Authorization Framework",
    provider: "GSA / FedRAMP PMO",
    url: "https://www.fedramp.gov/program-basics/",
    description: "Federal Risk and Authorization Management Program for standardized cloud security assessment. Free templates, baselines, and guidance.",
    category: "GRC and Compliance",
    tags: ["FedRAMP", "federal", "cloud", "authorization"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d3"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "DISA STIGs – Security Technical Implementation Guides",
    provider: "DISA",
    url: "https://public.cyber.mil/stigs/",
    description: "DoD security configuration standards for operating systems, applications, network devices, and cloud platforms. Freely downloadable.",
    category: "GRC and Compliance",
    tags: ["STIG", "DoD", "hardening", "configuration"],
    level: "Intermediate",
    cisspDomains: ["cissp-d3", "cissp-d6"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "NIST SP 800-160 Vol. 1: Systems Security Engineering",
    provider: "NIST",
    url: "https://csrc.nist.gov/pubs/sp/800/160/v1/r1/final",
    description: "Engineering-driven approach to building trustworthy secure systems. Integrates security into systems engineering lifecycle.",
    category: "GRC and Compliance",
    tags: ["NIST", "systems engineering", "security by design"],
    level: "Advanced",
    cisspDomains: ["cissp-d1", "cissp-d3"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: []
  },
  {
    name: "NIST SP 800-61 Rev. 2: Incident Response Guide",
    provider: "NIST",
    url: "https://csrc.nist.gov/pubs/sp/800/61/r2/final",
    description: "Computer security incident handling guide covering preparation, detection, containment, eradication, recovery, and lessons learned.",
    category: "GRC and Compliance",
    tags: ["NIST", "incident response", "IR", "handling"],
    level: "Intermediate",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "NIST SP 800-53A: Assessing Security Controls",
    provider: "NIST",
    url: "https://csrc.nist.gov/pubs/sp/800/53/a/r5/final",
    description: "Guide for assessing the effectiveness of security and privacy controls in information systems and organizations.",
    category: "GRC and Compliance",
    tags: ["NIST", "assessment", "controls", "audit"],
    level: "Advanced",
    cisspDomains: ["cissp-d1", "cissp-d6"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "CSA Cloud Controls Matrix (CCM)",
    provider: "Cloud Security Alliance",
    url: "https://cloudsecurityalliance.org/research/cloud-controls-matrix",
    description: "Cybersecurity control framework for cloud computing. Maps to ISO 27001, NIST, PCI DSS, and AICPA TSC. Free download.",
    category: "GRC and Compliance",
    tags: ["CSA", "CCM", "cloud", "controls"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d3"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: ["ccsp"]
  },
  {
    name: "CSA STAR Registry",
    provider: "Cloud Security Alliance",
    url: "https://cloudsecurityalliance.org/star",
    description: "Public registry documenting security and privacy controls of cloud providers. Search and compare CSP security postures for free.",
    category: "GRC and Compliance",
    tags: ["CSA", "STAR", "cloud", "transparency"],
    level: "Beginner",
    cisspDomains: ["cissp-d1"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: ["ccsp"]
  },
  {
    name: "CISA Zero Trust Maturity Model v2.0",
    provider: "CISA",
    url: "https://www.cisa.gov/zero-trust-maturity-model",
    description: "Guides federal agencies and enterprises through five pillars of zero trust maturity — identity, devices, networks, apps, and data.",
    category: "GRC and Compliance",
    tags: ["zero trust", "CISA", "maturity model", "federal"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d4"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "DORA – Digital Operational Resilience Act (EU)",
    provider: "European Commission",
    url: "https://www.digital-operational-resilience-act.com/",
    description: "EU regulation for ICT risk management in the financial sector. Covers incident reporting, resilience testing, and third-party oversight.",
    category: "GRC and Compliance",
    tags: ["DORA", "EU", "financial", "resilience", "regulation"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "SOX IT Controls Overview",
    provider: "Linford & Company",
    url: "https://linfordco.com/blog/sox-it-controls/",
    description: "Practical overview of Sarbanes-Oxley IT general controls covering access management, change management, and IT operations.",
    category: "GRC and Compliance",
    tags: ["SOX", "Sarbanes-Oxley", "IT controls", "financial"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "UK Cyber Essentials Scheme",
    provider: "UK NCSC",
    url: "https://www.ncsc.gov.uk/cyberessentials/overview",
    description: "UK government-backed scheme of baseline security controls — firewalls, secure configuration, access control, malware protection, patching.",
    category: "GRC and Compliance",
    tags: ["Cyber Essentials", "UK", "NCSC", "baseline"],
    level: "Beginner",
    cisspDomains: ["cissp-d1"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "ASD Essential Eight Maturity Model",
    provider: "Australian Signals Directorate",
    url: "https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight",
    description: "Australia's prioritized list of mitigation strategies — application control, patching, macro settings, MFA, backups, and more.",
    category: "GRC and Compliance",
    tags: ["Essential Eight", "Australia", "ASD", "mitigation"],
    level: "Beginner",
    cisspDomains: ["cissp-d1"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "SWIFT Customer Security Programme (CSP)",
    provider: "SWIFT",
    url: "https://www.swift.com/myswift/customer-security-programme-csp",
    description: "Mandatory security controls for all institutions on the SWIFT network. Free framework documentation covering 32 controls.",
    category: "GRC and Compliance",
    tags: ["SWIFT", "financial", "CSP", "banking"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "NIST SP 800-124 Rev. 2: Mobile Device Security",
    provider: "NIST",
    url: "https://csrc.nist.gov/pubs/sp/800/124/r2/final",
    description: "Guidelines for managing and securing mobile devices in enterprise environments — MDM, MAM, and mobile threat defense.",
    category: "GRC and Compliance",
    tags: ["NIST", "mobile", "MDM", "BYOD"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d3"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },

  // ═══════════════════════════════════════════════
  // PRIVACY FRAMEWORKS & LAWS (~18)
  // ═══════════════════════════════════════════════
  {
    name: "GDPR Full Text (Official EU)",
    provider: "European Union",
    url: "https://gdpr-info.eu/",
    description: "Searchable full text of the EU General Data Protection Regulation with recitals, chapters, and cross-references.",
    category: "Privacy and Legal",
    tags: ["GDPR", "EU", "data protection", "regulation"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "CCPA / CPRA Official Resources (CA AG)",
    provider: "California Attorney General",
    url: "https://oag.ca.gov/privacy/ccpa",
    description: "Official CCPA/CPRA guidance from the California AG — consumer rights, business obligations, enforcement, and FAQ.",
    category: "Privacy and Legal",
    tags: ["CCPA", "CPRA", "California", "consumer privacy"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "NIST Privacy Framework v1.0",
    provider: "NIST",
    url: "https://www.nist.gov/privacy-framework",
    description: "Voluntary tool for managing privacy risk — Identify, Govern, Control, Communicate, Protect. Maps to NIST CSF and GDPR.",
    category: "Privacy and Legal",
    tags: ["NIST", "privacy", "risk management", "framework"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "ENISA NIS2 Directive Overview",
    provider: "ENISA",
    url: "https://www.enisa.europa.eu/topics/cybersecurity-policy/nis-directive-new",
    description: "EU's updated Network and Information Security directive. Broadened scope, stricter requirements, and supply chain security mandates.",
    category: "Privacy and Legal",
    tags: ["NIS2", "EU", "ENISA", "directive"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "GLBA Safeguards Rule (FTC)",
    provider: "Federal Trade Commission",
    url: "https://www.ftc.gov/legal-library/browse/rules/safeguards-rule",
    description: "Gramm-Leach-Bliley Act Safeguards Rule requiring financial institutions to protect consumer financial information.",
    category: "Privacy and Legal",
    tags: ["GLBA", "financial", "safeguards", "FTC"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "FERPA Guidance (U.S. Dept. of Education)",
    provider: "U.S. Department of Education",
    url: "https://studentprivacy.ed.gov/ferpa",
    description: "Federal Educational Rights and Privacy Act guidance — student record protections, data sharing, and institutional obligations.",
    category: "Privacy and Legal",
    tags: ["FERPA", "education", "student privacy", "federal"],
    level: "Beginner",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "COPPA Rule (FTC)",
    provider: "Federal Trade Commission",
    url: "https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa",
    description: "Children's Online Privacy Protection Act — rules for collecting personal info from children under 13. Parental consent requirements.",
    category: "Privacy and Legal",
    tags: ["COPPA", "children", "privacy", "FTC"],
    level: "Beginner",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "CJIS Security Policy (FBI)",
    provider: "FBI CJIS Division",
    url: "https://www.fbi.gov/how-we-can-help-you/more-fbi-services-and-information/cjis",
    description: "Criminal Justice Information Services security policy — minimum security requirements for accessing FBI criminal justice data.",
    category: "Privacy and Legal",
    tags: ["CJIS", "law enforcement", "FBI", "security policy"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "ISO 27001 Overview & Summary",
    provider: "SecurePrivacy.ai",
    url: "https://secureprivacy.ai/blog/iso-27001-requirements-overview",
    description: "Comprehensive free summary of ISO 27001:2022 requirements — ISMS structure, Annex A controls, and certification process explained.",
    category: "GRC and Compliance",
    tags: ["ISO 27001", "ISMS", "summary", "free"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "ISO 27701 Privacy Information Management Summary",
    provider: "Vanta",
    url: "https://www.vanta.com/resources/iso-27701",
    description: "Free summary of ISO 27701 — extension to ISO 27001 for privacy information management. Covers PIMS requirements and GDPR alignment.",
    category: "Privacy and Legal",
    tags: ["ISO 27701", "privacy", "PIMS", "GDPR"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "ISO 27018 Cloud Privacy Controls Summary",
    provider: "Linford & Company",
    url: "https://linfordco.com/blog/what-is-iso-27018/",
    description: "Free overview of ISO 27018 — code of practice for protecting PII in public cloud acting as PII processor. Maps to ISO 27001.",
    category: "Privacy and Legal",
    tags: ["ISO 27018", "cloud", "PII", "privacy"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "NIST SP 800-188: De-Identifying Government Datasets",
    provider: "NIST",
    url: "https://csrc.nist.gov/pubs/sp/800/188/final",
    description: "Technical guidance on de-identification methods for government data — k-anonymity, differential privacy, and risk assessment.",
    category: "Privacy and Legal",
    tags: ["NIST", "de-identification", "anonymization", "privacy"],
    level: "Advanced",
    cisspDomains: ["cissp-d2"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "Brazil LGPD – General Data Protection Law Overview",
    provider: "IAPP",
    url: "https://iapp.org/resources/article/brazilian-data-protection-law-lgpd-english-translation/",
    description: "English translation and overview of Brazil's LGPD — the GDPR-inspired data protection law covering personal data processing.",
    category: "Privacy and Legal",
    tags: ["LGPD", "Brazil", "data protection", "IAPP"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "India DPDP Act 2023 – Overview",
    provider: "MEITY (India)",
    url: "https://www.meity.gov.in/data-protection-framework",
    description: "India's Digital Personal Data Protection Act covering consent-based processing, data principals' rights, and data fiduciary obligations.",
    category: "Privacy and Legal",
    tags: ["DPDP", "India", "data protection", "consent"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "APEC Cross-Border Privacy Rules (CBPR)",
    provider: "APEC",
    url: "https://www.apec.org/about-us/about-apec/fact-sheets/what-is-the-cross-border-privacy-rules-system",
    description: "Asia-Pacific privacy framework for cross-border data flows. Certification-based system for accountable data transfers.",
    category: "Privacy and Legal",
    tags: ["APEC", "CBPR", "cross-border", "Asia-Pacific"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "OECD Privacy Guidelines (2013 Revision)",
    provider: "OECD",
    url: "https://www.oecd.org/en/topics/sub-issues/privacy-and-personal-data-protection.html",
    description: "Foundational international privacy principles — collection limitation, purpose specification, use limitation, and accountability.",
    category: "Privacy and Legal",
    tags: ["OECD", "privacy principles", "international"],
    level: "Beginner",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "EU-U.S. Data Privacy Framework",
    provider: "International Trade Administration",
    url: "https://www.dataprivacyframework.gov/",
    description: "Official portal for the EU-U.S. Data Privacy Framework — self-certification program enabling lawful transatlantic personal data flows.",
    category: "Privacy and Legal",
    tags: ["EU-US", "data privacy", "adequacy", "transatlantic"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },
  {
    name: "PIPEDA Overview (Canada)",
    provider: "Office of the Privacy Commissioner of Canada",
    url: "https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/",
    description: "Canada's federal private-sector privacy law — 10 fair information principles for collecting, using, and disclosing personal information.",
    category: "Privacy and Legal",
    tags: ["PIPEDA", "Canada", "privacy", "fair information"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d2"],
    niceCategories: ["Oversee and Govern"],
    relatedCertIds: []
  },

  // ═══════════════════════════════════════════════
  // PENTEST FRAMEWORKS (~10)
  // ═══════════════════════════════════════════════
  {
    name: "NIST SP 800-115: Technical Guide to Information Security Testing",
    provider: "NIST",
    url: "https://csrc.nist.gov/pubs/sp/800/115/final",
    description: "NIST guide covering technical security testing — vulnerability scanning, penetration testing, log review, and network sniffing.",
    category: "Red Team and Adversary Simulation",
    tags: ["NIST", "penetration testing", "security testing", "guide"],
    level: "Intermediate",
    cisspDomains: ["cissp-d6"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["oscp"]
  },
  {
    name: "OSSTMM 3 – Open Source Security Testing Methodology",
    provider: "ISECOM",
    url: "https://www.isecom.org/OSSTMM.3.pdf",
    description: "Peer-reviewed methodology for security testing and metrics. Covers human, physical, wireless, telecom, and data network security.",
    category: "Red Team and Adversary Simulation",
    tags: ["OSSTMM", "methodology", "security testing", "metrics"],
    level: "Intermediate",
    cisspDomains: ["cissp-d6"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["oscp"]
  },
  {
    name: "MITRE ATT&CK as a Pentest Framework",
    provider: "MITRE",
    url: "https://attack.mitre.org/resources/getting-started/",
    description: "Getting started guide for using MITRE ATT&CK for adversary emulation, red teaming, gap analysis, and detection engineering.",
    category: "Red Team and Adversary Simulation",
    tags: ["MITRE ATT&CK", "adversary emulation", "TTPs", "framework"],
    level: "Intermediate",
    cisspDomains: ["cissp-d6", "cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "TIBER-EU – Threat Intelligence-Based Ethical Red Teaming",
    provider: "European Central Bank",
    url: "https://www.ecb.europa.eu/paym/cyber-resilience/tiber-eu/html/index.en.html",
    description: "European framework for intelligence-led red team testing of financial institutions. Covers threat intelligence, red team execution, and blue team assessment.",
    category: "Red Team and Adversary Simulation",
    tags: ["TIBER-EU", "red team", "financial", "ECB"],
    level: "Advanced",
    cisspDomains: ["cissp-d6", "cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "CBEST Threat Intelligence-Led Penetration Testing",
    provider: "Bank of England",
    url: "https://www.bankofengland.co.uk/financial-stability/financial-sector-continuity/cbest-threat-intelligence-led-assessments",
    description: "UK framework for intelligence-led penetration testing of financial services. Complements TIBER-EU with UK-specific implementation.",
    category: "Red Team and Adversary Simulation",
    tags: ["CBEST", "UK", "red team", "financial", "Bank of England"],
    level: "Advanced",
    cisspDomains: ["cissp-d6", "cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "CREST Penetration Testing Guide",
    provider: "CREST",
    url: "https://www.crest-approved.org/skills-certifications-careers/crest-penetration-testing/",
    description: "Overview of CREST-accredited penetration testing standards, methodologies, and career paths for professional security testers.",
    category: "Red Team and Adversary Simulation",
    tags: ["CREST", "penetration testing", "accreditation", "career"],
    level: "Intermediate",
    cisspDomains: ["cissp-d6"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["oscp"]
  },
  {
    name: "PCI DSS Penetration Testing Guidance v4.0",
    provider: "PCI Security Standards Council",
    url: "https://docs-prv.pcisecuritystandards.org/Guidance%20Document/Penetration%20Testing/Penetration-Testing-Guidance-v1_1.pdf",
    description: "Detailed guidance on conducting penetration tests that satisfy PCI DSS Requirement 11.4 — scope, methodology, and reporting.",
    category: "Red Team and Adversary Simulation",
    tags: ["PCI DSS", "penetration testing", "guidance", "compliance"],
    level: "Intermediate",
    cisspDomains: ["cissp-d6"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "CISA Red Team Assessment Guide",
    provider: "CISA",
    url: "https://www.cisa.gov/resources-tools/services/red-team-assessments",
    description: "CISA's red team assessment methodology — multi-phase approach simulating real-world adversary TTPs against critical infrastructure.",
    category: "Red Team and Adversary Simulation",
    tags: ["CISA", "red team", "critical infrastructure", "adversary"],
    level: "Advanced",
    cisspDomains: ["cissp-d6", "cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "PTES – Penetration Testing Execution Standard",
    provider: "PTES Org",
    url: "http://www.pentest-standard.org/index.php/Main_Page",
    description: "Comprehensive penetration testing standard covering pre-engagement, intelligence gathering, threat modeling, exploitation, and reporting.",
    category: "Red Team and Adversary Simulation",
    tags: ["PTES", "penetration testing", "standard", "methodology"],
    level: "Intermediate",
    cisspDomains: ["cissp-d6"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["oscp"]
  },
  {
    name: "NIST SP 800-53A Rev. 5: Assessing Security and Privacy Controls",
    provider: "NIST",
    url: "https://csrc.nist.gov/pubs/sp/800/53/a/r5/final",
    description: "Assessment procedures for NIST SP 800-53 controls — methods and objects for evaluating control effectiveness.",
    category: "GRC and Compliance",
    tags: ["NIST", "assessment", "800-53", "controls"],
    level: "Advanced",
    cisspDomains: ["cissp-d1", "cissp-d6"],
    niceCategories: ["Oversee and Govern"],
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
console.log('Batch D complete: added ' + added + ', skipped ' + skipped + ', total now ' + resources.length);

#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const RESOURCES_PATH = path.resolve(__dirname, '..', 'data', 'free-resources.json');

const newEntries = [
  // ── GCP Security & Architecture (10) ──
  {
    name: "Google Cloud Architecture Framework",
    provider: "Google",
    url: "https://cloud.google.com/architecture/framework",
    description: "Google Cloud's comprehensive architecture framework covering system design, operational excellence, security, reliability, and cost optimization.",
    category: "Cloud Security",
    tags: ["GCP", "cloud architecture", "well-architected", "reference architecture"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d3"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: ["google-cloud-sec-eng"]
  },
  {
    name: "Google Cloud Security Best Practices Center",
    provider: "Google",
    url: "https://cloud.google.com/security/best-practices",
    description: "Curated hub of GCP security guides covering identity, data protection, network security, logging, and compliance blueprints.",
    category: "Cloud Security",
    tags: ["GCP", "security best practices", "identity", "data protection"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d3", "cissp-d6"],
    niceCategories: ["Securely Provision", "Protect and Defend"],
    relatedCertIds: ["google-cloud-sec-eng"]
  },
  {
    name: "Google Cloud Security Foundations Blueprint",
    provider: "Google",
    url: "https://cloud.google.com/architecture/security-foundations",
    description: "Opinionated landing-zone blueprint for GCP covering org structure, networking, IAM, logging, and Security Command Center setup.",
    category: "Cloud Security",
    tags: ["GCP", "landing zone", "blueprint", "reference architecture"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d3", "cissp-d4"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: ["google-cloud-sec-eng"]
  },
  {
    name: "Google Cloud Security Command Center Overview",
    provider: "Google",
    url: "https://cloud.google.com/security-command-center/docs/concepts-security-command-center-overview",
    description: "Documentation for GCP's built-in security posture management and threat detection service.",
    category: "Cloud Security",
    tags: ["GCP", "CSPM", "SCC", "threat detection"],
    level: "Intermediate",
    cisspDomains: ["cissp-d6", "cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["google-cloud-sec-eng"]
  },
  {
    name: "Google Cloud Skills Boost – Security Learning Path",
    provider: "Google",
    url: "https://www.cloudskillsboost.google/paths/15",
    description: "Free GCP learning path with hands-on labs covering IAM, VPC security, encryption, and Security Command Center.",
    category: "Cloud Security",
    tags: ["GCP", "training", "labs", "free"],
    level: "Beginner",
    cisspDomains: ["cissp-d1", "cissp-d3"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: ["google-cloud-sec-eng"]
  },
  {
    name: "Google Cybersecurity Certificate (Coursera)",
    provider: "Google / Coursera",
    url: "https://www.coursera.org/professional-certificates/google-cybersecurity",
    description: "Google's entry-level cybersecurity professional certificate covering risk management, networks, Linux, Python, detection, and response. Free to audit.",
    category: "Foundational Cybersecurity",
    tags: ["Google", "certification", "entry-level", "career"],
    level: "Beginner",
    cisspDomains: ["cissp-d1", "cissp-d4", "cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["sec-plus"]
  },
  {
    name: "GCP Reference Architectures Catalog",
    provider: "Google",
    url: "https://cloud.google.com/architecture",
    description: "Full catalog of Google Cloud reference architectures spanning analytics, AI, networking, security, and hybrid cloud.",
    category: "Cloud Security",
    tags: ["GCP", "reference architecture", "catalog"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d3"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: ["google-cloud-sec-eng"]
  },
  {
    name: "Google BeyondCorp Zero Trust Model",
    provider: "Google",
    url: "https://cloud.google.com/beyondcorp",
    description: "Documentation and whitepapers for Google's pioneering BeyondCorp zero trust network access model.",
    category: "Cloud Security",
    tags: ["GCP", "zero trust", "BeyondCorp", "identity-aware proxy"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d4"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: ["google-cloud-sec-eng"]
  },
  {
    name: "GKE Security Best Practices",
    provider: "Google",
    url: "https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster",
    description: "Official GKE cluster hardening guide covering workload identity, network policy, binary authorization, and pod security.",
    category: "Cloud Security",
    tags: ["GCP", "GKE", "Kubernetes", "hardening"],
    level: "Intermediate",
    cisspDomains: ["cissp-d3", "cissp-d7"],
    niceCategories: ["Securely Provision", "Protect and Defend"],
    relatedCertIds: ["google-cloud-sec-eng"]
  },
  {
    name: "Chronicle SIEM / Google SecOps Overview",
    provider: "Google",
    url: "https://cloud.google.com/chronicle/docs/overview",
    description: "Architecture overview of Chronicle (Google SecOps) cloud-native SIEM covering data ingestion, detection rules, and threat intelligence.",
    category: "Cloud Security",
    tags: ["GCP", "Chronicle", "SIEM", "SecOps"],
    level: "Intermediate",
    cisspDomains: ["cissp-d6", "cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["google-cloud-sec-eng"]
  },

  // ── OCI Security & Architecture (8) ──
  {
    name: "Oracle Cloud Infrastructure Security Guide",
    provider: "Oracle",
    url: "https://docs.oracle.com/en-us/iaas/Content/Security/Concepts/security_guide.htm",
    description: "OCI's comprehensive security guide covering IAM, network security, encryption, security zones, and compliance alignment.",
    category: "Cloud Security",
    tags: ["OCI", "Oracle Cloud", "security guide", "IAM"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d3"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: []
  },
  {
    name: "OCI Best Practices Framework",
    provider: "Oracle",
    url: "https://docs.oracle.com/en/solutions/oci-best-practices/",
    description: "Oracle's well-architected best practices spanning security, reliability, performance, and cost optimization for OCI workloads.",
    category: "Cloud Security",
    tags: ["OCI", "well-architected", "best practices", "reference architecture"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d3"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: []
  },
  {
    name: "OCI Reference Architectures",
    provider: "Oracle",
    url: "https://docs.oracle.com/solutions/",
    description: "Oracle's library of reference architectures and solution playbooks for deploying production workloads on OCI.",
    category: "Cloud Security",
    tags: ["OCI", "reference architecture", "solution playbooks"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d3"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: []
  },
  {
    name: "OCI Cloud Guard Overview",
    provider: "Oracle",
    url: "https://docs.oracle.com/en-us/iaas/cloud-guard/home.htm",
    description: "Documentation for OCI Cloud Guard — Oracle's cloud-native security monitoring and automated remediation service.",
    category: "Cloud Security",
    tags: ["OCI", "Cloud Guard", "CSPM", "automated remediation"],
    level: "Intermediate",
    cisspDomains: ["cissp-d6", "cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "OCI Security Zones and Security Advisor",
    provider: "Oracle",
    url: "https://docs.oracle.com/en-us/iaas/security-zone/home.htm",
    description: "Enforces maximum security policies in designated compartments — preventing public buckets, unencrypted databases, and insecure network configs.",
    category: "Cloud Security",
    tags: ["OCI", "security zones", "policy enforcement"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d3"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: []
  },
  {
    name: "OCI Vulnerability Scanning Service",
    provider: "Oracle",
    url: "https://docs.oracle.com/en-us/iaas/scanning/home.htm",
    description: "OCI's native host and container image vulnerability scanning service documentation.",
    category: "Cloud Security",
    tags: ["OCI", "vulnerability scanning", "container security"],
    level: "Intermediate",
    cisspDomains: ["cissp-d6"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "Oracle Cloud Free Tier",
    provider: "Oracle",
    url: "https://www.oracle.com/cloud/free/",
    description: "Always-free OCI tier including 2 compute VMs, 200 GB block storage, autonomous database, and networking — ideal for security labs.",
    category: "Cloud Security",
    tags: ["OCI", "free tier", "labs", "always free"],
    level: "Beginner",
    cisspDomains: ["cissp-d1"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: []
  },
  {
    name: "OCI Foundations Associate Learning Path",
    provider: "Oracle",
    url: "https://mylearn.oracle.com/ou/learning-path/become-an-oci-foundations-associate-2024/135564",
    description: "Free Oracle University learning path covering OCI core services, identity, networking, security, and governance.",
    category: "Cloud Security",
    tags: ["OCI", "training", "certification", "free"],
    level: "Beginner",
    cisspDomains: ["cissp-d1", "cissp-d3"],
    niceCategories: ["Securely Provision"],
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
console.log('Batch A complete: added ' + added + ', skipped ' + skipped + ', total now ' + resources.length);

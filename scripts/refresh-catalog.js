#!/usr/bin/env node
/**
 * Comprehensive Certification Catalog Refresh
 * - Adds status/statusNote fields to all certs
 * - Removes deprecated certs
 * - Marks retiring certs
 * - Adds ~120+ new certifications from 25+ vendors
 */

const fs = require('fs');
const path = require('path');

const certsPath = path.join(__dirname, '..', 'data', 'certs.json');
let certs = JSON.parse(fs.readFileSync(certsPath, 'utf8'));

// ── Phase 1: Add status fields to all existing certs ──
certs.forEach(c => {
  if (!c.status) c.status = 'active';
  if (!('statusNote' in c)) c.statusNote = null;
});

// ── Phase 2: Remove deprecated certs ──
const removeIds = new Set([
  'c111', // MS-100 - Retired Sep 2023
  'c184', // SC-400 - Retired May 2025
  'c88',  // PCNSE - Retired 2025
  'c136', // PCSAE - Retired 2025
  'c137', // PCCSE - Retired 2025
  'c269', // PCDRA - Retired 2025
  'c364', // PCNSA - Retired 2025
  'c447', // PCCET - Retired 2025
  'c234', // HTB CBBH - Retired Oct 2025
]);

const removedCount = certs.filter(c => removeIds.has(c.id)).length;
certs = certs.filter(c => !removeIds.has(c.id));
console.log(`Removed ${removedCount} deprecated certs`);

// ── Phase 3: Mark retiring certs ──
const retiringMap = {
  'c194': { status: 'retiring', statusNote: 'AWS ML Specialty retires Mar 31, 2026; replaced by Generative AI Developer Professional' },
  'c239': { status: 'retiring', statusNote: 'AZ-500 retires Aug 31, 2026' },
};
Object.entries(retiringMap).forEach(([id, updates]) => {
  const c = certs.find(x => x.id === id);
  if (c) { c.status = updates.status; c.statusNote = updates.statusNote; }
});

// ── Phase 4: Add new certifications ──
let nextId = Math.max(...certs.map(c => parseInt(c.id.slice(1)))) + 1;

function addCert(obj) {
  const cert = {
    id: 'c' + nextId++,
    name: obj.name,
    fullName: obj.fullName,
    vendor: obj.vendor,
    description: obj.description,
    url: obj.url,
    category: obj.category,
    level: obj.level,
    niceWorkRoleIds: [],
    costUsd: obj.costUsd || null,
    costNote: obj.costNote || null,
    dod8140: false,
    dodWorkRoleCodes: [],
    status: obj.status || 'active',
    statusNote: obj.statusNote || null,
  };
  certs.push(cert);
  return cert;
}

// ════════════════════════════════════════════════════
// CROWDSTRIKE (7)
// ════════════════════════════════════════════════════
addCert({ name: 'CCFA', fullName: 'CrowdStrike Certified Falcon Administrator', vendor: 'CrowdStrike', description: 'Validates deployment, configuration, and management of the CrowdStrike Falcon platform.', url: 'https://www.crowdstrike.com/en-us/crowdstrike-university/crowdstrike-falcon-certification-program/', category: 'Security Operations', level: 'Intermediate', costUsd: 250 });
addCert({ name: 'CCFR', fullName: 'CrowdStrike Certified Falcon Responder', vendor: 'CrowdStrike', description: 'Validates incident response and threat detection using CrowdStrike Falcon for SOC analysts.', url: 'https://www.crowdstrike.com/en-us/crowdstrike-university/crowdstrike-falcon-certification-program/', category: 'Incident Handling', level: 'Intermediate', costUsd: 250 });
addCert({ name: 'CCFH', fullName: 'CrowdStrike Certified Falcon Hunter', vendor: 'CrowdStrike', description: 'Validates advanced threat hunting, machine timelining, and insider threat investigation skills.', url: 'https://www.crowdstrike.com/en-us/crowdstrike-university/crowdstrike-falcon-certification-program/', category: 'Security Operations', level: 'Expert', costUsd: 250 });
addCert({ name: 'CS-CCSA', fullName: 'CrowdStrike Certified SIEM Analyst', vendor: 'CrowdStrike', description: 'Validates analysis and investigation of detections using Falcon Next-Gen SIEM.', url: 'https://www.crowdstrike.com/en-us/crowdstrike-university/crowdstrike-falcon-certification-program/', category: 'Security Operations', level: 'Intermediate', costUsd: 250 });
addCert({ name: 'CS-CCSE', fullName: 'CrowdStrike Certified SIEM Engineer', vendor: 'CrowdStrike', description: 'Validates implementation and management of Falcon Next-Gen SIEM infrastructure.', url: 'https://www.crowdstrike.com/en-us/crowdstrike-university/crowdstrike-falcon-certification-program/', category: 'Security Architecture and Engineering', level: 'Expert', costUsd: 250 });
addCert({ name: 'CCIS', fullName: 'CrowdStrike Certified Identity Specialist', vendor: 'CrowdStrike', description: 'Validates IAM and identity-based threat analysis within Falcon Identity Protection.', url: 'https://www.crowdstrike.com/en-us/crowdstrike-university/crowdstrike-falcon-certification-program/', category: 'IAM', level: 'Intermediate', costUsd: 250 });
addCert({ name: 'CCCS', fullName: 'CrowdStrike Certified Cloud Specialist', vendor: 'CrowdStrike', description: 'Validates cloud security skills including containers and Kubernetes using Falcon.', url: 'https://www.crowdstrike.com/en-us/crowdstrike-university/crowdstrike-falcon-certification-program/', category: 'Cloud/SysOps', level: 'Intermediate', costUsd: 250 });

// ════════════════════════════════════════════════════
// TRYHACKME (4)
// ════════════════════════════════════════════════════
addCert({ name: 'THM SEC0', fullName: 'TryHackMe Pre Security Certification', vendor: 'TryHackMe', description: 'Entry-level cert proving foundations of computers, networks, and web for cyber learning.', url: 'https://tryhackme.com/certification/pre-security', category: 'Security Operations', level: 'Beginner', costUsd: 188, costNote: '~£149' });
addCert({ name: 'THM SEC1', fullName: 'TryHackMe Cyber Security 101 Certification', vendor: 'TryHackMe', description: 'Foundational hands-on cert for core offensive and defensive cybersecurity skills.', url: 'https://tryhackme.com/certification/cyber-security-101', category: 'Security Operations', level: 'Beginner', costUsd: 188, costNote: '~£149' });
addCert({ name: 'THM SAL1', fullName: 'TryHackMe Security Analyst Level 1', vendor: 'TryHackMe', description: 'Entry-level blue team cert for SOC analysts covering alert triage and incident response.', url: 'https://tryhackme.com/certifications', category: 'Security Operations', level: 'Beginner', costUsd: 349 });
addCert({ name: 'THM PT1', fullName: 'TryHackMe Junior Penetration Tester', vendor: 'TryHackMe', description: 'Entry-level red team cert for web app, network, and Active Directory pentesting.', url: 'https://tryhackme.com/certifications', category: 'Penetration Testing', level: 'Beginner', costUsd: 297 });

// ════════════════════════════════════════════════════
// HACK THE BOX (4 new — CBBH removed above, adding replacements + new)
// ════════════════════════════════════════════════════
addCert({ name: 'HTB CJCA', fullName: 'Hack The Box Certified Junior Cybersecurity Associate', vendor: 'Hack The Box', description: 'Entry-level offensive and defensive assessment skills for enterprise security roles.', url: 'https://academy.hackthebox.com/preview/certifications/htb-certified-junior-cybersecurity-associate', category: 'Security Operations', level: 'Beginner', costUsd: 490 });
addCert({ name: 'HTB CWES', fullName: 'Hack The Box Certified Web Exploitation Specialist', vendor: 'Hack The Box', description: 'Hands-on web app pentesting, bug bounty skills, and risk assessment (replaces CBBH).', url: 'https://academy.hackthebox.com/preview/certifications/htb-certified-web-exploitation-specialist', category: 'Penetration Testing', level: 'Intermediate', costUsd: 490 });
addCert({ name: 'HTB CAPE', fullName: 'Hack The Box Certified Active Directory Pentesting Expert', vendor: 'Hack The Box', description: 'AD pentesting: Kerberos, NTLM, ADCS, trusts, and lateral movement techniques.', url: 'https://academy.hackthebox.com/preview/certifications/htb-certified-active-directory-pentesting-expert', category: 'Penetration Testing', level: 'Expert', costUsd: 1260 });
addCert({ name: 'HTB CWPE', fullName: 'Hack The Box Certified Wi-Fi Pentesting Expert', vendor: 'Hack The Box', description: 'Wireless pentesting: WEP/WPA/WPA2/WPA3, evil twin, captive portals, enterprise Wi-Fi.', url: 'https://academy.hackthebox.com/preview/certifications/htb-certified-wi-fi-pentesting-expert', category: 'Penetration Testing', level: 'Expert', costUsd: 1260 });

// ════════════════════════════════════════════════════
// ORACLE OCI (6)
// ════════════════════════════════════════════════════
addCert({ name: 'OCI Foundations', fullName: 'Oracle Cloud Infrastructure Foundations Associate', vendor: 'Oracle', description: 'Validates fundamental OCI and cloud concepts.', url: 'https://education.oracle.com/oracle-cloud-infrastructure-foundations', category: 'Cloud/SysOps', level: 'Beginner', costUsd: 0, costNote: 'Free' });
addCert({ name: 'OCI Arch Assoc', fullName: 'Oracle Cloud Infrastructure Architect Associate', vendor: 'Oracle', description: 'Validates core OCI services including IAM, networking, compute, and storage.', url: 'https://education.oracle.com/oracle-certification-path/pPillar_640', category: 'Cloud/SysOps', level: 'Intermediate', costUsd: 245 });
addCert({ name: 'OCI Arch Pro', fullName: 'Oracle Cloud Infrastructure Architect Professional', vendor: 'Oracle', description: 'Validates advanced architecture, security, HA/DR, and multicloud design on OCI.', url: 'https://education.oracle.com/oracle-certification-path/pPillar_640', category: 'Cloud/SysOps', level: 'Expert', costUsd: 245 });
addCert({ name: 'OCI Security Pro', fullName: 'Oracle Cloud Infrastructure Security Professional', vendor: 'Oracle', description: 'Validates identity, network security, data protection, and security operations on OCI.', url: 'https://education.oracle.com/oracle-cloud-infrastructure-2025-certified-security-professional', category: 'Security Operations', level: 'Expert', costUsd: 245 });
addCert({ name: 'OCI Net Pro', fullName: 'Oracle Cloud Infrastructure Networking Professional', vendor: 'Oracle', description: 'Validates network design and operations on Oracle Cloud Infrastructure.', url: 'https://education.oracle.com/oracle-certification-path/pPillar_640', category: 'Communication and Network Security', level: 'Expert', costUsd: 245 });
addCert({ name: 'OCI DevOps Pro', fullName: 'Oracle Cloud Infrastructure DevOps Professional', vendor: 'Oracle', description: 'Validates CI/CD, automation, and deployment skills on Oracle Cloud Infrastructure.', url: 'https://education.oracle.com/oracle-certification-path/pPillar_640', category: 'Cloud/SysOps', level: 'Expert', costUsd: 245 });

// ════════════════════════════════════════════════════
// GOOGLE CLOUD (6 new — PCSA, PCSE, ACE already exist)
// ════════════════════════════════════════════════════
addCert({ name: 'GCP CDL', fullName: 'Google Cloud Digital Leader', vendor: 'Google Cloud', description: 'Validates broad knowledge of Google Cloud products and cloud use cases.', url: 'https://cloud.google.com/certification/cloud-digital-leader', category: 'Cloud/SysOps', level: 'Beginner', costUsd: 99 });
addCert({ name: 'Google PSOE', fullName: 'Google Professional Security Operations Engineer', vendor: 'Google Cloud', description: 'Validates detection, monitoring, analysis, and response using Google SecOps and SCC.', url: 'https://cloud.google.com/learn/certification/security-operations-engineer', category: 'Security Operations', level: 'Expert', costUsd: 200 });
addCert({ name: 'Google PCNE', fullName: 'Google Professional Cloud Network Engineer', vendor: 'Google Cloud', description: 'Validates design and management of network architectures on Google Cloud.', url: 'https://cloud.google.com/certification/cloud-network-engineer', category: 'Communication and Network Security', level: 'Expert', costUsd: 200 });
addCert({ name: 'Google PCDO', fullName: 'Google Professional Cloud DevOps Engineer', vendor: 'Google Cloud', description: 'Validates CI/CD, SRE practices, and deployment pipelines on Google Cloud.', url: 'https://cloud.google.com/certification/cloud-devops-engineer', category: 'Cloud/SysOps', level: 'Expert', costUsd: 200 });
addCert({ name: 'Google PCD', fullName: 'Google Professional Cloud Developer', vendor: 'Google Cloud', description: 'Validates building scalable cloud-native applications on Google Cloud.', url: 'https://cloud.google.com/certification/cloud-developer', category: 'Cloud/SysOps', level: 'Expert', costUsd: 200 });
addCert({ name: 'Google PDE', fullName: 'Google Professional Data Engineer', vendor: 'Google Cloud', description: 'Validates design of data processing systems and ML models on Google Cloud.', url: 'https://cloud.google.com/certification/data-engineer', category: 'Cloud/SysOps', level: 'Expert', costUsd: 200 });

// ════════════════════════════════════════════════════
// LINUX FOUNDATION / CNCF (10)
// ════════════════════════════════════════════════════
addCert({ name: 'KCSA', fullName: 'Kubernetes and Cloud Native Security Associate', vendor: 'CNCF / Linux Foundation', description: 'Validates foundational Kubernetes security and cluster hardening knowledge.', url: 'https://training.linuxfoundation.org/certification/kubernetes-and-cloud-native-security-associate-kcsa', category: 'Security Operations', level: 'Beginner', costUsd: 250 });
addCert({ name: 'CNPE', fullName: 'Certified Cloud Native Platform Engineer', vendor: 'CNCF / Linux Foundation', description: 'Validates design, security, and operation of cloud-native platforms.', url: 'https://training.linuxfoundation.org/certification/certified-cloud-native-platform-engineer-cnpe', category: 'Cloud/SysOps', level: 'Intermediate', costUsd: 445 });
addCert({ name: 'CNPA', fullName: 'Cloud Native Platform Engineering Associate', vendor: 'CNCF / Linux Foundation', description: 'Validates platform automation and developer experience fundamentals.', url: 'https://training.linuxfoundation.org/certification/certified-cloud-native-platform-engineering-associate-cnpa', category: 'Cloud/SysOps', level: 'Beginner', costUsd: 250 });
addCert({ name: 'PCA', fullName: 'Prometheus Certified Associate', vendor: 'CNCF / Linux Foundation', description: 'Validates observability and monitoring skills with Prometheus.', url: 'https://training.linuxfoundation.org/certification/prometheus-certified-associate', category: 'Cloud/SysOps', level: 'Beginner', costUsd: 250 });
addCert({ name: 'ICA', fullName: 'Istio Certified Associate', vendor: 'CNCF / Linux Foundation', description: 'Validates service mesh fundamentals and Istio setup and operations.', url: 'https://training.linuxfoundation.org/certification/istio-certified-associate-ica', category: 'Communication and Network Security', level: 'Intermediate', costUsd: 250 });
addCert({ name: 'CCA', fullName: 'Cilium Certified Associate', vendor: 'CNCF / Linux Foundation', description: 'Validates networking, security, and observability skills with Cilium.', url: 'https://training.linuxfoundation.org/certification/cilium-certified-associate-cca', category: 'Communication and Network Security', level: 'Beginner', costUsd: 250 });
addCert({ name: 'KCA', fullName: 'Kyverno Certified Associate', vendor: 'CNCF / Linux Foundation', description: 'Validates policy-based management and security for Kubernetes clusters.', url: 'https://training.linuxfoundation.org/certification/kyverno-certified-associate-kca', category: 'Security Operations', level: 'Beginner', costUsd: 250 });
addCert({ name: 'CAPA', fullName: 'Certified Argo Project Associate', vendor: 'CNCF / Linux Foundation', description: 'Validates Argo CD, Workflows, Events, and Rollouts skills.', url: 'https://training.linuxfoundation.org/certification/certified-argo-project-associate-capa', category: 'Cloud/SysOps', level: 'Beginner', costUsd: 250 });
addCert({ name: 'CGOA', fullName: 'Certified GitOps Associate', vendor: 'CNCF / Linux Foundation', description: 'Validates GitOps principles and managed deployment practices.', url: 'https://training.linuxfoundation.org/certification/certified-gitops-associate-cgoa', category: 'Cloud/SysOps', level: 'Beginner', costUsd: 250 });
addCert({ name: 'CBA', fullName: 'Certified Backstage Associate', vendor: 'CNCF / Linux Foundation', description: 'Validates developer portal skills with Backstage.', url: 'https://training.linuxfoundation.org/certification/certified-backstage-associate-cba', category: 'Cloud/SysOps', level: 'Beginner', costUsd: 250 });

// ════════════════════════════════════════════════════
// NVIDIA (7)
// ════════════════════════════════════════════════════
addCert({ name: 'NCA-AIIO', fullName: 'NVIDIA Certified Associate: AI Infrastructure and Operations', vendor: 'NVIDIA', description: 'Validates foundational AI computing infrastructure and operations knowledge.', url: 'https://www.nvidia.com/en-us/learn/certification/ai-infrastructure-operations-associate/', category: 'Cloud/SysOps', level: 'Beginner', costUsd: 125 });
addCert({ name: 'NCP-AII', fullName: 'NVIDIA Certified Professional: AI Infrastructure', vendor: 'NVIDIA', description: 'Validates deployment, configuration, and validation of advanced NVIDIA AI infrastructure.', url: 'https://www.nvidia.com/en-us/learn/certification/ai-infrastructure-professional/', category: 'Cloud/SysOps', level: 'Expert', costUsd: 400 });
addCert({ name: 'NCP-AIO', fullName: 'NVIDIA Certified Professional: AI Operations', vendor: 'NVIDIA', description: 'Validates monitoring, troubleshooting, and optimization of NVIDIA AI infrastructure.', url: 'https://www.nvidia.com/en-us/learn/certification/ai-operations-professional/', category: 'Cloud/SysOps', level: 'Expert', costUsd: 400 });
addCert({ name: 'NCP-AIN', fullName: 'NVIDIA Certified Professional: AI Networking', vendor: 'NVIDIA', description: 'Validates deployment and configuration using NVIDIA networking technology for AI.', url: 'https://www.nvidia.com/en-us/learn/certification/ai-networking-professional/', category: 'Communication and Network Security', level: 'Expert', costUsd: 400 });
addCert({ name: 'NCA-GENL', fullName: 'NVIDIA Certified Associate: Generative AI LLM', vendor: 'NVIDIA', description: 'Validates foundational knowledge for developing AI apps using generative AI and LLMs.', url: 'https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/', category: 'Software Security', level: 'Beginner', costUsd: 125 });
addCert({ name: 'NCP-GENL', fullName: 'NVIDIA Certified Professional: Generative AI LLMs', vendor: 'NVIDIA', description: 'Validates design, training, and optimization of LLMs using distributed strategies.', url: 'https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-professional/', category: 'Software Security', level: 'Expert', costUsd: 200 });
addCert({ name: 'NCP-AAI', fullName: 'NVIDIA Certified Professional: Agentic AI', vendor: 'NVIDIA', description: 'Validates building and governing agentic AI solutions with multi-agent interaction.', url: 'https://www.nvidia.com/en-us/learn/certification/agentic-ai-professional/', category: 'Software Security', level: 'Expert', costUsd: 200 });

// ════════════════════════════════════════════════════
// HASHICORP (5)
// ════════════════════════════════════════════════════
addCert({ name: 'HC Terraform Assoc', fullName: 'HashiCorp Certified: Terraform Associate', vendor: 'HashiCorp', description: 'Validates foundational Infrastructure as Code and Terraform skills for cloud engineers.', url: 'https://developer.hashicorp.com/certifications/infrastructure-automation', category: 'Cloud/SysOps', level: 'Beginner', costUsd: 70 });
addCert({ name: 'HC Terraform Pro', fullName: 'HashiCorp Terraform Authoring and Operations Professional', vendor: 'HashiCorp', description: 'Validates advanced Terraform configuration, modules, and production operations.', url: 'https://developer.hashicorp.com/certifications/infrastructure-automation', category: 'Cloud/SysOps', level: 'Expert', costUsd: 200 });
addCert({ name: 'HC Vault Assoc', fullName: 'HashiCorp Certified: Vault Associate', vendor: 'HashiCorp', description: 'Validates secrets management, encryption, and access control with HashiCorp Vault.', url: 'https://developer.hashicorp.com/certifications/security-automation', category: 'IAM', level: 'Beginner', costUsd: 70 });
addCert({ name: 'HC Vault Pro', fullName: 'HashiCorp Vault Operations Professional', vendor: 'HashiCorp', description: 'Validates deploying, configuring, and operating Vault in production environments.', url: 'https://developer.hashicorp.com/certifications/security-automation', category: 'IAM', level: 'Expert', costUsd: 200 });
addCert({ name: 'HC Consul Assoc', fullName: 'HashiCorp Certified: Consul Associate', vendor: 'HashiCorp', description: 'Validates service discovery, service mesh, and networking concepts with Consul.', url: 'https://developer.hashicorp.com/certifications/networking-automation', category: 'Communication and Network Security', level: 'Beginner', costUsd: 70 });

// ════════════════════════════════════════════════════
// IBM (6)
// ════════════════════════════════════════════════════
addCert({ name: 'IBM QRadar Analyst', fullName: 'IBM Certified Analyst - Security QRadar SIEM V7.5', vendor: 'IBM', description: 'Validates analyst skills for threat detection and incident response with QRadar SIEM.', url: 'https://www.ibm.com/training/certification/ibm-certified-analyst-security-qradar-siem-v75-C9005200', category: 'Security Operations', level: 'Intermediate', costUsd: 200 });
addCert({ name: 'IBM QRadar Admin', fullName: 'IBM Certified Administrator - Security QRadar SIEM V7.5', vendor: 'IBM', description: 'Validates administration and deployment of IBM QRadar SIEM V7.5.', url: 'https://www.ibm.com/training/certification/ibm-certified-administrator-security-qradar-siem-v75-C9004600', category: 'Security Operations', level: 'Intermediate', costUsd: 200 });
addCert({ name: 'IBM Guardium v11', fullName: 'IBM Certified Administrator - Security Guardium v11.x', vendor: 'IBM', description: 'Validates administration of IBM Guardium Data Protection v11.x.', url: 'https://www.ibm.com/training/certification/ibm-certified-administrator-security-guardium-v11x-C9002402', category: 'GRC', level: 'Intermediate', costUsd: 200 });
addCert({ name: 'IBM Guardium v12', fullName: 'IBM Certified Guardium Data Protection v12.x Administrator Professional', vendor: 'IBM', description: 'Validates professional-level administration of Guardium Data Protection v12.x.', url: 'https://www.ibm.com/training/certification/ibm-certified-guardium-data-protection-v12x-administrator-professional-C9008300', category: 'GRC', level: 'Expert', costUsd: 200 });
addCert({ name: 'IBM Verify Access', fullName: 'IBM Certified Deployment Professional - Security Verify Access V10.0', vendor: 'IBM', description: 'Validates deployment of IBM Verify Access identity and access management platform.', url: 'https://www.ibm.com/training/certification/ibm-certified-deployment-professional-security-verify-access-v100-C4008807', category: 'IAM', level: 'Expert', costUsd: 200 });
addCert({ name: 'IBM Verify SaaS', fullName: 'IBM Verify SaaS v1 Administrator', vendor: 'IBM', description: 'Validates administration of IBM Verify SaaS identity platform.', url: 'https://www.ibm.com/training/security', category: 'IAM', level: 'Intermediate', costUsd: 200 });

// ════════════════════════════════════════════════════
// PALO ALTO NETWORKS (16 new role-based)
// ════════════════════════════════════════════════════
addCert({ name: 'PA Apprentice', fullName: 'Palo Alto Networks Cybersecurity Apprentice', vendor: 'Palo Alto Networks', description: 'Foundational networking and cybersecurity concepts for career starters.', url: 'https://www.paloaltonetworks.com/services/education/certification', category: 'Security Operations', level: 'Beginner', costUsd: 150 });
addCert({ name: 'PA Practitioner', fullName: 'Palo Alto Networks Cybersecurity Practitioner', vendor: 'Palo Alto Networks', description: 'Validates basics of applying Palo Alto Networks portfolio security solutions.', url: 'https://www.paloaltonetworks.com/services/education/certification', category: 'Security Operations', level: 'Beginner', costUsd: 150 });
addCert({ name: 'PCSNP', fullName: 'Palo Alto Networks Network Security Professional', vendor: 'Palo Alto Networks', description: 'Validates network security portfolio and basic NGFW/SASE deployment skills.', url: 'https://www.paloaltonetworks.com/services/education/certification', category: 'Communication and Network Security', level: 'Intermediate', costUsd: 200 });
addCert({ name: 'PCSNA', fullName: 'Palo Alto Networks Network Security Analyst', vendor: 'Palo Alto Networks', description: 'Validates object config, policy creation, and centralized management with Strata.', url: 'https://www.paloaltonetworks.com/services/education/certification', category: 'Communication and Network Security', level: 'Intermediate', costUsd: 200 });
addCert({ name: 'PCSNE', fullName: 'Palo Alto Networks Next-Generation Firewall Engineer', vendor: 'Palo Alto Networks', description: 'Validates NGFW deployment, configuration, automation, and Panorama management.', url: 'https://www.paloaltonetworks.com/services/education/certification', category: 'Communication and Network Security', level: 'Intermediate', costUsd: 200 });
addCert({ name: 'PCSWE', fullName: 'Palo Alto Networks SD-WAN Engineer', vendor: 'Palo Alto Networks', description: 'Validates SD-WAN and SASE deployment and management skills.', url: 'https://www.paloaltonetworks.com/services/education/certification', category: 'Communication and Network Security', level: 'Intermediate', costUsd: 200 });
addCert({ name: 'PCSSE', fullName: 'Palo Alto Networks Security Service Edge Engineer', vendor: 'Palo Alto Networks', description: 'Validates SSE/SASE deployment, operations, and troubleshooting.', url: 'https://www.paloaltonetworks.com/services/education/certification', category: 'Communication and Network Security', level: 'Intermediate', costUsd: 200 });
addCert({ name: 'PA NS Architect', fullName: 'Palo Alto Networks Network Security Architect', vendor: 'Palo Alto Networks', description: 'Validates Zero Trust and network security architecture design skills.', url: 'https://www.paloaltonetworks.com/services/education/certification', category: 'Security Architecture and Engineering', level: 'Expert', costUsd: 250 });
addCert({ name: 'PCSOP', fullName: 'Palo Alto Networks Security Operations Professional', vendor: 'Palo Alto Networks', description: 'Validates Cortex portfolio usage in SOC contexts for detection and response.', url: 'https://www.paloaltonetworks.com/services/education/certification', category: 'Security Operations', level: 'Intermediate', costUsd: 200 });
addCert({ name: 'PCSXA', fullName: 'Palo Alto Networks XSIAM Analyst', vendor: 'Palo Alto Networks', description: 'Validates Cortex XSIAM for automation, detection, and response.', url: 'https://www.paloaltonetworks.com/services/education/certification', category: 'Security Operations', level: 'Intermediate', costUsd: 200 });
addCert({ name: 'PCSXE', fullName: 'Palo Alto Networks XDR Analyst', vendor: 'Palo Alto Networks', description: 'Validates Cortex XDR fundamentals and SOC use.', url: 'https://www.paloaltonetworks.com/services/education/certification', category: 'Security Operations', level: 'Intermediate', costUsd: 200 });
addCert({ name: 'PCSXI-E', fullName: 'Palo Alto Networks XSIAM Engineer', vendor: 'Palo Alto Networks', description: 'Validates Cortex XSIAM deployment, configuration, and playbook development.', url: 'https://www.paloaltonetworks.com/services/education/certification', category: 'Security Operations', level: 'Intermediate', costUsd: 200 });
addCert({ name: 'PCSXD-E', fullName: 'Palo Alto Networks XDR Engineer', vendor: 'Palo Alto Networks', description: 'Validates Cortex XDR deployment, integration, and engineering.', url: 'https://www.paloaltonetworks.com/services/education/certification', category: 'Security Operations', level: 'Intermediate', costUsd: 200 });
addCert({ name: 'PCSOAR', fullName: 'Palo Alto Networks XSOAR Engineer', vendor: 'Palo Alto Networks', description: 'Validates Cortex XSOAR deployment, playbook creation, and automation.', url: 'https://www.paloaltonetworks.com/services/education/certification', category: 'Security Operations', level: 'Intermediate', costUsd: 200 });
addCert({ name: 'PA SOA Architect', fullName: 'Palo Alto Networks Security Operations Architect', vendor: 'Palo Alto Networks', description: 'Validates SecOps architecture and Zero Trust strategy at the enterprise level.', url: 'https://www.paloaltonetworks.com/services/education/certification', category: 'Security Architecture and Engineering', level: 'Expert', costUsd: 250 });
addCert({ name: 'PCCSP', fullName: 'Palo Alto Networks Cloud Security Professional', vendor: 'Palo Alto Networks', description: 'Validates Cortex Cloud runtime, application, and posture security skills.', url: 'https://www.paloaltonetworks.com/services/education/certification', category: 'Cloud/SysOps', level: 'Intermediate', costUsd: 200 });

// ════════════════════════════════════════════════════
// AWS (8 new — CP, SAA, SAP, CSS already exist)
// ════════════════════════════════════════════════════
addCert({ name: 'AWS CloudOps', fullName: 'AWS Certified CloudOps Engineer - Associate', vendor: 'Amazon Web Services', description: 'Validates cloud operations, monitoring, and incident response on AWS.', url: 'https://aws.amazon.com/certification/certified-cloudops-engineer-associate/', category: 'Cloud/SysOps', level: 'Intermediate', costUsd: 150 });
addCert({ name: 'AWS DEA', fullName: 'AWS Certified Data Engineer - Associate', vendor: 'Amazon Web Services', description: 'Validates core data engineering workloads and data pipelines on AWS.', url: 'https://aws.amazon.com/certification/certified-data-engineer-associate/', category: 'Cloud/SysOps', level: 'Intermediate', costUsd: 150 });
addCert({ name: 'AWS MLE', fullName: 'AWS Certified Machine Learning Engineer - Associate', vendor: 'Amazon Web Services', description: 'Validates implementing machine learning workloads on AWS.', url: 'https://aws.amazon.com/certification/certified-machine-learning-engineer-associate/', category: 'Cloud/SysOps', level: 'Intermediate', costUsd: 150 });
addCert({ name: 'AWS AIF', fullName: 'AWS Certified AI Practitioner', vendor: 'Amazon Web Services', description: 'Validates foundational AI/ML and generative AI concepts on AWS.', url: 'https://aws.amazon.com/certification/certified-ai-practitioner/', category: 'Cloud/SysOps', level: 'Beginner', costUsd: 100 });
addCert({ name: 'AWS GenAI Pro', fullName: 'AWS Certified Generative AI Developer - Professional', vendor: 'Amazon Web Services', description: 'Validates deploying and managing generative AI applications in production on AWS.', url: 'https://aws.amazon.com/certification/certified-generative-ai-developer-professional/', category: 'Software Security', level: 'Expert', costUsd: 300 });
addCert({ name: 'AWS DOP', fullName: 'AWS Certified DevOps Engineer - Professional', vendor: 'Amazon Web Services', description: 'Validates DevOps practices for building and operating systems on AWS.', url: 'https://aws.amazon.com/certification/certified-devops-engineer-professional/', category: 'Cloud/SysOps', level: 'Expert', costUsd: 300 });
addCert({ name: 'AWS ANS', fullName: 'AWS Certified Advanced Networking - Specialty', vendor: 'Amazon Web Services', description: 'Validates design and implementation of network solutions on AWS.', url: 'https://aws.amazon.com/certification/certified-advanced-networking-specialty/', category: 'Communication and Network Security', level: 'Expert', costUsd: 300 });
addCert({ name: 'AWS DBS', fullName: 'AWS Certified Database - Specialty', vendor: 'Amazon Web Services', description: 'Validates database design, migration, and management on AWS.', url: 'https://aws.amazon.com/certification/certified-database-specialty/', category: 'Cloud/SysOps', level: 'Expert', costUsd: 300 });

// ════════════════════════════════════════════════════
// MICROSOFT (5 new — AZ-900, AZ-104, AZ-305, AZ-500, SC-100, SC-200, SC-300, SC-900 already exist)
// ════════════════════════════════════════════════════
addCert({ name: 'SC-401', fullName: 'Microsoft Certified: Information Security Administrator Associate', vendor: 'Microsoft', description: 'Validates information protection, DLP, retention, and compliance in M365 and AI services.', url: 'https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/sc-401', category: 'GRC', level: 'Intermediate', costUsd: 165 });
addCert({ name: 'MS-102', fullName: 'Microsoft 365 Certified: Administrator Expert', vendor: 'Microsoft', description: 'Validates managing M365 tenant, Defender XDR, Entra ID, and Purview.', url: 'https://learn.microsoft.com/en-us/credentials/certifications/m365-administrator-expert/', category: 'Security Operations', level: 'Expert', costUsd: 165 });
addCert({ name: 'MS Copilot Admin', fullName: 'Microsoft 365 Certified: Copilot and Agent Administration Fundamentals', vendor: 'Microsoft', description: 'Validates supporting and securing AI-enabled Microsoft 365 environments.', url: 'https://learn.microsoft.com/en-us/credentials/certifications/copilot-and-agent-administration-fundamentals/', category: 'Security Operations', level: 'Beginner', costUsd: 99 });
addCert({ name: 'GitHub AdvSec', fullName: 'GitHub Advanced Security Certification', vendor: 'Microsoft / GitHub', description: 'Validates administration of GitHub Advanced Security features and code scanning.', url: 'https://learn.microsoft.com/en-us/credentials/certifications/github-advanced-security/', category: 'Software Security', level: 'Intermediate', costUsd: 99 });
addCert({ name: 'AZ-220', fullName: 'Microsoft Certified: Azure IoT Developer Specialty', vendor: 'Microsoft', description: 'Validates developing IoT solutions on Azure.', url: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-iot-developer-specialty/', category: 'ICS/IoT', level: 'Intermediate', costUsd: 165 });

// ════════════════════════════════════════════════════
// CISCO (8 new — CCNA, CCT, CCNP Sec/Ent, CCIE Sec/Ent already exist)
// ════════════════════════════════════════════════════
addCert({ name: 'CCST Cyber', fullName: 'Cisco Certified Support Technician - Cybersecurity', vendor: 'Cisco', description: 'Validates entry-level security operations fundamentals for support technicians.', url: 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/support-technician/index.html', category: 'Security Operations', level: 'Beginner', costUsd: 125 });
addCert({ name: 'CCST Net', fullName: 'Cisco Certified Support Technician - Networking', vendor: 'Cisco', description: 'Validates entry-level networking fundamentals for support technicians.', url: 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/support-technician/index.html', category: 'Communication and Network Security', level: 'Beginner', costUsd: 125 });
addCert({ name: 'CCNP Cyber', fullName: 'Cisco Certified Network Professional - Cybersecurity', vendor: 'Cisco', description: 'Validates SOC-focused security operations, forensics, and threat-hunting skills.', url: 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/cybersecurity/ccnp-cybersecurity/index.html', category: 'Security Operations', level: 'Expert', costUsd: 700 });
addCert({ name: 'Cisco SCAZT', fullName: 'Cisco Certified Specialist - Secure Cloud Access', vendor: 'Cisco', description: 'Validates design of secure cloud access for users and endpoints.', url: 'https://www.cisco.com/site/us/en/learn/training-certifications/exams/scazt.html', category: 'Cloud/SysOps', level: 'Intermediate', costUsd: 300 });
addCert({ name: 'Cisco AITECH', fullName: 'Cisco AI Technical Practitioner', vendor: 'Cisco', description: 'Validates AI fundamentals for technical practitioners.', url: 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/ai/technical-practitioner/index.html', category: 'Software Security', level: 'Intermediate', costUsd: 300 });
addCert({ name: 'CCNA Auto', fullName: 'Cisco Certified Network Associate - Automation', vendor: 'Cisco', description: 'Validates network automation using Cisco platforms.', url: 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/automation/ccna-automation/index.html', category: 'Cloud/SysOps', level: 'Intermediate', costUsd: 300 });
addCert({ name: 'CCNP Auto', fullName: 'Cisco Certified Network Professional - Automation', vendor: 'Cisco', description: 'Validates designing, deploying, and managing network automation at scale.', url: 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/automation/ccnp-automation/index.html', category: 'Cloud/SysOps', level: 'Expert', costUsd: 400 });
addCert({ name: 'Cisco SDSI', fullName: 'Cisco Certified Specialist - Designing Security Infrastructure', vendor: 'Cisco', description: 'Validates Cisco security infrastructure design skills.', url: 'https://www.cisco.com/site/us/en/learn/training-certifications/exams/sdsi.html', category: 'Security Architecture and Engineering', level: 'Intermediate', costUsd: 300 });

// ════════════════════════════════════════════════════
// SPLUNK (12)
// ════════════════════════════════════════════════════
addCert({ name: 'Splunk Core User', fullName: 'Splunk Core Certified User', vendor: 'Splunk', description: 'Validates basic Splunk searches, fields, lookups, alerts, and dashboards.', url: 'https://www.splunk.com/en_us/training/certification-track/splunk-core-certified-user.html', category: 'Security Operations', level: 'Beginner', costUsd: 130 });
addCert({ name: 'Splunk Power User', fullName: 'Splunk Core Certified Power User', vendor: 'Splunk', description: 'Validates SPL, knowledge objects, data models, and CIM usage.', url: 'https://www.splunk.com/en_us/training/certification-track/splunk-core-certified-power-user.html', category: 'Security Operations', level: 'Intermediate', costUsd: 130 });
addCert({ name: 'Splunk Adv PU', fullName: 'Splunk Core Certified Advanced Power User', vendor: 'Splunk', description: 'Validates advanced searches, knowledge objects, and dashboard practices.', url: 'https://www.splunk.com/en_us/training/certification-track/splunk-core-certified-advanced-power-user.html', category: 'Security Operations', level: 'Expert', costUsd: 130 });
addCert({ name: 'Splunk Cloud Admin', fullName: 'Splunk Cloud Certified Admin', vendor: 'Splunk', description: 'Validates managing Splunk Cloud, data inputs, forwarders, and users.', url: 'https://www.splunk.com/en_us/training/certification-track/splunk-cloud-certified-admin.html', category: 'Cloud/SysOps', level: 'Intermediate', costUsd: 130 });
addCert({ name: 'Splunk Ent Admin', fullName: 'Splunk Enterprise Certified Admin', vendor: 'Splunk', description: 'Validates license management, indexers, search heads, and data ingest.', url: 'https://www.splunk.com/en_us/training/certification-track/splunk-enterprise-certified-admin.html', category: 'Security Operations', level: 'Intermediate', costUsd: 130 });
addCert({ name: 'Splunk Architect', fullName: 'Splunk Enterprise Certified Architect', vendor: 'Splunk', description: 'Validates distributed deployments, clustering, and sizing skills.', url: 'https://www.splunk.com/en_us/training/certification-track/splunk-enterprise-certified-architect.html', category: 'Security Architecture and Engineering', level: 'Expert', costUsd: 130 });
addCert({ name: 'Splunk Consultant', fullName: 'Splunk Core Certified Consultant', vendor: 'Splunk', description: 'Validates large installation and multi-tier Splunk architecture skills.', url: 'https://www.splunk.com/en_us/training/certification-track/splunk-core-certified-consultant.html', category: 'Security Architecture and Engineering', level: 'Expert', costUsd: 130 });
addCert({ name: 'Splunk SOAR', fullName: 'Splunk SOAR Certified Automation Developer', vendor: 'Splunk', description: 'Validates SOAR development, playbook creation, and integration skills.', url: 'https://www.splunk.com/en_us/training/certification-track/splunk-soar-certified-automation-developer.html', category: 'Security Operations', level: 'Intermediate', costUsd: 130 });
addCert({ name: 'Splunk O11y', fullName: 'Splunk O11y Cloud Certified Metrics User', vendor: 'Splunk', description: 'Validates metrics monitoring, OpenTelemetry, and observability skills.', url: 'https://www.splunk.com/en_us/training/certification-track/splunk-o11y-cloud-certified-metrics-user.html', category: 'Cloud/SysOps', level: 'Intermediate', costUsd: 130 });
addCert({ name: 'Splunk CCDA', fullName: 'Splunk Certified Cybersecurity Defense Analyst', vendor: 'Splunk', description: 'Validates vulnerability and threat defense, monitoring, and SOC analyst skills.', url: 'https://www.splunk.com/en_us/training/certification-track/splunk-certified-cybersecurity-defense-analyst.html', category: 'Security Operations', level: 'Intermediate', costUsd: 130 });
addCert({ name: 'Splunk CCDE', fullName: 'Splunk Certified Cybersecurity Defense Engineer', vendor: 'Splunk', description: 'Validates SOAR automation, threat intelligence, and detection tuning skills.', url: 'https://www.splunk.com/en_us/training/certification-track/splunk-certified-cybersecurity-defense-engineer.html', category: 'Security Operations', level: 'Expert', costUsd: 130 });
addCert({ name: 'Splunk ITSI', fullName: 'Splunk IT Service Intelligence Certified Admin', vendor: 'Splunk', description: 'Validates ITSI architecture, deployment, glass tables, and deep dives.', url: 'https://www.splunk.com/en_us/training/certification-track/splunk-itsi-certified-admin.html', category: 'Cloud/SysOps', level: 'Intermediate', costUsd: 130 });

// ════════════════════════════════════════════════════
// WIZ (2)
// ════════════════════════════════════════════════════
addCert({ name: 'Wiz Cloud', fullName: 'Wiz Certified Cloud Fundamentals', vendor: 'Wiz', description: 'Validates deployment and management of Wiz Cloud for CSPM, CNAPP, and compliance.', url: 'https://wiz.io/wiz-certified/cloud-fundamentals-exam', category: 'Cloud/SysOps', level: 'Beginner', costUsd: 150 });
addCert({ name: 'Wiz Defend', fullName: 'Wiz Certified Defend Fundamentals', vendor: 'Wiz', description: 'Validates deployment and use of Wiz Defend for cloud threat detection and response.', url: 'https://wiz.io/wiz-certified/wiz-certified-defend-fundamentals-exam', category: 'Security Operations', level: 'Beginner', costUsd: 150 });

// ════════════════════════════════════════════════════
// DATABRICKS (5)
// ════════════════════════════════════════════════════
addCert({ name: 'DB DEA', fullName: 'Databricks Certified Data Engineer Associate', vendor: 'Databricks', description: 'Validates introductory data engineering on the Databricks Lakehouse platform.', url: 'https://databricks.com/learn/certification/data-engineer-associate', category: 'Cloud/SysOps', level: 'Beginner', costUsd: 200 });
addCert({ name: 'DB DEP', fullName: 'Databricks Certified Data Engineer Professional', vendor: 'Databricks', description: 'Validates advanced production data engineering solutions on Databricks.', url: 'https://databricks.com/learn/certification/data-engineer-professional', category: 'Cloud/SysOps', level: 'Expert', costUsd: 200 });
addCert({ name: 'DB GenAI', fullName: 'Databricks Certified Generative AI Engineer Associate', vendor: 'Databricks', description: 'Validates design and implementation of LLM-enabled solutions on Databricks.', url: 'https://databricks.com/learn/certification/genai-engineer-associate', category: 'Software Security', level: 'Beginner', costUsd: 200 });
addCert({ name: 'DB MLP', fullName: 'Databricks Certified Machine Learning Professional', vendor: 'Databricks', description: 'Validates enterprise-scale ML solutions with MLOps and Model Serving.', url: 'https://databricks.com/learn/certification/machine-learning-professional', category: 'Cloud/SysOps', level: 'Expert', costUsd: 200 });
addCert({ name: 'DB Platform Admin', fullName: 'Databricks Platform Administrator Accreditation', vendor: 'Databricks', description: 'Validates administration of Lakehouse Platform with Unity Catalog.', url: 'https://databricks.com/learn/certification/platform-administrator-accreditation', category: 'Cloud/SysOps', level: 'Intermediate', costUsd: 0, costNote: 'Free for Databricks customers/partners' });

// ════════════════════════════════════════════════════
// SNOWFLAKE (5 security-relevant)
// ════════════════════════════════════════════════════
addCert({ name: 'SnowPro Assoc', fullName: 'SnowPro Associate: Platform Certification', vendor: 'Snowflake', description: 'Validates introductory Snowflake platform skills and concepts.', url: 'https://learn.snowflake.com/en/certifications/snowpro-platform/', category: 'Cloud/SysOps', level: 'Beginner', costUsd: 100 });
addCert({ name: 'SnowPro Core', fullName: 'SnowPro Core Certification', vendor: 'Snowflake', description: 'Validates practical expertise in implementing Snowflake AI Data Cloud.', url: 'https://learn.snowflake.com/en/certifications/snowpro-core-c03/', category: 'Cloud/SysOps', level: 'Intermediate', costUsd: 175 });
addCert({ name: 'SnowPro Adv Sec', fullName: 'SnowPro Advanced: Security Engineer', vendor: 'Snowflake', description: 'Validates advanced data security, governance, and access control on Snowflake.', url: 'https://learn.snowflake.com/en/certifications/snowpro-advanced-securityengineer/', category: 'IAM', level: 'Expert', costUsd: 375 });
addCert({ name: 'SnowPro Adv Arch', fullName: 'SnowPro Advanced: Architect', vendor: 'Snowflake', description: 'Validates role-based architect skills for Snowflake solution design.', url: 'https://learn.snowflake.com/en/certifications/snowpro-advanced-architect', category: 'Security Architecture and Engineering', level: 'Expert', costUsd: 375 });
addCert({ name: 'SnowPro Adv Admin', fullName: 'SnowPro Advanced: Administrator', vendor: 'Snowflake', description: 'Validates account administration, security, governance, and monitoring on Snowflake.', url: 'https://learn.snowflake.com/en/certifications/snowpro-advanced-administrator-c02/', category: 'Cloud/SysOps', level: 'Expert', costUsd: 375 });

// ════════════════════════════════════════════════════
// F5 (4 new beyond existing)
// ════════════════════════════════════════════════════
addCert({ name: 'F5-CA NGINX', fullName: 'F5 Certified Administrator, NGINX', vendor: 'F5', description: 'Validates admin skills for NGINX Plus and NGINX management.', url: 'https://education.f5.com/learning-path/view/24', category: 'Communication and Network Security', level: 'Beginner', costUsd: 150 });
addCert({ name: 'F5-CTS LTM', fullName: 'F5 Certified Technology Specialist, BIG-IP LTM', vendor: 'F5', description: 'Validates Local Traffic Manager load balancing and application delivery.', url: 'https://education.f5.com/learning-path/view/11', category: 'Communication and Network Security', level: 'Expert', costUsd: 180 });
addCert({ name: 'F5-CTS ASM', fullName: 'F5 Certified Technology Specialist, BIG-IP ASM', vendor: 'F5', description: 'Validates web application firewall and application security skills.', url: 'https://education.f5.com/learning-path/view/16', category: 'Security Operations', level: 'Expert', costUsd: 180 });
addCert({ name: 'F5-CSE Cloud', fullName: 'F5 Certified Solution Expert, Cloud', vendor: 'F5', description: 'Validates cloud delivery and security solutions with F5 products.', url: 'https://education.f5.com/learning-path/view/22', category: 'Cloud/SysOps', level: 'Expert', costUsd: 180 });

// ════════════════════════════════════════════════════
// CITRIX (3)
// ════════════════════════════════════════════════════
addCert({ name: 'Citrix CCA-V', fullName: 'Citrix Certified Associate - Virtualization', vendor: 'Citrix', description: 'Validates Citrix Virtual Apps and Desktops 7 administration skills.', url: 'https://www.citrix.com/training-and-certifications', category: 'Cloud/SysOps', level: 'Beginner', costUsd: 200 });
addCert({ name: 'Citrix CCP-V', fullName: 'Citrix Certified Professional - Virtualization', vendor: 'Citrix', description: 'Validates advanced Citrix Virtual Apps and Desktops 7 administration.', url: 'https://www.citrix.com/training-and-certifications', category: 'Cloud/SysOps', level: 'Intermediate', costUsd: 200 });
addCert({ name: 'Citrix CCA-AppDS', fullName: 'Citrix Certified Associate - App Delivery and Security', vendor: 'Citrix', description: 'Validates deployment and management of NetScaler for traffic management.', url: 'https://www.citrix.com/training-and-certifications', category: 'Communication and Network Security', level: 'Beginner', costUsd: 200 });

// ════════════════════════════════════════════════════
// RED HAT (3 new — RHCSA, RHCE, RHCA already exist)
// ════════════════════════════════════════════════════
addCert({ name: 'RHCS Security', fullName: 'Red Hat Certified Specialist in Security: Linux', vendor: 'Red Hat', description: 'Validates RHEL security: SELinux, OpenSCAP, encryption, and intrusion detection.', url: 'https://www.redhat.com/en/services/certification/rhcs-security-linux', category: 'Security Operations', level: 'Intermediate', costUsd: 500 });
addCert({ name: 'RHCS OCP ACS', fullName: 'Red Hat Certified Specialist in OpenShift Advanced Cluster Security', vendor: 'Red Hat', description: 'Validates managing and enforcing security for OpenShift with ACS for Kubernetes.', url: 'https://www.redhat.com/en/services/certification/ex430-red-hat-certified-specialist-openshift-advanced-cluster-security', category: 'Cloud/SysOps', level: 'Intermediate', costUsd: 500 });
addCert({ name: 'RHCS IdM', fullName: 'Red Hat Certified Specialist in Identity Management', vendor: 'Red Hat', description: 'Validates Red Hat Identity Management configuration and administration.', url: 'https://www.redhat.com/en/services/certification/red-hat-certified-specialist-identity-management', category: 'IAM', level: 'Intermediate', costUsd: 500 });

// ════════════════════════════════════════════════════
// CSA (2 new — CCSK already exists)
// ════════════════════════════════════════════════════
addCert({ name: 'CCZT', fullName: 'Certificate of Competence in Zero Trust', vendor: 'Cloud Security Alliance', description: 'Validates Zero Trust architecture, strategy, and implementation from CISA/NIST frameworks.', url: 'https://cloudsecurityalliance.org/education/cczt', category: 'Security Architecture and Engineering', level: 'Intermediate', costUsd: 175 });
addCert({ name: 'TAISE', fullName: 'Trusted AI Safety Expert', vendor: 'Cloud Security Alliance', description: 'Validates AI safety, ethics, governance, and risk management.', url: 'https://cloudsecurityalliance.org/education/taise/', category: 'GRC', level: 'Intermediate', costUsd: 795 });

// ── Write output ──
fs.writeFileSync(certsPath, JSON.stringify(certs, null, 2) + '\n');

const newCount = certs.length;
console.log(`\nFinal cert count: ${newCount}`);
console.log(`Removed: ${removedCount}`);
console.log(`Added: ${nextId - 482}`);
console.log(`Net change: +${newCount - 481 + removedCount}`);

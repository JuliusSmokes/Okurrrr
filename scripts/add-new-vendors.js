const fs = require('fs');
const path = require('path');

const certsPath = path.join(__dirname, '..', 'data', 'certs.json');
const certs = JSON.parse(fs.readFileSync(certsPath, 'utf8'));

let nextId = 610;
function addCert(obj) {
  certs.push(Object.assign({
    id: 'c' + (nextId++),
    dod8140: false,
    dodWorkRoleCodes: [],
    status: 'active',
    statusNote: null
  }, obj));
}

// ── Zscaler (6) ──

addCert({
  name: 'ZTCA',
  fullName: 'Zero Trust Certified Associate',
  vendor: 'Zscaler',
  description: 'Foundational zero trust concepts, architecture stages, and Zscaler solutions.',
  url: 'https://www.zscaler.com/zscaler-academy/ztca-zero-trust-certified-associate',
  category: 'Security Architecture and Engineering',
  level: 'Beginner',
  niceWorkRoleIds: ['DD-WRL-001', 'DD-WRL-006'],
  costUsd: 0,
  costNote: 'Free (Z-Badge)'
});

addCert({
  name: 'ZDTA',
  fullName: 'Zscaler Digital Transformation Administrator',
  vendor: 'Zscaler',
  description: 'Deploy, manage, and optimize ZIA, ZPA, and ZDX on the Zero Trust Exchange.',
  url: 'https://www.zscaler.com/zscaler-academy/zscaler-certification',
  category: 'Cloud/SysOps',
  level: 'Intermediate',
  niceWorkRoleIds: ['IO-WRL-004', 'IO-WRL-005'],
  costUsd: null,
  costNote: 'Contact Zscaler'
});

addCert({
  name: 'ZDTE',
  fullName: 'Zscaler Digital Transformation Engineer',
  vendor: 'Zscaler',
  description: 'Engineer-level deployment and configuration of the Zero Trust Exchange.',
  url: 'https://www.zscaler.com/zscaler-academy/digital-transformation-engineer',
  category: 'Cloud/SysOps',
  level: 'Expert',
  niceWorkRoleIds: ['IO-WRL-004', 'DD-WRL-001'],
  costUsd: null,
  costNote: 'Contact Zscaler'
});

addCert({
  name: 'ZDXA',
  fullName: 'Zscaler Digital Experience Administrator',
  vendor: 'Zscaler',
  description: 'Administration and monitoring of Zscaler Digital Experience (ZDX).',
  url: 'https://www.zscaler.com/zscaler-academy/digital-experience-administrator',
  category: 'Cloud/SysOps',
  level: 'Intermediate',
  niceWorkRoleIds: ['IO-WRL-004', 'IO-WRL-005'],
  costUsd: null,
  costNote: 'Contact Zscaler'
});

addCert({
  name: 'ZIA SS',
  fullName: 'Zscaler Internet Access Certified Support Specialist',
  vendor: 'Zscaler',
  description: 'L1/L2 support skills for Zscaler Internet Access deployments.',
  url: 'https://partneracademy.zscaler.com/zia-certified-support-specialist-exam',
  category: 'Security Operations',
  level: 'Intermediate',
  niceWorkRoleIds: ['PD-WRL-001', 'IO-WRL-004'],
  costUsd: null,
  costNote: 'Contact Zscaler'
});

addCert({
  name: 'ZPA SS',
  fullName: 'Zscaler Private Access Certified Support Specialist',
  vendor: 'Zscaler',
  description: 'L1/L2 support skills for Zscaler Private Access deployments.',
  url: 'https://partneracademy.zscaler.com/zpa-certified-support-specialist-exam',
  category: 'Security Operations',
  level: 'Intermediate',
  niceWorkRoleIds: ['PD-WRL-001', 'IO-WRL-004'],
  costUsd: null,
  costNote: 'Contact Zscaler'
});

// ── Okta (7) ──

addCert({
  name: 'OCP',
  fullName: 'Okta Certified Professional',
  vendor: 'Okta',
  description: 'Entry-level IAM certification for day-to-day Okta operations.',
  url: 'https://certification.okta.com/okta-certified-professional-performance-exam',
  category: 'IAM',
  level: 'Beginner',
  niceWorkRoleIds: ['IO-WRL-005', 'DD-WRL-001'],
  costUsd: 250,
  costNote: null
});

addCert({
  name: 'OCA',
  fullName: 'Okta Certified Administrator',
  vendor: 'Okta',
  description: 'Advanced operational and configuration skills on Okta Identity Engine.',
  url: 'https://certification.okta.com/okta-certified-administrator-hands-on-configuration-exam',
  category: 'IAM',
  level: 'Intermediate',
  niceWorkRoleIds: ['IO-WRL-005', 'DD-WRL-001'],
  costUsd: 250,
  costNote: null
});

addCert({
  name: 'OCC',
  fullName: 'Okta Certified Consultant',
  vendor: 'Okta',
  description: 'Design and implementation of enterprise Okta identity solutions.',
  url: 'https://certification.okta.com/okta-certified-consultant-hands-on-configuration-exam',
  category: 'IAM',
  level: 'Expert',
  niceWorkRoleIds: ['IO-WRL-005', 'DD-WRL-001', 'DD-WRL-006'],
  costUsd: 250,
  costNote: null
});

addCert({
  name: 'OCD',
  fullName: 'Okta Certified Developer',
  vendor: 'Okta',
  description: 'Building secure apps with Okta APIs, OIDC/OAuth, SSO, and API Access Management.',
  url: 'https://certification.okta.com/okta-certified-developer-exam',
  category: 'IAM',
  level: 'Intermediate',
  niceWorkRoleIds: ['DD-WRL-003', 'IO-WRL-005'],
  costUsd: 250,
  costNote: null
});

addCert({
  name: 'Auth0 CD',
  fullName: 'Auth0 Certified Developer',
  vendor: 'Okta',
  description: 'Implementing Auth0 for B2B/B2C authentication (OIDC, OAuth, MFA).',
  url: 'https://certification.okta.com/okta-developer-auth0-certification-exam',
  category: 'IAM',
  level: 'Intermediate',
  niceWorkRoleIds: ['DD-WRL-003', 'IO-WRL-005'],
  costUsd: 250,
  costNote: null
});

addCert({
  name: 'OCW',
  fullName: 'Okta Certified Workflows Specialty',
  vendor: 'Okta',
  description: 'Designing and building Okta Workflows for identity automation and lifecycle.',
  url: 'https://certification.okta.com/okta-workflows-specialty-certification-exam',
  category: 'IAM',
  level: 'Intermediate',
  niceWorkRoleIds: ['IO-WRL-005', 'DD-WRL-001'],
  costUsd: 250,
  costNote: null
});

addCert({
  name: 'OCTA',
  fullName: 'Okta Certified Technical Architect',
  vendor: 'Okta',
  description: 'Highest Okta credential for designing enterprise-wide IAM solutions.',
  url: 'https://certification.okta.com/okta-technical-architect-certification-overview',
  category: 'IAM',
  level: 'Expert',
  niceWorkRoleIds: ['DD-WRL-001', 'DD-WRL-006', 'IO-WRL-005'],
  costUsd: null,
  costNote: 'By application'
});

// ── Salesforce (2 new security-focused beyond existing 4) ──

addCert({
  name: 'SF PIAMA',
  fullName: 'Salesforce Certified Platform Identity and Access Management Architect',
  vendor: 'Salesforce',
  description: 'Architect-level design of identity and SSO solutions on Salesforce Platform.',
  url: 'https://trailhead.salesforce.com/credentials/identityandaccessmanagementarchitect',
  category: 'IAM',
  level: 'Expert',
  niceWorkRoleIds: ['DD-WRL-001', 'DD-WRL-006', 'IO-WRL-005'],
  costUsd: 400,
  costNote: null
});

addCert({
  name: 'SF SVA',
  fullName: 'Salesforce Certified Sharing and Visibility Architect',
  vendor: 'Salesforce',
  description: 'Design sharing and visibility security requirements on Salesforce Platform.',
  url: 'https://trailhead.salesforce.com/en/credentials/sharingandvisibilityarchitect',
  category: 'Security Architecture and Engineering',
  level: 'Expert',
  niceWorkRoleIds: ['DD-WRL-001', 'DD-WRL-006'],
  costUsd: 400,
  costNote: null
});

// ── GitHub (4 new; GitHub AdvSec already exists as c564) ──

addCert({
  name: 'GitHub Foundations',
  fullName: 'GitHub Foundations Certification',
  vendor: 'Microsoft / GitHub',
  description: 'Foundational Git, GitHub collaboration, repositories, and GitHub products.',
  url: 'https://learn.microsoft.com/en-us/credentials/certifications/github-foundations/',
  category: 'Software Security',
  level: 'Beginner',
  niceWorkRoleIds: ['DD-WRL-003', 'DD-WRL-004'],
  costUsd: 99,
  costNote: null
});

addCert({
  name: 'GitHub Actions',
  fullName: 'GitHub Actions Certification',
  vendor: 'Microsoft / GitHub',
  description: 'Automating workflows, CI/CD pipelines, and software delivery with GitHub Actions.',
  url: 'https://learn.microsoft.com/en-us/credentials/certifications/github-actions/',
  category: 'Software Security',
  level: 'Intermediate',
  niceWorkRoleIds: ['DD-WRL-003', 'DD-WRL-004'],
  costUsd: 99,
  costNote: null
});

addCert({
  name: 'GitHub Admin',
  fullName: 'GitHub Administration Certification',
  vendor: 'Microsoft / GitHub',
  description: 'Managing and optimizing a healthy GitHub environment for organizations.',
  url: 'https://learn.microsoft.com/en-us/credentials/certifications/github-admin/',
  category: 'Cloud/SysOps',
  level: 'Intermediate',
  niceWorkRoleIds: ['IO-WRL-005', 'DD-WRL-003'],
  costUsd: 99,
  costNote: null
});

addCert({
  name: 'GitHub Copilot',
  fullName: 'GitHub Copilot Certification',
  vendor: 'Microsoft / GitHub',
  description: 'AI developer use cases, prompt engineering, and responsible AI with GitHub Copilot.',
  url: 'https://learn.microsoft.com/en-us/credentials/certifications/github-copilot/',
  category: 'Software Security',
  level: 'Intermediate',
  niceWorkRoleIds: ['DD-WRL-003', 'DD-WRL-008'],
  costUsd: 99,
  costNote: null
});

// ── OneTrust (4) ──

addCert({
  name: 'OT Pro',
  fullName: 'OneTrust Professional Certification',
  vendor: 'OneTrust',
  description: 'Comprehensive certification covering the full OneTrust privacy platform.',
  url: 'https://www.onetrust.com/certifications/privacy-management-professional-certification',
  category: 'GRC',
  level: 'Intermediate',
  niceWorkRoleIds: ['OG-WRL-008', 'OG-WRL-002'],
  costUsd: 0,
  costNote: 'Free for customers/partners'
});

addCert({
  name: 'OT PMP',
  fullName: 'OneTrust Privacy Management Professional',
  vendor: 'OneTrust',
  description: 'Privacy management operations; qualifies for 4.5 IAPP CPE credits.',
  url: 'https://www.onetrust.com/certifications/privacy-management-professional-certification',
  category: 'GRC',
  level: 'Intermediate',
  niceWorkRoleIds: ['OG-WRL-008', 'OG-WRL-002'],
  costUsd: 0,
  costNote: 'Free for customers/partners'
});

addCert({
  name: 'OT GRC',
  fullName: 'OneTrust GRC Solutions Expert',
  vendor: 'OneTrust',
  description: 'Expert-level governance, risk, and compliance solutions on OneTrust.',
  url: 'https://www.onetrust.com/certifications/part-2-onetrust-professional-certification',
  category: 'GRC',
  level: 'Expert',
  niceWorkRoleIds: ['OG-WRL-002', 'OG-WRL-016', 'OG-WRL-008'],
  costUsd: 0,
  costNote: 'Free for customers/partners'
});

addCert({
  name: 'OT VRM',
  fullName: 'OneTrust Vendor Risk Management Expert',
  vendor: 'OneTrust',
  description: 'Third-party risk assessment and vendor risk management on OneTrust.',
  url: 'https://www.onetrust.com/certifications/part-2-onetrust-professional-certification',
  category: 'GRC',
  level: 'Expert',
  niceWorkRoleIds: ['OG-WRL-002', 'OG-WRL-016'],
  costUsd: 0,
  costNote: 'Free for customers/partners'
});

// ── SailPoint (4) ──

addCert({
  name: 'SP ISL',
  fullName: 'SailPoint Identity Security Leader',
  vendor: 'SailPoint',
  description: 'Foundational identity security concepts and SailPoint platform overview.',
  url: 'https://university.sailpoint.com/page/professional-certifications-and-knowledge-credentials',
  category: 'IAM',
  level: 'Beginner',
  niceWorkRoleIds: ['IO-WRL-005'],
  costUsd: 0,
  costNote: 'Free knowledge credential'
});

addCert({
  name: 'SP ISA',
  fullName: 'SailPoint Identity Security Administrator',
  vendor: 'SailPoint',
  description: 'Administration and operations of SailPoint Identity Security Cloud.',
  url: 'https://university.sailpoint.com/page/professional-certifications-and-knowledge-credentials',
  category: 'IAM',
  level: 'Intermediate',
  niceWorkRoleIds: ['IO-WRL-005', 'DD-WRL-001'],
  costUsd: 400,
  costNote: null
});

addCert({
  name: 'SP ISE',
  fullName: 'SailPoint Identity Security Engineer',
  vendor: 'SailPoint',
  description: 'Engineering and integration of SailPoint Identity Security Cloud solutions.',
  url: 'https://university.sailpoint.com/page/professional-certifications-and-knowledge-credentials',
  category: 'IAM',
  level: 'Expert',
  niceWorkRoleIds: ['IO-WRL-005', 'DD-WRL-001', 'DD-WRL-003'],
  costUsd: 400,
  costNote: null
});

addCert({
  name: 'SP IIQ Eng',
  fullName: 'SailPoint Certified IdentityIQ Engineer',
  vendor: 'SailPoint',
  description: 'Installation, deployment, and custom development on SailPoint IdentityIQ.',
  url: 'https://university.sailpoint.com/sailpoint-certified-identityiq-engineer',
  category: 'IAM',
  level: 'Expert',
  niceWorkRoleIds: ['IO-WRL-005', 'DD-WRL-001', 'DD-WRL-003'],
  costUsd: 400,
  costNote: null
});

fs.writeFileSync(certsPath, JSON.stringify(certs, null, 2), 'utf8');
console.log('Total certs:', certs.length, '(added', certs.length - 600, 'new)');

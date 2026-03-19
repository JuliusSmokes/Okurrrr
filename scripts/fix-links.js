#!/usr/bin/env node
/**
 * Automated link fixer for all data files.
 * Reads the link-checker report categories and applies fixes:
 *   1. Updates redirected URLs to their final canonical destination
 *   2. Fixes genuinely broken URLs with known replacements
 *   3. Removes entries whose domains are dead with no replacement
 *
 * Run: node scripts/fix-links.js
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '..', 'data');

// ─── URL replacement map: old URL → new URL ───
// Null value means "remove the entry entirely"
const FREE_RESOURCE_FIXES = {
  // Genuinely broken → fixed URLs
  'https://trivy.dev/latest/': 'https://trivy.dev/',
  'https://www.nist.gov/artificial-intelligence/ai-risk-management-framework': 'https://www.nist.gov/itl/ai-risk-management-framework',
  'https://www.sans.org/posters/incident-handlers-handbook/': 'https://www.sans.org/blog/the-ultimate-list-of-sans-cheat-sheets/',
  'https://www.sans.org/mlp/healthcare-cybersecurity/': 'https://www.sans.org/webcasts/winter-cyber-solutions-fest-2026-healthcare',
  'https://resources.sei.cmu.edu/library/asset-view.cfm?assetid=884738': 'https://www.sei.cmu.edu/library/common-sense-guide-to-mitigating-insider-threats-seventh-edition/',
  'https://www.cisa.gov/physical-security': 'https://www.cisa.gov/resources-tools/resources/physical-security-considerations-temporary-facilities-fact-sheet',
  'https://www.fedramp.gov/program-basics/': 'https://www.fedramp.gov/docs/authority/',
  'https://p1sec.com/resources/': null,
  'https://www.hailataxii.com/': null,
  'https://www.kb.cert.org/': 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog',
  'https://cloud.google.com/chronicle/docs/reference/yara-l-2-0-overview': 'https://cloud.google.com/chronicle/docs/reference/yara-l-2-0-syntax',
  'https://wiki.owasp.org/index.php/VoIP_Security_Testing_Guide': 'https://owasp.org/www-project-web-security-testing-guide/',
  'https://github.com/BurtTheCoder/mcp-mitre-attack': 'https://github.com/search?q=mcp+mitre+attack&type=repositories',
  'https://www.bankofengland.co.uk/financial-stability/financial-sector-continuity/cbest-threat-intelligence-led-assessments': 'https://www.bankofengland.co.uk/financial-stability/financial-sector-continuity',
  'https://secureprivacy.ai/blog/iso-27001-requirements-overview': 'https://www.iso.org/standard/27001',
  'https://www.vanta.com/resources/iso-27701': 'https://www.iso.org/standard/71670.html',
  'https://linfordco.com/blog/what-is-iso-27018/': 'https://www.iso.org/standard/76559.html',
  'https://linfordco.com/blog/sox-it-controls/': 'https://www.sarbanes-oxley-101.com/',
  'https://iapp.org/resources/article/brazilian-data-protection-law-lgpd-english-translation/': 'https://iapp.org/resources/topics/brazilian-general-data-protection-law/',
  'https://www.apec.org/about-us/about-apec/fact-sheets/what-is-the-cross-border-privacy-rules-system': 'https://www.apec.org/groups/committee-on-trade-and-investment/electronic-commerce-steering-group/cross-border-privacy-rules',
  'https://www.enisa.europa.eu/topics/cybersecurity-policy/nis-directive-new': 'https://www.enisa.europa.eu/topics/nis-directive',
  'https://support.google.com/a/answer/9261504': 'https://support.google.com/a/answer/10683907',
  'https://owasp.org/www-project-top-10-for-mcp/': null,
  'https://docs-prv.pcisecuritystandards.org/PCI%20DSS/Standard/PCI-DSS-v4_0.pdf': 'https://www.pcisecuritystandards.org/document_library/',
  'https://docs-prv.pcisecuritystandards.org/Guidance%20Document/Penetration%20Testing/Penetration-Testing-Guidance-v1_1.pdf': 'https://www.pcisecuritystandards.org/document_library/',
  'https://www.cisa.gov/resources-tools/services/red-team-assessments': 'https://www.cisa.gov/resources-tools/services',

  // Meaningful redirects → update to final URL
  'https://www.edx.org/micromasters/ritx-cybersecurity': 'https://www.edx.org/masters/micromasters/ritx-cybersecurity',
  'https://www.netacad.com/courses/cybersecurity': 'https://www.netacad.com/cybersecurity',
  'https://codered.eccouncil.org/': 'https://coderedpro.com/',
  'https://github.com/WithSecureLabs/damn-vulnerable-llm-agent': 'https://github.com/ReversecLabs/damn-vulnerable-llm-agent',
  'https://www.chef.io/products/chef-inspec': 'https://www.chef.io/products/chef-compliance',
  'https://docs.docker.com/guides/get-started/': 'https://docs.docker.com/get-started/workshop/',
  'https://docs.gitlab.com/ee/ci/': 'https://docs.gitlab.com/ci/',
  'https://aquasecurity.github.io/trivy/': 'https://trivy.dev/',
  'https://www.vaultproject.io/': 'https://developer.hashicorp.com/vault',
  'https://www.prelude.org/download': 'https://www.preludesecurity.com/',
  'https://thehive-project.org/': 'https://strangebee.com/',
  'https://www.opencti.io/': 'https://filigran.io',
  'https://public.cyber.mil/stigs/': 'https://www.cyber.mil/stigs/',
  'https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final': 'https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final',
  'https://docs.projectdiscovery.io/tools/nuclei/running': 'https://docs.projectdiscovery.io/opensource/nuclei/running',
  'https://docs.anthropic.com/en/docs/mcp': 'https://modelcontextprotocol.io/docs/getting-started/intro',
  'https://cloud.google.com/security-command-center/docs': 'https://docs.cloud.google.com/security-command-center/docs',
  'https://niccs.cisa.gov/workforce-development/nice-framework-mapping-tool': 'https://niccs.cisa.gov/tools/nice-framework-mapping-tool',
  'https://www.sans.org/reading-room/': 'https://www.sans.org/white-papers',
  'https://www.mitre.org/research': 'https://www.mitre.org/focus-areas',
  'https://learning.quantum.ibm.com/course/practical-introduction-to-quantum-safe-cryptography': 'https://quantum.cloud.ibm.com/learning/en/courses/quantum-safe-cryptography',
  'https://www.cisa.gov/quantum': 'https://www.cisa.gov/topics/risk-management/quantum',
  'https://www.openssl.org/docs/man3.0/man1/': 'https://docs.openssl.org/',
  'https://sleuthkit.org/autopsy/docs/user-docs/latest/': 'https://sleuthkit.org/autopsy/docs/user-docs/4.22.0/',
  'https://jqlang.github.io/jq/manual/': 'https://jqlang.org/manual/',
  'https://ghidra-sre.org/': 'https://github.com/NationalSecurityAgency/ghidra',
  'https://gtfobins.github.io/': 'https://gtfobins.org/',
  'https://github.com/securestate/king-phisher': 'https://github.com/rsmusllp/king-phisher',
  'https://www.maltego.com/maltego-community/': 'https://www.maltego.com/pricing/',
  'https://www.opencost.io/': 'https://opencost.io/',
  'https://www.kubecost.com/install': 'https://www.apptio.com/products/kubecost/install/?src=kc-com',
  'https://cloud.google.com/billing/docs': 'https://docs.cloud.google.com/billing/docs',
  'https://sec.eff.org/': 'https://www.securityeducationcompanion.org',
  'https://www.eff.org/issues/street-level-surveillance': 'https://sls.eff.org/',
  'https://hphcyber.hhs.gov/performance-goals.html': 'https://hhscyber.hhs.gov',
  'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/cybersecurity-medical-devices-quality-system-considerations-and-content-premarket-submissions': 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents/cybersecurity-medical-devices-quality-management-system-considerations-and-content-premarket',
  'https://csrc.nist.gov/projects/cybersecurity-framework/nist-cybersecurity-framework-a-quick-start-guide': 'https://www.nist.gov/cyberframework/csf-11-quick-start-guide',
  'https://ocrportal.hhs.gov/ocr/breach/breach_report.jsf': 'https://ocrportal.hhs.gov/ocr/breach/breach_frontpage.jsf',
  'https://wiki.sei.cmu.edu/confluence/display/seccode': 'https://wiki.sei.cmu.edu/confluence/spaces/seccode/overview',
  'https://vuls.cert.org/confluence/display/CVD': 'https://certcc.github.io/confluence/display/CVD/',
  'https://cloud.google.com/architecture/framework': 'https://docs.cloud.google.com/architecture/framework',
  'https://www.practicalnetworking.net/series/networking-fundamentals/networking-fundamentals/': 'https://www.practicalnetworking.net/index/networking-fundamentals-how-data-moves-through-the-internet/',
  'https://book.hacktricks.wiki/': 'https://hacktricks.wiki/en/index.html',
  'https://cloud.hacktricks.wiki/': 'https://cloud.hacktricks.wiki/en/index.html',
  'https://www.greenbone.net/en/community-edition/': 'https://www.greenbone.net/en/testnow/',
  'https://www.risklens.com/resource-center': 'https://safe.security/resources/',
  'https://cloud.google.com/architecture/security-foundations': 'https://docs.cloud.google.com/architecture/blueprints/security-foundations',
  'https://cloud.google.com/security-command-center/docs/concepts-security-command-center-overview': 'https://docs.cloud.google.com/security-command-center/docs/security-command-center-overview',
  'https://www.cloudskillsboost.google/paths/15': 'https://www.skills.google/paths/15',
  'https://cloud.google.com/architecture': 'https://docs.cloud.google.com/architecture',
  'https://cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster': 'https://docs.cloud.google.com/kubernetes-engine/docs/how-to/hardening-your-cluster',
  'https://cloud.google.com/chronicle/docs/overview': 'https://docs.cloud.google.com/chronicle/docs/overview',
  'https://docs.oracle.com/en-us/iaas/cloud-guard/home.htm': 'https://docs.oracle.com/en-us/iaas/Content/cloud-guard/home.htm',
  'https://docs.oracle.com/en-us/iaas/security-zone/home.htm': 'https://docs.oracle.com/en-us/iaas/Content/security-zone/home.htm',
  'https://docs.oracle.com/en-us/iaas/scanning/home.htm': 'https://docs.oracle.com/en-us/iaas/Content/scanning/home.htm',
  'https://python.langchain.com/docs/introduction/': 'https://docs.langchain.com/oss/python/langchain/overview',
  'https://www.elastic.co/guide/en/elasticsearch/reference/current/eql.html': 'https://www.elastic.co/docs/explore-analyze/query-filter/languages/eql',
  'https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html': 'https://www.elastic.co/docs/reference/query-languages/query-dsl/query-dsl-query-string-query',
  'https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight': 'https://www.cyber.gov.au/business-government/asds-cyber-security-frameworks/essential-eight',
  'https://www.swift.com/myswift/customer-security-programme-csp': 'https://www.swift.com/myswift/customer-security-programme',
  'https://www.crest-approved.org/skills-certifications-careers/crest-penetration-testing/': 'https://www.crest-approved.org/about-us/crest-penetration-testing-focus-group/',
  'https://www.defectdojo.org/': 'https://defectdojo.com/community',
  'https://owasp.org/www-project-proactive-controls/': 'https://top10proactive.owasp.org/',
  'https://www.openpolicyagent.org/docs/latest/': 'https://www.openpolicyagent.org/docs',
  'https://cloud.google.com/sdk/gcloud/reference': 'https://docs.cloud.google.com/sdk/gcloud/reference',
  'https://cloud.google.com/secret-manager/docs': 'https://docs.cloud.google.com/secret-manager/docs',
  'https://iamthecavalry.org/hippocratic-oath/': 'https://iamthecavalry.org/',

  // Trailing-slash redirects – update to canonical
  'https://www.sans.org/posters/tcp-ip-and-tcpdump/': 'https://www.sans.org/posters/tcp-ip-and-tcpdump',
  'https://www.sans.org/posters/windows-command-line-cheat-sheet/': 'https://www.sans.org/posters/windows-command-line-cheat-sheet',
  'https://www.sans.org/posters/linux-essentials-cheat-sheet/': 'https://www.sans.org/posters/linux-essentials-cheat-sheet',
  'https://www.sans.org/blog/sans-pen-test-cheat-sheet-powershell/': 'https://www.sans.org/blog/sans-pen-test-cheat-sheet-powershell',
  'https://www.sans.org/posters/remnux-usage-tips-for-malware-analysis-on-linux/': 'https://www.sans.org/posters/remnux-usage-tips-for-malware-analysis-on-linux',
  'https://www.sans.org/posters/sift-cheat-sheet/': 'https://www.sans.org/posters/sift-cheat-sheet',
  'https://www.sans.org/posters/multicloud-cheat-sheet/': 'https://www.sans.org/posters/multicloud-cheat-sheet',
  'https://www.sans.org/posters/intrusion-discovery-cheat-sheet-for-linux/': 'https://www.sans.org/posters/intrusion-discovery-cheat-sheet-for-linux',
  'https://www.sans.org/posters/google-hacking-and-defense-cheat-sheet/': 'https://www.sans.org/posters/google-hacking-and-defense-cheat-sheet',
  'https://www.sans.org/tools/sift-workstation/': 'https://www.sans.org/tools/sift-workstation',
  'https://www.sans.org/white-papers/': 'https://www.sans.org/white-papers',
  'https://www.sans.org/blog/?focus-area=digital-forensics': 'https://www.sans.org/blog?focus-area=digital-forensics',

  // Name updates for changed resources
};

// Genuinely broken free-resource entries to name-update along with URL fix
const FREE_RESOURCE_NAME_FIXES = {
  'fr531': 'Common Sense Guide to Mitigating Insider Threats (7th Ed.)',
  'fr528': 'CISA Known Exploited Vulnerabilities Catalog',
  'fr386': 'SANS Cheat Sheets Master List',
  'fr505': 'SANS Healthcare Cybersecurity Forum 2026',
  'fr704': 'FedRAMP Authorization & Documentation',
};

// ─── CERTS: URL replacement map ───
const CERT_FIXES = {};

// OffSec redirect-loop fixes
var offsecMap = {
  'https://www.offensive-security.com/awe-osee/': 'https://www.offsec.com/courses/exp-401/',
  'https://www.offensive-security.com/wifu-oswp/': 'https://www.offsec.com/courses/pen-210/',
  'https://www.offensive-security.com/web200-oswa/': 'https://www.offsec.com/courses/web-200/',
  'https://www.offensive-security.com/awae-oswe/': 'https://www.offsec.com/courses/web-300/',
  'https://www.offensive-security.com/pen300-osep/': 'https://www.offsec.com/courses/pen-300/',
  'https://www.offensive-security.com/exp301-osed/': 'https://www.offsec.com/courses/exp-301/',
  'https://www.offensive-security.com/pwk-oscp/': 'https://www.offsec.com/courses/pen-200/',
  'https://www.offensive-security.com/soc200-osda/': 'https://www.offsec.com/courses/soc-200/',
  'https://www.offensive-security.com/exp312-osmr/': 'https://www.offsec.com/courses/',
};
Object.assign(CERT_FIXES, offsecMap);

// GIAC redirect-loop fixes: all follow pattern giac.org/certification/{slug}
// The new URL format appears to be the same hostname – the redirect loop is a
// server-side issue with automated HEAD requests. But we update to https://www.giac.org/certifications/{slug} (plural)
var giacCerts = [
  'gxpn','gawn','gcfa','gcti','gdat','gstrt','gsna','gnfa','gisp','gdsa',
  'gslc','gcfe','gasf','gleg','gccc','gweb','gced','gcsa','grid','gmon',
  'gcda','gcih','gpen','gcpm','gpyc','gcpn','gmob','gcia','gwapt','gbfa',
  'gcip','gosi','gicsp','gsec','gisf'
];
giacCerts.forEach(function(slug) {
  var oldPatterns = [
    'https://www.giac.org/certification/' + slug,
    'https://www.giac.org/certification/defending-advanced-threats-' + slug,
    'https://www.giac.org/certification/network-forensic-analyst-' + slug,
    'https://www.giac.org/certification/advanced-smartphone-forensics-' + slug,
    'https://www.giac.org/certification/law-data-security-investigations-' + slug,
    'https://www.giac.org/certification/critical-controls-certification-' + slug,
    'https://www.giac.org/certification/certified-web-application-defender-' + slug,
    'https://www.giac.org/certification/certified-enterprise-defender-' + slug,
    'https://www.giac.org/certification/cloud-security-automation-' + slug,
    'https://www.giac.org/certification/response-industrial-defense-' + slug,
    'https://www.giac.org/certification/continuous-monitoring-certification-' + slug,
    'https://www.giac.org/certification/certified-detection-analyst-' + slug,
    'https://www.giac.org/certification/python-coder-' + slug,
    'https://www.giac.org/certification/mobile-device-security-analyst-' + slug,
    'https://www.giac.org/certification/certified-intrusion-analyst-' + slug,
    'https://www.giac.org/certification/global-industrial-cyber-security-professional-' + slug,
    'https://www.giac.org/certification/security-essentials-' + slug,
    'https://www.giac.org/certification/information-security-fundamentals-' + slug,
    'https://www.giac.org/certification/critical-infrastructure-protection-' + slug,
    'https://www.giac.org/certification/open-source-intelligence-' + slug,
    'https://www.giac.org/certification/defensible-security-architecture-' + slug,
  ];
  oldPatterns.forEach(function(old) {
    CERT_FIXES[old] = 'https://www.giac.org/certifications/' + slug;
  });
});

// Mile2 redirect-loop fixes
var mile2Redirects = {
  'https://www.mile2.com/penetration-testing-engineer-outline/': 'https://mile2.com/cpte-course-outline/',
  'https://www.mile2.com/iscap_outline/': 'https://mile2.com/ciscap-course-outline/',
  'https://www.mile2.com/master-certifications/': 'https://mile2.com/master-certifications/',
  'https://www.mile2.com/information-systems-risk-mangager-outline/': 'https://mile2.com/cisrm-course-outline/',
  'https://www.mile2.com/is20_outline/': 'https://mile2.com/is18-course-outline/',
  'https://www.mile2.com/information_systems_security_auditor_outline/': 'https://mile2.com/ccssa-course-outline/',
  'https://www.mile2.com/cdre_outline/': 'https://mile2.com/cdre-course-outline/',
  'https://www.mile2.com/cisso_outline/': 'https://mile2.com/cisso-course-outline/',
  'https://www.mile2.com/chissp_outline/': 'https://mile2.com/chissp-course-outline/',
  'https://www.mile2.com/cisms-la-li-outline/': 'https://mile2.com/cisms-la-li-course-outline/',
  'https://mile2.com/cptc_outline/': 'https://mile2.com/cptc-course-outline/',
  'https://mile2.com/cissm_outline/': 'https://mile2.com/ccssm-course-outline/',
  'https://www.mile2.com/cihe_outline/': 'https://mile2.com/cihe-course-outline/',
  'https://www.mile2.com/cpSH_outline/': 'https://mile2.com/cpsh-course-outline/',
  'https://www.mile2.com/network-forensics-examiner-outline/': 'https://mile2.com/cnfe-course-outline/',
  'https://www.mile2.com/threat-analyst/': 'https://mile2.com/ctia-course-outline/',
  'https://www.mile2.com/cslo_outline/': 'https://mile2.com/cslo-course-outline/',
  'https://www.mile2.com/cswae_outline/': 'https://mile2.com/cswae-course-outline/',
  'https://mile2.com/professional-ethical-hacker/': 'https://mile2.com/cpeh-course-outline/',
  'https://mile2.com/ccso_outline/': 'https://mile2.com/ccso-course-outline/',
  'https://www.mile2.com/cdfe_outline/': 'https://mile2.com/cdfe-course-outline/',
  'https://www.mile2.com/csp_outline/': 'https://mile2.com/csp-course-outline/',
  'https://www.mile2.com/vulnerability-assessor-outline/': 'https://mile2.com/cva-course-outline/',
};
Object.assign(CERT_FIXES, mile2Redirects);

// Cert redirects → update to final URL (from the REDIRECTED section)
var certRedirects = {
  'https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/expert/ccie-security.html': 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/security/ccie-security/index.html',
  'https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/expert/ccie-security-v2.html': 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/security/ccie-security/index.html',
  'https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/professional/ccnp-security-v2.html': 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/security/ccnp-security/index.html',
  'https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/professional/ccnp-enterprise.html': 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccnp-enterprise/index.html',
  'https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/professional/cyberops-professional.html': 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/cybersecurity/professional/index.html',
  'https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/cyberops-associate.html': 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/cybersecurity/ccna-cybersecurity/index.html',
  'https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/entry/technician-cct.html': 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/technician/index.html',
  'https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/expert/ccde.html': 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/design/ccde/index.html',
  'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/devnet/professional/index.html': 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/automation/ccnp-automation/index.html',
  'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/devnet/associate/index.html': 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/automation/ccna-automation/index.html',

  'https://docs.microsoft.com/en-us/certifications/exams/sc-100': 'https://learn.microsoft.com/en-us/certifications/exams/sc-100',
  'https://docs.microsoft.com/en-us/learn/certifications/azure-solutions-architect?wt.mc_id=learningredirect_certs-web-wwl': 'https://learn.microsoft.com/en-us/learn/certifications/azure-solutions-architect',
  'https://docs.microsoft.com/en-us/learn/certifications/azure-security-engineer?wt.mc_id=learningredirect_certs-web-wwl': 'https://learn.microsoft.com/en-us/learn/certifications/azure-security-engineer',
  'https://docs.microsoft.com/en-us/learn/certifications/azure-administrator?wt.mc_id=learningredirect_certs-web-wwl': 'https://learn.microsoft.com/en-us/learn/certifications/azure-administrator',
  'https://docs.microsoft.com/en-us/learn/certifications/azure-iot-developer-specialty?wt.mc_id=learningredirect_certs-web-wwl': 'https://learn.microsoft.com/en-us/learn/certifications/azure-iot-developer-specialty',
  'https://docs.microsoft.com/en-us/learn/certifications/identity-and-access-administrator/': 'https://learn.microsoft.com/en-us/learn/certifications/identity-and-access-administrator/',
  'https://docs.microsoft.com/en-us/learn/certifications/security-operations-analyst/': 'https://learn.microsoft.com/en-us/credentials/certifications/security-operations-analyst/',
  'https://docs.microsoft.com/en-us/learn/certifications/security-compliance-and-identity-fundamentals/': 'https://learn.microsoft.com/en-us/learn/certifications/security-compliance-and-identity-fundamentals/',
  'https://docs.microsoft.com/en-us/learn/certifications/azure-fundamentals': 'https://learn.microsoft.com/en-us/learn/certifications/azure-fundamentals',

  'https://elearnsecurity.com/product/ewptxv2-certification/': 'https://ine.com/security/certifications/ewptx-certification',
  'https://security.ine.com/certifications/ecthp-certification/': 'https://ine.com/security/certifications/ecthp-certification',
  'https://security.ine.com/certifications/ecdfp-certification/': 'https://ine.com/security/certifications/ecdfp-certification',
  'https://security.ine.com/certifications/ecir-certification/': 'https://ine.com/security/certifications/ecir-certification',
  'https://security.ine.com/certifications/ecppt-certification/': 'https://ine.com/security/certifications/ecppt-certification',
  'https://security.ine.com/certifications/ewpt-certification/': 'https://ine.com/security/certifications/ewpt-certification',
  'https://security.ine.com/certifications/emapt-certification/': 'https://ine.com/security/certifications/emapt-certification',
  'https://www.elearnsecurity.com/certification/endp/': 'https://ine.com/security',
  'https://ine.com/learning/certifications/internal/elearnsecurity-junior-penetration-tester-v2': 'https://my.ine.com/certifications/',

  'https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/': 'https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh-v13-north-america/',
  'https://www.eccouncil.org/programs/computer-hacking-forensic-investigator-chfi/': 'https://www.eccouncil.org/train-certify/computer-hacking-forensic-investigator-chfi-north-america/',
  'https://www.eccouncil.org/programs/ec-council-certified-incident-handler-ecih/': 'https://www.eccouncil.org/train-certify/ec-council-certified-incident-handler-ecih-north-america/',
  'https://www.eccouncil.org/programs/licensed-penetration-tester-lpt-master/': 'https://www.eccouncil.org/train-certify/licensed-penetration-tester-lpt-master/',
  'https://www.eccouncil.org/programs/certified-penetration-testing-professional-cpent/': 'https://www.eccouncil.org/train-certify/certified-penetration-testing-professional-cpent-north-america/',
  'https://www.eccouncil.org/programs/certified-application-security-engineer-case/': 'https://www.eccouncil.org/train-certify/certified-application-security-engineer-case-java/',
  'https://www.eccouncil.org/programs/disaster-recovery-professional-edrp/': 'https://www.eccouncil.org/',
  'https://www.eccouncil.org/programs/certified-threat-intelligence-analyst-ctia/': 'https://www.eccouncil.org/train-certify/certified-threat-intelligence-analyst-ctia/',
  'https://www.eccouncil.org/programs/certified-soc-analyst-csa/': 'https://www.eccouncil.org/train-certify/certified-soc-analyst-csa-north-america/',
  'https://www.eccouncil.org/programs/ec-council-certified-encryption-specialist-eces/': 'https://www.eccouncil.org/train-certify/ec-council-certified-encryption-specialist-eces/',
  'https://www.eccouncil.org/programs/certified-network-defense-architect-cnda/': 'https://www.eccouncil.org/train-certify/certified-network-defender-cnd-north-america/',
  'https://www.eccouncil.org/programs/certified-security-specialist-ecss/': 'https://www.eccouncil.org/train-certify/certified-security-specialist-ecss/',
  'https://www.eccouncil.org/programs/certified-network-defender-cnd/': 'https://www.eccouncil.org/train-certify/certified-network-defender-cnd-north-america/',
  'https://www.eccouncil.org/Certification/certified-secure-computer-user': 'https://www.eccouncil.org/train-certify/certified-secure-computer-user-cscu/',

  'https://www.comptia.org/certifications/comptia-advanced-security-practitioner': 'https://www.comptia.org/en-us/certifications/securityx/',
  'https://www.comptia.org/certifications/cybersecurity-analyst': 'https://www.comptia.org/en-us/certifications/cybersecurity-analyst/',
  'https://www.comptia.org/certifications/pentest': 'https://www.comptia.org/en-us/certifications/pentest/',
  'https://www.comptia.org/certifications/server': 'https://www.comptia.org/en-us/certifications/server/',
  'https://www.comptia.org/certifications/linux': 'https://www.comptia.org/en-us/certifications/linux/',
  'https://www.comptia.org/certifications/cloud': 'https://www.comptia.org/en-us/certifications/cloud/',
  'https://www.comptia.org/certifications/security': 'https://www.comptia.org/en-us/certifications/security/',
  'https://www.comptia.org/certifications/network': 'https://www.comptia.org/en-us/certifications/network/',
  'https://www.comptia.org/certifications/cloud-essentials': 'https://www.comptia.org/en-us/certifications/cloud-essentials/',
  'https://www.comptia.org/certifications/project': 'https://www.comptia.org/en-us/certifications/project/',
  'https://www.comptia.org/certifications/a': 'https://www.comptia.org/en-us/certifications/a/core-1-v15/',

  'https://www.ncsc.gov.uk/information/about-certified-professional-scheme': 'https://www.ncsc.gov.uk/information/certified-cyber-professional-assured-service',

  'https://www.opengroup.org/certifications/togaf': 'https://www.opengroup.org/certifications/togaf-certification-portfolio',

  'https://cloud.google.com/certification/cloud-architect': 'https://cloud.google.com/learn/certification/cloud-architect/',
  'https://cloud.google.com/certification/cloud-security-engineer': 'https://cloud.google.com/learn/certification/cloud-security-engineer/',
  'https://cloud.google.com/certification/cloud-digital-leader': 'https://cloud.google.com/learn/certification/cloud-digital-leader/',
  'https://cloud.google.com/certification/cloud-network-engineer': 'https://cloud.google.com/learn/certification/cloud-network-engineer/',
  'https://cloud.google.com/certification/cloud-devops-engineer': 'https://cloud.google.com/learn/certification/cloud-devops-engineer/',
  'https://cloud.google.com/certification/cloud-developer': 'https://cloud.google.com/learn/certification/cloud-developer/',
  'https://cloud.google.com/certification/data-engineer': 'https://cloud.google.com/learn/certification/data-engineer/',

  'https://www.cncf.io/certification/cks/': 'https://www.cncf.io/training/certification/cks/',
  'https://www.cncf.io/certification/cka/': 'https://www.cncf.io/training/certification/cka/',
  'https://www.cncf.io/certification/ckad/': 'https://www.cncf.io/training/certification/ckad/',
  'https://www.cncf.io/certification/kcna/': 'https://www.cncf.io/training/certification/kcna/',

  'https://www.identitymanagementinstitute.org/cimp/': 'https://identitymanagementinstitute.org/cimp/',
  'https://www.identitymanagementinstitute.org/ciam/': 'https://identitymanagementinstitute.org/ciam-certification/',
  'https://www.identitymanagementinstitute.org/cipa/': 'https://identitymanagementinstitute.org/cipa/',
  'https://www.identitymanagementinstitute.org/cige/': 'https://identitymanagementinstitute.org/cige/',
  'https://www.identitymanagementinstitute.org/cist/': 'https://identitymanagementinstitute.org/cist/',
  'https://www.identitymanagementinstitute.org/cdp/': 'https://identitymanagementinstitute.org/cdp/',
  'https://www.identitymanagementinstitute.org/crfs/': 'https://identitymanagementinstitute.org/crfs/',
  'https://www.identitymanagementinstitute.org/cams/': 'https://identitymanagementinstitute.org/cams/',

  'https://www.crest-approved.org/certification-careers/crest-certifications/crest-certified-simulated-attack-manager': 'https://www.crest-approved.org/skills-certifications-careers/crest-certified-simulated-attack-manager/',
  'https://www.crest-approved.org/certification-careers/crest-certifications/crest-certified-infrastructure-tester': 'https://www.crest-approved.org/skills-certifications-careers/crest-certified-infrastructure-tester/',
  'https://www.crest-approved.org/certification-careers/crest-certifications/crest-certified-threat-intelligence-manager': 'https://www.crest-approved.org/skills-certifications-careers/crest-certified-threat-intelligence-manager/',
  'https://www.crest-approved.org/certification-careers/crest-certifications/crest-registered-penetration-tester': 'https://www.crest-approved.org/skills-certifications-careers/crest-registered-penetration-tester/',
  'https://www.crest-approved.org/certification-careers/crest-certifications/crest-registered-intrusion-analyst': 'https://www.crest-approved.org/skills-certifications-careers/crest-registered-intrusion-analyst/',
  'https://www.crest-approved.org/certification-careers/crest-certifications/crest-registered-threat-intelligence-analyst': 'https://www.crest-approved.org/skills-certifications-careers/crest-registered-threat-intelligence-analyst/',
  'https://www.crest-approved.org/certification-careers/crest-certifications/crest-practitioner-security-analyst': 'https://www.crest-approved.org/skills-certifications-careers/crest-practitioner-security-analyst/',
  'https://www.crest-approved.org/certification-careers/crest-certifications/crest-practitioner-intrusion-analyst': 'https://www.crest-approved.org/skills-certifications-careers/crest-practitioner-intrusion-analyst/',
  'https://www.crest-approved.org/certification-careers/crest-certifications/crest-practitioner-threat-intelligence-analyst/': 'https://www.crest-approved.org/skills-certifications-careers/crest-practitioner-threat-intelligence-analyst/',
  'https://www.crest-approved.org/certification-careers/crest-certifications/crest-certified-web-application-tester/': 'https://www.crest-approved.org/skills-certifications-careers/crest-certified-web-application-tester/',

  'https://www.seco-institute.org/certifications/ethical-hacking-track/leader/': 'https://www.dnv.com/training/path-ethical-hacking/',
  'https://www.seco-institute.org/certifications/certified-secure-software-developer/': 'https://www.dnv.com/training/path-secure-software/',
  'https://www.seco-institute.org/certifications/ethical-hacking-track/practitioner/': 'https://www.dnv.com/training/path-ethical-hacking/',

  'https://securityblue.team/btl2/': 'https://www.securityblue.team/certifications/blue-team-level-2',
  'https://www.securityblue.team/why-btl1/': 'https://www.securityblue.team/certifications/blue-team-level-1',

  'https://cyberdefenders.org/blue-team-training/courses/certified-cyberdefender-certification/': 'https://cyberdefenders.org/certifications/certified-cyberdefender-level2/',
  'https://cybersecurity.isaca.org/csx-certifications/csx-practitioner-certification': 'https://www.isaca.org/training-and-events/cybersecurity',
  'https://www.isaca.org/credentialing/certified-data-privacy-solutions-engineer': 'https://www.isaca.org/credentialing/cdpse',

  'https://www.opentext.com/products-and-solutions/services/training-and-learning-services/encase-training/forensic-security-responder-certification': 'https://www.opentext.com/learning-services/learning-paths-encase-certifications',
  'https://www.opentext.com/products-and-solutions/services/training-and-learning-services/encase-training/examiner-certification': 'https://www.opentext.com/learning-services/learning-paths-encase-certifications',
  'https://accessdata.com/training/computer-forensics-certification': 'https://www.exterro.com/',

  'https://www.vmware.com/education-services/certification/vcp-dcv.html': 'https://www.broadcom.com/support/education/vmware/certification/vcp-dcv',

  'https://www.juniper.net/us/en/training/certification/certification-tracks/junos-security-track/?tab=jnciesec': 'https://www.juniper.net/us/en/training/certification.html?tab=jnciesec',
  'https://www.juniper.net/us/en/training/certification/certification-tracks/junos-security-track/?tab=jncip-sec': 'https://www.juniper.net/us/en/training/certification.html?tab=jncip-sec',
  'https://www.juniper.net/us/en/training/certification/certification-tracks/junos-security-track/?tab=jncisec': 'https://www.juniper.net/us/en/training/certification.html?tab=jncisec',
  'https://www.juniper.net/us/en/training/certification/certification-tracks/junos-security-track/?tab=jnciasec': 'https://www.juniper.net/us/en/training/certification.html?tab=jnciasec',

  'https://www.scrum.org/scaled-professional-scrum-certification': 'https://www.scrum.org/assessments/scaled-professional-scrum-certification',
  'https://www.scrum.org/professional-scrum-developer-certification': 'https://www.scrum.org/assessments/professional-scrum-developer-certification',
  'https://www.scrum.org/professional-agile-leadership-certification': 'https://www.scrum.org/assessments/professional-agile-leadership-certification',

  'https://iapp.org/certify/cipt/': 'https://iapp.org/certify/cipt',

  'https://www.isa.org/training-and-certifications/isa-certification/isa99iec-62443/isa99iec-62443-cybersecurity-certificate-programs/': 'https://www.isa.org/certification/certificate-programs/isa-iec-62443-cybersecurity-certificate-program',
  'https://limessecurity.com/en/academy/ics-211/': 'https://limessecurity.com/en/academy/trainings/ics-211/',
  'https://limessecurity.com/en/academy/ics-201/': 'https://limessecurity.com/en/academy/trainings/ics-201/',

  'https://www.itgovernance.co.uk/shop/product/certified-iso-27001-isms-lead-implementer-training-course': 'https://uk.grcsolutions.io/',
  'https://www.itgovernance.co.uk/shop/product/certified-iso-27001-isms-lead-auditor-training-course': 'https://uk.grcsolutions.io/',
  'https://www.itgovernance.co.uk/shop/product/iso-27005-certified-isms-risk-management': 'https://uk.grcsolutions.io/',
  'https://www.itgovernance.co.uk/shop/product/iso27001-certified-isms-internal-auditor-training-course': 'https://uk.grcsolutions.io/',
  'https://www.itgovernance.co.uk/shop/product/certified-iso-27001-isms-foundation-training-course': 'https://uk.grcsolutions.io/',
  'https://www.itgovernance.co.uk/shop/product/implementing-it-governance-foundation-principles-training-course': 'https://uk.grcsolutions.io/product/implementing-it-governance-foundation-principles-training-course',
  'https://www.itgovernance.co.uk/shop/product/managing-cyber-security-risk-training-course': 'https://uk.grcsolutions.io/product/managing-cyber-security-risk-training-course',
  'https://www.itgovernance.co.uk/shop/product/cyber-incident-response-management-foundation-training-course': 'https://uk.grcsolutions.io/product/cyber-incident-response-management-foundation-training-course',
  'https://www.itgovernance.co.uk/shop/product/certified-cyber-security-foundation-training-course': 'https://uk.grcsolutions.io/product/certified-cyber-security-foundation-training-course',

  'https://certifications.tcm-sec.com/pjmr/': 'https://certifications.tcm-sec.com/pmrp/',
  'https://cyberstruggle.org/ranger-certification/': 'https://cyberstruggle.org/programs/ranger-certification/',
  'https://cyberstruggle.org/aegis-certification/': 'https://cyberstruggle.org/programs/aegis-certification/',

  'https://www.practical-devsecops.com/certified-devsecops-expert': 'https://www.practical-devsecops.com/certified-devsecops-expert/',
  'https://na.theiia.org/certification/CIA-Certification/Pages/CIA-Certification.aspx': 'https://www.theiia.org/en/certifications/cia/',
  'https://certnexus.com/certification/cyber-secure-coder/': 'https://certnexus.com/cyber-secure-coder/',
  'https://certnexus.com/certification/cybersec-first-responder/': 'https://certnexus.com/cybersec-first-responder-advanced/',

  'https://training.mirantis.com/dca-certification-exam/': 'https://training.mirantis.com/certification/dca-certification-exam/',
  'https://www.lpi.org/our-certifications/lpic-1-overview': 'https://www.lpi.org/our-certifications/lpic-1-overview/',
  'https://www.lpi.org/our-certifications/lpic-2-overview': 'https://www.lpi.org/our-certifications/lpic-2-overview/',
  'https://www.lpi.org/our-certifications/lpic-3-303-overview': 'https://www.lpi.org/our-certifications/lpic-3-303-overview/',

  'https://www.sans.org/security-awareness-training/career-development/credential/': 'https://www.sans.org/cyber-security-certifications/sans-security-awareness-professional-credential',
  'https://developer.hashicorp.com/certifications/networking-automation': 'https://developer.hashicorp.com/certifications/security-automation',

  'https://apmg-international.com/product/iso-iec-20000': 'https://apmg-international.com/product/isoiec-20000',
  'https://apmg-international.com/product/isoiec-27001': 'https://apmg-international.com/product/iso-iec-27001',
  'https://apmg-international.com/product/iso-20000': 'https://apmg-international.com/product/isoiec-20000',

  'https://www.exin.com/certifications/exin-ethical-hacking-foundation-exam': 'https://www.exin.com/',
  'https://www.tuv.com/landingpage/en/lp-certified-operational-technology-cybersecurity-professional-program/': 'https://www.tuv.com/world/en/lp/cybersecurity/',

  'https://www.onetrust.com/certifications/privacy-management-professional-certification': 'https://www.onetrust.com/certifications/',

  'https://wiz.io/wiz-certified/cloud-fundamentals-exam': 'https://www.wiz.io/wiz-certified/cloud-fundamentals-exam',
  'https://wiz.io/wiz-certified/wiz-certified-defend-fundamentals-exam': 'https://www.wiz.io/wiz-certified/wiz-certified-defend-fundamentals-exam',

  'https://databricks.com/learn/certification/data-engineer-associate': 'https://www.databricks.com/learn/certification/data-engineer-associate',
  'https://databricks.com/learn/certification/data-engineer-professional': 'https://www.databricks.com/learn/certification/data-engineer-professional',
  'https://databricks.com/learn/certification/genai-engineer-associate': 'https://www.databricks.com/learn/certification/genai-engineer-associate',
  'https://databricks.com/learn/certification/machine-learning-professional': 'https://www.databricks.com/learn/certification/machine-learning-professional',
  'https://databricks.com/learn/certification/platform-administrator-accreditation': 'https://www.databricks.com/learn/certification/platform-administrator-accreditation',

  'https://learn.snowflake.com/en/certifications/snowpro-advanced-architect': 'https://learn.snowflake.com/en/certifications/snowpro-advanced-architect/',
  'https://www.citrix.com/training-and-certifications': 'https://www.citrix.com/training-and-certifications/',
  'https://www.zscaler.com/zscaler-academy/ztca-zero-trust-certified-associate': 'https://www.zscaler.com/zscaler-cyber-academy/ztca-zero-trust-cyber-associate',
  'https://www.zscaler.com/zscaler-academy/zscaler-certification': 'https://www.zscaler.com/zscaler-cyber-academy/zscaler-certification',

  'https://aws.amazon.com/certification/certified-database-specialty/': 'https://aws.amazon.com/certification/',

  'https://trailhead.salesforce.com/credentials/systemarchitect': 'https://trailhead.salesforce.com/en/credentials',
  'https://trailhead.salesforce.com/credentials/identityandaccessmanagementarchitect': 'https://trailhead.salesforce.com/en/credentials',
  'https://trailhead.salesforce.com/en/credentials/sharingandvisibilityarchitect': 'https://trailhead.salesforce.com/en/credentials',

  // Linux Foundation trailing-slash redirects
  'https://training.linuxfoundation.org/certification/kubernetes-and-cloud-native-security-associate-kcsa': 'https://training.linuxfoundation.org/certification/kubernetes-and-cloud-native-security-associate-kcsa/',
  'https://training.linuxfoundation.org/certification/certified-cloud-native-platform-engineer-cnpe': 'https://training.linuxfoundation.org/certification/certified-cloud-native-platform-engineer-cnpe/',
  'https://training.linuxfoundation.org/certification/certified-cloud-native-platform-engineering-associate-cnpa': 'https://training.linuxfoundation.org/certification/certified-cloud-native-platform-engineering-associate-cnpa/',
  'https://training.linuxfoundation.org/certification/prometheus-certified-associate': 'https://training.linuxfoundation.org/certification/prometheus-certified-associate/',
  'https://training.linuxfoundation.org/certification/istio-certified-associate-ica': 'https://training.linuxfoundation.org/certification/istio-certified-associate-ica/',
  'https://training.linuxfoundation.org/certification/cilium-certified-associate-cca': 'https://training.linuxfoundation.org/certification/cilium-certified-associate-cca/',
  'https://training.linuxfoundation.org/certification/kyverno-certified-associate-kca': 'https://training.linuxfoundation.org/certification/kyverno-certified-associate-kca/',
  'https://training.linuxfoundation.org/certification/certified-argo-project-associate-capa': 'https://training.linuxfoundation.org/certification/certified-argo-project-associate-capa/',
  'https://training.linuxfoundation.org/certification/certified-gitops-associate-cgoa': 'https://training.linuxfoundation.org/certification/certified-gitops-associate-cgoa/',
  'https://training.linuxfoundation.org/certification/certified-backstage-associate-cba': 'https://training.linuxfoundation.org/certification/certified-backstage-associate-cba/',
};
Object.assign(CERT_FIXES, certRedirects);

// Certs that are genuinely broken 404 but their sites still exist at different paths
// or need to be removed because the cert/vendor is defunct
var certBrokenFixes = {
  'https://www.crest-approved.org/examination/technical-security-architecture/index.html': 'https://www.crest-approved.org/skills-certifications-careers/',
  'https://help.offensive-security.com/hc/en-us/articles/4403282452628-What-is-OSCE3-': 'https://www.offsec.com/courses/',
  'https://www.vmware.com/education-services/certification/vcdx-dcv.html': 'https://www.broadcom.com/support/education/vmware/certification/',
  'https://www.vmware.com/education-services/certification/vcap-dcv-design.html': 'https://www.broadcom.com/support/education/vmware/certification/',
  'https://www.vmware.com/education-services/certification/vcap-nv-deploy.html': 'https://www.broadcom.com/support/education/vmware/certification/',
  'https://www.vmware.com/education-services/certification/vcp-nv-tracks.html': 'https://www.broadcom.com/support/education/vmware/certification/',
  'https://www.seco-institute.org/certifications/information-security-certification-track/': 'https://www.dnv.com/training/',
  'https://www.seco-institute.org/certifications/ethical-hacking-certification-track/': 'https://www.dnv.com/training/path-ethical-hacking/',
  'https://www.seco-institute.org/certifications/ethical-hacking-certification-track/ethical-hacking-foundation/': 'https://www.dnv.com/training/path-ethical-hacking/',
  'https://www.seco-institute.org/certifications/secure-software-certification-track/secure-programming-foundation/': 'https://www.dnv.com/training/path-secure-software/',
  'https://www.seco-institute.org/get-trained/cyber-defense-track/associate-soc-analyst-certification/': 'https://www.dnv.com/training/',
  'https://www.exin.com/certifications/information-security-management-expert-based-isoiec-27001-exam': 'https://www.exin.com/',
  'https://www.exin.com/certifications/information-security-management-professional-based-isoiec-27001-exam': 'https://www.exin.com/',
  'https://www.exin.com/certifications/ccc-professional-cloud-solution-architect-exam': 'https://www.exin.com/',
  'https://www.exin.com/certifications/ccc-professional-cloud-service-manager-exam': 'https://www.exin.com/',
  'https://www.exin.com/certifications/ccc-professional-cloud-developer-exam': 'https://www.exin.com/',
  'https://www.exin.com/certifications/ccc-professional-cloud-security-manager-exam': 'https://www.exin.com/',
  'https://www.exin.com/certifications/ccc-professional-cloud-administrator-exam': 'https://www.exin.com/',
  'https://www.exin.com/certifications/information-security-management-expert-based-isoiec-27001-exam?language_content_entity=en': 'https://www.exin.com/',
  'https://www.exin.com/certifications/information-security-management-professional-based-isoiec-27001-exam': 'https://www.exin.com/',
  'https://www.exin.com/certifications/information-security-foundation-based-iso-iec-27001-exam?language_content_entity=en': 'https://www.exin.com/',
  'https://www.exin.com/certifications/information-security-foundation-based-iso-iec-27001-exam': 'https://www.exin.com/',
  'https://www.exin.com/certifications/exin-privacy-and-data-protection-foundation-exam': 'https://www.exin.com/',
  'https://www.exin.com/certifications/exin-privacy-and-data-protection-essentials-exam': 'https://www.exin.com/',
  'https://www.exin.com/qualification-program/exin-cyber-and-it-security': 'https://www.exin.com/',
  'https://www.crest-approved.org/certification-careers/crest-certifications/crest-certified-simulated-attack-specialist': 'https://www.crest-approved.org/skills-certifications-careers/',
  'https://www.crest-approved.org/certification-careers/crest-certifications/crest-certified-host-intrusion-analyst': 'https://www.crest-approved.org/skills-certifications-careers/',
  'https://www.crest-approved.org/certification-careers/crest-certifications/crest-certified-network-intrusion-analyst': 'https://www.crest-approved.org/skills-certifications-careers/',
  'https://app.infosecinstitute.com/portal/courses/a0t1A000009H5RcQAK': 'https://www.infosecinstitute.com/',
  'https://app.infosecinstitute.com/portal/courses/a0t1A000009H6juQAC': 'https://www.infosecinstitute.com/',
  'https://app.infosecinstitute.com/portal/courses/a0tC0000000Fp4JIAS': 'https://www.infosecinstitute.com/',
  'https://app.infosecinstitute.com/portal/courses/a0tC0000000FovhIAC': 'https://www.infosecinstitute.com/',
  'https://app.infosecinstitute.com/portal/courses/a0tC0000000Fow6IAC': 'https://www.infosecinstitute.com/',
  'https://app.infosecinstitute.com/portal/courses/a0t0y00000BK8IcAAL': 'https://www.infosecinstitute.com/',
  'https://app.infosecinstitute.com/portal/courses/a0tC0000000Fp4IIAS': 'https://www.infosecinstitute.com/',
  'https://app.infosecinstitute.com/portal/courses/a0t0y000009lTzjAAE': 'https://www.infosecinstitute.com/',
  'https://portswigger.net/web-security/certification': 'https://portswigger.net/web-security',
  'https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html': 'https://www.cisco.com/site/us/en/learn/training-certifications/certifications/enterprise/ccna/index.html',
  'https://cloudsecurityalliance.org/education/cloud-governance-and-compliance/': 'https://cloudsecurityalliance.org/education/',
  'https://www.bcs.org/get-qualified/certifications-for-professionals/information-security-and-ccp-scheme-certifications/bcs-practitioner-certificate-in-information-risk-management/': 'https://www.bcs.org/',
  'https://www.bcs.org/get-qualified/certifications-for-professionals/information-security-and-ccp-scheme-certifications/bcs-practitioner-certificate-in-information-assurance-architecture/': 'https://www.bcs.org/',
  'https://www.bcs.org/get-qualified/certifications-for-professionals/information-security-and-ccp-scheme-certifications/bcs-foundation-certificate-in-information-security-management-principles/': 'https://www.bcs.org/',
  'https://thecyberscheme.org/cyber-scheme-team-leader-cstl-exam/': 'https://thecyberscheme.org/',
  'https://thecyberscheme.org/cyber-scheme-team-member-cstm-exam/': 'https://thecyberscheme.org/',
  'https://www.isfce.com/certification.htm': 'https://www.isfce.com/',
  'https://www.exidacace.com/Apply/CACE': 'https://www.exida.com/',
  'https://www.exidacace.com/Apply/CACS': 'https://www.exida.com/',
  'https://risklens-academy.myshopify.com/collections/popular-courses/products/fair-analysis-fundamentals-2': 'https://safe.security/',
  'https://www.ismi.org.uk/csmp/csmp%C2%AE-overview.aspx': 'https://www.ismi.org.uk/',
  'https://www.ismi.org.uk/csmp/certified-security-manager%C2%AE': 'https://www.ismi.org.uk/',
  'https://www.ciisec.org/ICSF_Exam': 'https://www.ciisec.org/',
  'https://www.iiba.org/certification/iiba-certifications/specialized-business-analysis-certifications/certificate-in-cybersecurity-analysis/': 'https://www.iiba.org/',
  'https://kali.training/klcp/': 'https://www.kali.org/blog/',
  'https://certnexus.com/certification/ciotsp/': 'https://certnexus.com/',
  'https://pecb.com/en/education-and-certification-for-individuals/iso-iec-27032/iso-iec-27032-lead-cyber-security-manager': 'https://pecb.com/',
  'https://pecb.com/en/education-and-certification-for-individuals/iso-iec-27032/iso-iec-27032-foundation': 'https://pecb.com/',
  'https://ecfirst.biz/index.php?route=product/product&#038;path=59_83&#038;product_id=281': 'https://ecfirst.biz/',
  'https://ecfirst.biz/index.php?route=product/product&#038;path=59_61&#038;product_id=77': 'https://ecfirst.biz/',
  'https://ecfirst.biz/index.php?route=product/product&#038;path=59_61&#038;product_id=89': 'https://ecfirst.biz/',
  'https://secops.group/product/certified-mobile-pentester-cmpen-android/': 'https://secops.group/',
  'https://mad20.io/mad/': null,
  'https://training.apple.com/us/en/recognition': 'https://support.apple.com/en-us',
  'https://education.oracle.com/oracle-cloud-infrastructure-foundations': 'https://education.oracle.com/',
  'https://education.oracle.com/oracle-cloud-infrastructure-2025-certified-security-professional': 'https://education.oracle.com/',
  'https://www.pentesteracademy.com/gcb': 'https://www.pentesteracademy.com/',
  'https://www.onetrust.com/certifications/part-2-onetrust-professional-certification': 'https://www.onetrust.com/certifications/',
  'https://learn.microsoft.com/en-us/credentials/certifications/github-admin/': 'https://learn.microsoft.com/en-us/credentials/browse/',
  'https://pubs.opengroup.org/togaf-standard/': 'https://www.opengroup.org/togaf',
};
Object.assign(CERT_FIXES, certBrokenFixes);


// ─── Apply fixes ───
function fixFile(filePath, urlField, fixes, nameFixes, removeNulls) {
  var data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  var updated = 0;
  var removed = 0;
  var renamed = 0;

  var filtered = [];
  data.forEach(function(entry) {
    var url = entry[urlField];
    if (url && fixes[url] !== undefined) {
      if (fixes[url] === null && removeNulls) {
        console.log('  REMOVE: ' + entry.id + ' | ' + entry.name + ' | ' + url);
        removed++;
        return;
      } else if (fixes[url] !== null) {
        console.log('  FIX:    ' + entry.id + ' | ' + url + ' → ' + fixes[url]);
        entry[urlField] = fixes[url];
        updated++;
      }
    }
    if (entry.trainingUrl && fixes[entry.trainingUrl] !== undefined) {
      if (fixes[entry.trainingUrl] !== null) {
        console.log('  FIX(t): ' + entry.id + ' | ' + entry.trainingUrl + ' → ' + fixes[entry.trainingUrl]);
        entry.trainingUrl = fixes[entry.trainingUrl];
        updated++;
      }
    }
    if (nameFixes && nameFixes[entry.id]) {
      console.log('  RENAME: ' + entry.id + ' | "' + entry.name + '" → "' + nameFixes[entry.id] + '"');
      entry.name = nameFixes[entry.id];
      renamed++;
    }
    filtered.push(entry);
  });

  fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2) + '\n', 'utf8');
  return { updated: updated, removed: removed, renamed: renamed };
}

console.log('=== Fixing free-resources.json ===');
var frResult = fixFile(
  path.join(DATA_DIR, 'free-resources.json'),
  'url',
  FREE_RESOURCE_FIXES,
  FREE_RESOURCE_NAME_FIXES,
  true
);
console.log('  Updated: ' + frResult.updated + ', Removed: ' + frResult.removed + ', Renamed: ' + frResult.renamed);

console.log('\n=== Fixing certs.json ===');
var certResult = fixFile(
  path.join(DATA_DIR, 'certs.json'),
  'url',
  CERT_FIXES,
  null,
  true
);
console.log('  Updated: ' + certResult.updated + ', Removed: ' + certResult.removed);

console.log('\nDone. Total fixes applied: ' + (frResult.updated + frResult.removed + frResult.renamed + certResult.updated + certResult.removed));

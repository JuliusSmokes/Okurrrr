#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const RESOURCES_PATH = path.resolve(__dirname, '..', 'data', 'free-resources.json');

const newEntries = [
  // ── Network Defense & Monitoring ──
  {
    name: "Snort 3 – Open Source IDS/IPS",
    provider: "Cisco / Snort Project",
    url: "https://www.snort.org/",
    description: "Industry-leading open-source intrusion detection and prevention system with real-time traffic analysis and packet logging.",
    category: "Network Security",
    tags: ["IDS", "IPS", "Snort", "network monitoring", "open source"],
    level: "Intermediate",
    cisspDomains: ["cissp-d4", "cissp-d6"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["sec-plus", "ceh"]
  },
  {
    name: "CrowdSec – Collaborative Security Engine",
    provider: "CrowdSec",
    url: "https://www.crowdsec.net/",
    description: "Open-source and collaborative IPS that leverages crowd-sourced threat intelligence to detect and block attacks.",
    category: "Network Security",
    tags: ["IPS", "crowd intelligence", "open source", "behavioral"],
    level: "Intermediate",
    cisspDomains: ["cissp-d4", "cissp-d6"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "Fail2ban",
    provider: "Fail2ban Project",
    url: "https://github.com/fail2ban/fail2ban",
    description: "Scans log files and bans IPs showing malicious signs — brute force, scanning, etc. Integrates with iptables, firewalld, and nftables.",
    category: "Network Security",
    tags: ["brute force", "log analysis", "firewall", "open source"],
    level: "Beginner",
    cisspDomains: ["cissp-d4", "cissp-d6"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "Ettercap – Network Sniffer & MITM Tool",
    provider: "Ettercap Project",
    url: "https://www.ettercap-project.org/",
    description: "Comprehensive suite for man-in-the-middle attacks on LAN, featuring sniffing, content filtering, and active protocol dissection.",
    category: "Red Team and Adversary Simulation",
    tags: ["MITM", "ARP spoofing", "network sniffing", "open source"],
    level: "Advanced",
    cisspDomains: ["cissp-d4"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["ceh", "oscp"]
  },
  {
    name: "Bettercap – Network Attack & Monitoring Framework",
    provider: "bettercap.org",
    url: "https://www.bettercap.org/",
    description: "Swiss Army knife for 802.11, BLE, IPv4/IPv6 network reconnaissance, MITM attacks, and WiFi monitoring.",
    category: "Red Team and Adversary Simulation",
    tags: ["MITM", "WiFi", "BLE", "network", "open source"],
    level: "Advanced",
    cisspDomains: ["cissp-d4"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["ceh", "oscp"]
  },
  {
    name: "mitmproxy – Interactive HTTPS Proxy",
    provider: "mitmproxy Project",
    url: "https://mitmproxy.org/",
    description: "Free and open-source interactive HTTPS proxy for intercepting, inspecting, modifying, and replaying web traffic flows.",
    category: "Network Security",
    tags: ["proxy", "HTTPS", "traffic analysis", "debugging"],
    level: "Intermediate",
    cisspDomains: ["cissp-d4"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "Masscan – High-Speed Port Scanner",
    provider: "Robert David Graham",
    url: "https://github.com/robertdavidgraham/masscan",
    description: "Internet-scale port scanner capable of scanning the entire Internet in under 6 minutes. Produces SYN scan results similar to nmap.",
    category: "Red Team and Adversary Simulation",
    tags: ["port scanner", "recon", "network", "open source"],
    level: "Intermediate",
    cisspDomains: ["cissp-d4"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["ceh", "oscp"]
  },

  // ── Host Hardening & Endpoint Security ──
  {
    name: "OpenSCAP – SCAP Security Scanner",
    provider: "OpenSCAP Project",
    url: "https://www.open-scap.org/",
    description: "Open-source SCAP compliance scanner providing automated vulnerability assessment and policy compliance checking.",
    category: "Vulnerability Management",
    tags: ["SCAP", "compliance", "CIS benchmarks", "STIG", "open source"],
    level: "Intermediate",
    cisspDomains: ["cissp-d6", "cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "osquery – Endpoint Visibility as SQL",
    provider: "osquery Foundation",
    url: "https://osquery.io/",
    description: "Query your endpoints like a database. Uses SQL tables to expose OS-level info — processes, users, file integrity, network state.",
    category: "Vulnerability Management",
    tags: ["endpoint", "visibility", "SQL", "fleet management", "open source"],
    level: "Intermediate",
    cisspDomains: ["cissp-d6", "cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "ClamAV – Open Source Antivirus",
    provider: "Cisco / ClamAV Project",
    url: "https://www.clamav.net/",
    description: "Open-source antivirus engine for detecting trojans, viruses, malware, and other threats. Widely used for email gateway and file scanning.",
    category: "Vulnerability Management",
    tags: ["antivirus", "malware detection", "email security", "open source"],
    level: "Beginner",
    cisspDomains: ["cissp-d6"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "ModSecurity – Open Source WAF",
    provider: "Trustwave SpiderLabs",
    url: "https://github.com/owasp-modsecurity/ModSecurity",
    description: "Cross-platform open-source WAF engine for Apache, Nginx, and IIS. Foundation for OWASP Core Rule Set.",
    category: "Application Security",
    tags: ["WAF", "web application firewall", "ModSecurity", "open source"],
    level: "Intermediate",
    cisspDomains: ["cissp-d4", "cissp-d8"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "GnuPG – GNU Privacy Guard",
    provider: "GnuPG Project",
    url: "https://gnupg.org/",
    description: "Complete free implementation of the OpenPGP standard for encrypting data and creating digital signatures.",
    category: "Cryptography",
    tags: ["PGP", "encryption", "digital signatures", "open source"],
    level: "Intermediate",
    cisspDomains: ["cissp-d3"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: []
  },

  // ── AD / Privilege Escalation ──
  {
    name: "Responder – LLMNR/NBT-NS/mDNS Poisoner",
    provider: "Laurent Gaffie",
    url: "https://github.com/lgandx/Responder",
    description: "LLMNR, NBT-NS, and mDNS poisoner for credential theft. Includes built-in HTTP/SMB/MSSQL/FTP/LDAP rogue auth servers.",
    category: "Red Team and Adversary Simulation",
    tags: ["Active Directory", "LLMNR", "credential theft", "open source"],
    level: "Advanced",
    cisspDomains: ["cissp-d4", "cissp-d5"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["oscp"]
  },
  {
    name: "Impacket – Network Protocol Toolkit",
    provider: "Fortra (SecureAuth)",
    url: "https://github.com/fortra/impacket",
    description: "Python classes for working with network protocols — SMB, MSRPC, Kerberos, LDAP. Essential toolkit for AD attacks and lateral movement.",
    category: "Red Team and Adversary Simulation",
    tags: ["Active Directory", "Kerberos", "SMB", "lateral movement", "Python"],
    level: "Advanced",
    cisspDomains: ["cissp-d4", "cissp-d5"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["oscp"]
  },
  {
    name: "Mimikatz – Credential Extraction Toolkit",
    provider: "Benjamin Delpy",
    url: "https://github.com/gentilkiwi/mimikatz",
    description: "Windows credential extraction tool — extracts plaintext passwords, hashes, PIN codes, and Kerberos tickets from memory.",
    category: "Red Team and Adversary Simulation",
    tags: ["credentials", "Windows", "Kerberos", "pass-the-hash"],
    level: "Advanced",
    cisspDomains: ["cissp-d5"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["oscp"]
  },
  {
    name: "Hashcat – Advanced Password Recovery",
    provider: "Hashcat Project",
    url: "https://hashcat.net/hashcat/",
    description: "World's fastest password recovery utility supporting 300+ hash types with GPU acceleration.",
    category: "Red Team and Adversary Simulation",
    tags: ["password cracking", "GPU", "hashing", "open source"],
    level: "Intermediate",
    cisspDomains: ["cissp-d3", "cissp-d5"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["ceh", "oscp"]
  },
  {
    name: "John the Ripper – Password Cracker",
    provider: "Openwall Project",
    url: "https://www.openwall.com/john/",
    description: "Classic open-source password security auditing and recovery tool supporting hundreds of hash and cipher types.",
    category: "Red Team and Adversary Simulation",
    tags: ["password cracking", "audit", "open source"],
    level: "Intermediate",
    cisspDomains: ["cissp-d3", "cissp-d5"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["ceh", "oscp"]
  },
  {
    name: "PingCastle – Active Directory Security Audit",
    provider: "Vincent Le Toux",
    url: "https://www.pingcastle.com/",
    description: "Runs a comprehensive health check on Active Directory — identifies misconfigurations, stale accounts, dangerous trusts, and attack paths.",
    category: "Red Team and Adversary Simulation",
    tags: ["Active Directory", "audit", "health check", "Windows"],
    level: "Intermediate",
    cisspDomains: ["cissp-d5"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "enum4linux-ng – SMB/AD Enumeration",
    provider: "cddmp",
    url: "https://github.com/cddmp/enum4linux-ng",
    description: "Next-generation rewrite of enum4linux for enumerating Windows/Samba systems — users, groups, shares, password policies.",
    category: "Red Team and Adversary Simulation",
    tags: ["Active Directory", "SMB", "enumeration", "open source"],
    level: "Intermediate",
    cisspDomains: ["cissp-d5"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["oscp"]
  },
  {
    name: "ADRecon – Active Directory Recon Tool",
    provider: "Prashant Mahajan",
    url: "https://github.com/adrecon/ADRecon",
    description: "Gathers AD information using ADSI and outputs into Excel/CSV/HTML for offline analysis — GPOs, trusts, DNS, LAPS, etc.",
    category: "Red Team and Adversary Simulation",
    tags: ["Active Directory", "reconnaissance", "PowerShell"],
    level: "Intermediate",
    cisspDomains: ["cissp-d5"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },

  // ── Web Application Recon & Scanning ──
  {
    name: "sqlmap – Automated SQL Injection Tool",
    provider: "sqlmap Project",
    url: "https://sqlmap.org/",
    description: "Automatic SQL injection and database takeover tool supporting all major DBMS platforms.",
    category: "Application Security",
    tags: ["SQL injection", "web security", "database", "open source"],
    level: "Intermediate",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["ceh", "oscp"]
  },
  {
    name: "ffuf – Fast Web Fuzzer",
    provider: "joohoi",
    url: "https://github.com/ffuf/ffuf",
    description: "Fast web fuzzer written in Go for directory brute forcing, virtual host discovery, parameter fuzzing, and POST data fuzzing.",
    category: "Application Security",
    tags: ["fuzzing", "directory brute force", "web recon", "Go"],
    level: "Intermediate",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["oscp"]
  },
  {
    name: "gobuster – Directory/DNS/VHost Busting Tool",
    provider: "OJ Reeves",
    url: "https://github.com/OJ/gobuster",
    description: "Brute-forces URIs, DNS subdomains, virtual host names, S3 buckets, and Google Cloud buckets. Written in Go.",
    category: "Application Security",
    tags: ["directory brute force", "DNS", "S3", "Go"],
    level: "Intermediate",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["oscp"]
  },
  {
    name: "subfinder – Fast Subdomain Discovery",
    provider: "ProjectDiscovery",
    url: "https://github.com/projectdiscovery/subfinder",
    description: "Passive subdomain enumeration tool using multiple sources — Shodan, Censys, Chaos, VirusTotal, SecurityTrails, etc.",
    category: "Application Security",
    tags: ["subdomain", "recon", "OSINT", "Go"],
    level: "Intermediate",
    cisspDomains: ["cissp-d4"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "httpx – Fast Multi-Purpose HTTP Toolkit",
    provider: "ProjectDiscovery",
    url: "https://github.com/projectdiscovery/httpx",
    description: "Probes web servers at scale — extracts status codes, titles, tech stack, TLS info, and content hashes.",
    category: "Application Security",
    tags: ["HTTP", "recon", "web probing", "Go"],
    level: "Intermediate",
    cisspDomains: ["cissp-d4"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "katana – Web Crawler by ProjectDiscovery",
    provider: "ProjectDiscovery",
    url: "https://github.com/projectdiscovery/katana",
    description: "Next-gen crawling and spidering framework with JavaScript rendering, scope control, and output filtering.",
    category: "Application Security",
    tags: ["crawler", "spider", "recon", "Go"],
    level: "Intermediate",
    cisspDomains: ["cissp-d4"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "testssl.sh – TLS/SSL Testing Tool",
    provider: "testssl.sh Project",
    url: "https://testssl.sh/",
    description: "Command-line tool for checking TLS/SSL ciphers, protocols, and cryptographic flaws on any port, not just HTTPS.",
    category: "Cryptography",
    tags: ["TLS", "SSL", "testing", "compliance"],
    level: "Intermediate",
    cisspDomains: ["cissp-d3"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "WhatWeb – Next Generation Web Scanner",
    provider: "Andrew Horton",
    url: "https://github.com/urbanadventurer/WhatWeb",
    description: "Identifies websites — CMS, frameworks, web servers, embedded devices, JavaScript libraries, and analytics platforms.",
    category: "Application Security",
    tags: ["fingerprinting", "web recon", "CMS", "open source"],
    level: "Beginner",
    cisspDomains: ["cissp-d4"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "Wapiti – Web Vulnerability Scanner",
    provider: "Wapiti Project",
    url: "https://wapiti-scanner.github.io/",
    description: "Open-source web vulnerability scanner supporting XSS, SQLi, CRLF, file disclosure, SSRF, and more. Black-box testing approach.",
    category: "Application Security",
    tags: ["vulnerability scanner", "web security", "black box", "open source"],
    level: "Intermediate",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["ceh"]
  },

  // ── Forensics & Reverse Engineering ──
  {
    name: "CAINE – Computer Aided Investigative Environment",
    provider: "CAINE Project",
    url: "https://www.caine-live.net/",
    description: "Complete Linux live distribution for digital forensics featuring Autopsy, Sleuth Kit, Guymager, and dozens of forensic tools.",
    category: "Digital Forensics",
    tags: ["forensics", "live distribution", "imaging", "analysis"],
    level: "Intermediate",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Investigate"],
    relatedCertIds: []
  },
  {
    name: "REMnux – Malware Analysis Linux Distro",
    provider: "Lenny Zeltser / SANS",
    url: "https://remnux.org/",
    description: "Linux toolkit for reverse-engineering and analyzing malicious software. Includes 500+ tools for static/dynamic malware analysis.",
    category: "Digital Forensics",
    tags: ["malware analysis", "reverse engineering", "Linux distro"],
    level: "Advanced",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Investigate"],
    relatedCertIds: []
  },
  {
    name: "FLARE VM – Windows Malware Analysis Distribution",
    provider: "Mandiant / Google",
    url: "https://github.com/mandiant/flare-vm",
    description: "Windows-based malware analysis and reverse engineering distribution. Installer script that turns a Windows VM into a full analysis environment.",
    category: "Digital Forensics",
    tags: ["malware analysis", "reverse engineering", "Windows", "Mandiant"],
    level: "Advanced",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Investigate"],
    relatedCertIds: []
  },
  {
    name: "radare2 – Reverse Engineering Framework",
    provider: "radare2 Project",
    url: "https://rada.re/n/radare2.html",
    description: "Free/libre reverse engineering framework — disassembler, debugger, binary analysis, patching, and exploitation toolkit.",
    category: "Digital Forensics",
    tags: ["reverse engineering", "disassembler", "binary analysis", "open source"],
    level: "Advanced",
    cisspDomains: ["cissp-d7", "cissp-d8"],
    niceCategories: ["Investigate"],
    relatedCertIds: []
  },
  {
    name: "Cutter – Free RE Platform (powered by rizin)",
    provider: "rizin / Cutter Team",
    url: "https://cutter.re/",
    description: "Free and open-source reverse engineering platform with integrated decompiler, graph view, and Python scripting. Successor to r2 GUI.",
    category: "Digital Forensics",
    tags: ["reverse engineering", "decompiler", "GUI", "open source"],
    level: "Advanced",
    cisspDomains: ["cissp-d7", "cissp-d8"],
    niceCategories: ["Investigate"],
    relatedCertIds: []
  },

  // ── Supply Chain & Container Security ──
  {
    name: "Grype – Container Vulnerability Scanner",
    provider: "Anchore",
    url: "https://github.com/anchore/grype",
    description: "Fast vulnerability scanner for container images and filesystems. Matches against multiple vulnerability databases.",
    category: "Supply Chain Security",
    tags: ["container", "vulnerability scanner", "SBOM", "open source"],
    level: "Intermediate",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: []
  },
  {
    name: "Syft – SBOM Generator",
    provider: "Anchore",
    url: "https://github.com/anchore/syft",
    description: "Generates software bill of materials (SBOMs) from container images and filesystems. Supports SPDX, CycloneDX, and Syft formats.",
    category: "Supply Chain Security",
    tags: ["SBOM", "container", "dependencies", "open source"],
    level: "Intermediate",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: []
  },
  {
    name: "Sigstore / cosign – Keyless Container Signing",
    provider: "Sigstore / Linux Foundation",
    url: "https://www.sigstore.dev/",
    description: "Sign, verify, and protect software supply chain artifacts. cosign enables keyless signing of container images via OIDC identity.",
    category: "Supply Chain Security",
    tags: ["signing", "container", "supply chain", "OIDC", "open source"],
    level: "Intermediate",
    cisspDomains: ["cissp-d3", "cissp-d8"],
    niceCategories: ["Securely Provision"],
    relatedCertIds: []
  },

  // ── Cloud Security Posture ──
  {
    name: "Prowler – AWS/Azure/GCP Security Auditor",
    provider: "Prowler / Toni de la Fuente",
    url: "https://github.com/prowler-cloud/prowler",
    description: "Open-source multi-cloud security tool for AWS, Azure, and GCP. Checks CIS benchmarks, GDPR, HIPAA, PCI DSS, and 300+ controls.",
    category: "Cloud Security",
    tags: ["CSPM", "AWS", "Azure", "GCP", "compliance", "open source"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d6"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "ScoutSuite – Multi-Cloud Security Auditing",
    provider: "NCC Group",
    url: "https://github.com/nccgroup/ScoutSuite",
    description: "Multi-cloud security auditing tool for AWS, Azure, GCP, Alibaba Cloud, and Oracle Cloud. Generates HTML reports.",
    category: "Cloud Security",
    tags: ["CSPM", "multi-cloud", "audit", "open source"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d6"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "Steampipe – Query Cloud APIs with SQL",
    provider: "Turbot",
    url: "https://steampipe.io/",
    description: "Query any cloud API as SQL tables — AWS, Azure, GCP, Kubernetes, GitHub, and 140+ plugins. Built-in compliance benchmarks.",
    category: "Cloud Security",
    tags: ["SQL", "cloud API", "compliance", "multi-cloud", "open source"],
    level: "Intermediate",
    cisspDomains: ["cissp-d1", "cissp-d6"],
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
console.log('Batch B complete: added ' + added + ', skipped ' + skipped + ', total now ' + resources.length);

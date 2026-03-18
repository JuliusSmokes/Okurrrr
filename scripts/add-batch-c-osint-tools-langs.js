#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const RESOURCES_PATH = path.resolve(__dirname, '..', 'data', 'free-resources.json');

const newEntries = [
  // ── OSINT Tools ──
  {
    name: "SpiderFoot – OSINT Automation",
    provider: "SpiderFoot Project",
    url: "https://github.com/smicallef/spiderfoot",
    description: "Open-source OSINT automation tool integrating 200+ data sources for reconnaissance on IPs, domains, emails, names, and more.",
    category: "OSINT",
    tags: ["OSINT", "recon", "automation", "threat intelligence"],
    level: "Intermediate",
    cisspDomains: ["cissp-d4", "cissp-d7"],
    niceCategories: ["Investigate"],
    relatedCertIds: []
  },
  {
    name: "theHarvester – Email & Subdomain Harvester",
    provider: "Laramies / Christian Martorella",
    url: "https://github.com/laramies/theHarvester",
    description: "Gathers emails, subdomains, hosts, employee names, open ports, and banners from public sources for reconnaissance.",
    category: "OSINT",
    tags: ["OSINT", "email", "subdomain", "recon"],
    level: "Beginner",
    cisspDomains: ["cissp-d4"],
    niceCategories: ["Investigate"],
    relatedCertIds: ["ceh"]
  },
  {
    name: "Shodan – Internet Device Search Engine",
    provider: "Shodan",
    url: "https://www.shodan.io/",
    description: "Search engine for Internet-connected devices — find exposed services, vulnerabilities, and misconfigurations across the global attack surface.",
    category: "OSINT",
    tags: ["OSINT", "IoT", "attack surface", "search engine"],
    level: "Intermediate",
    cisspDomains: ["cissp-d4"],
    niceCategories: ["Investigate"],
    relatedCertIds: []
  },
  {
    name: "crt.sh – Certificate Transparency Search",
    provider: "Sectigo",
    url: "https://crt.sh/",
    description: "Free certificate transparency log search. Discover subdomains, certificate issuance history, and potential shadow IT via CT logs.",
    category: "OSINT",
    tags: ["certificate transparency", "subdomain", "recon", "TLS"],
    level: "Beginner",
    cisspDomains: ["cissp-d3", "cissp-d4"],
    niceCategories: ["Investigate"],
    relatedCertIds: []
  },
  {
    name: "OSINT Framework",
    provider: "Justin Nordine",
    url: "https://osintframework.com/",
    description: "Comprehensive collection of OSINT tools organized by category — username, email, domain, IP, social media, dark web, and more.",
    category: "OSINT",
    tags: ["OSINT", "framework", "collection", "investigation"],
    level: "Beginner",
    cisspDomains: ["cissp-d4", "cissp-d7"],
    niceCategories: ["Investigate"],
    relatedCertIds: []
  },

  // ── Kali & Parrot ──
  {
    name: "Kali Linux Tools Listing",
    provider: "Offensive Security",
    url: "https://www.kali.org/tools/",
    description: "Complete index of every tool bundled with Kali Linux — descriptions, usage, categories, and package details for 600+ security tools.",
    category: "Labs",
    tags: ["Kali", "tools", "penetration testing", "catalog"],
    level: "Beginner",
    cisspDomains: ["cissp-d6"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["oscp", "ceh"]
  },
  {
    name: "Parrot Security OS",
    provider: "Parrot Security",
    url: "https://parrotsec.org/",
    description: "Debian-based security-oriented Linux distro for penetration testing, digital forensics, reverse engineering, and privacy-focused development.",
    category: "Labs",
    tags: ["Parrot", "Linux", "penetration testing", "forensics"],
    level: "Beginner",
    cisspDomains: ["cissp-d6"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["oscp", "ceh"]
  },

  // ── Cheat Sheets & References ──
  {
    name: "GTFOBins – Unix Binaries for Privilege Escalation",
    provider: "GTFOBins Project",
    url: "https://gtfobins.github.io/",
    description: "Curated list of Unix binaries that can be exploited to bypass local security restrictions — file read/write, SUID, sudo abuse.",
    category: "Red Team and Adversary Simulation",
    tags: ["privilege escalation", "Linux", "SUID", "cheat sheet"],
    level: "Intermediate",
    cisspDomains: ["cissp-d5"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["oscp"]
  },
  {
    name: "LOLBAS – Living Off The Land Binaries (Windows)",
    provider: "LOLBAS Project",
    url: "https://lolbas-project.github.io/",
    description: "Documents Windows binaries, scripts, and libraries that can be used for living-off-the-land techniques — execution, persistence, evasion.",
    category: "Red Team and Adversary Simulation",
    tags: ["Windows", "LOLBins", "evasion", "cheat sheet"],
    level: "Intermediate",
    cisspDomains: ["cissp-d5"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["oscp"]
  },
  {
    name: "WADComs – Offensive Security Cheat Sheet",
    provider: "WADComs Project",
    url: "https://wadcoms.github.io/",
    description: "Interactive cheat sheet for AD/Windows/Linux offensive security tools — searchable commands for Impacket, CrackMapExec, Rubeus, etc.",
    category: "Red Team and Adversary Simulation",
    tags: ["cheat sheet", "Active Directory", "commands", "offensive"],
    level: "Intermediate",
    cisspDomains: ["cissp-d5"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["oscp"]
  },
  {
    name: "PEASS-ng – Privilege Escalation Awesome Scripts Suite",
    provider: "Carlos Polop",
    url: "https://github.com/peass-ng/PEASS-ng",
    description: "LinPEAS + WinPEAS — automated privilege escalation enumeration scripts for Linux and Windows. The go-to privesc checkers.",
    category: "Red Team and Adversary Simulation",
    tags: ["privilege escalation", "Linux", "Windows", "enumeration"],
    level: "Intermediate",
    cisspDomains: ["cissp-d5"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["oscp"]
  },
  {
    name: "RevShells – Reverse Shell Generator",
    provider: "RevShells",
    url: "https://www.revshells.com/",
    description: "Online reverse shell payload generator supporting Bash, Python, PowerShell, PHP, Java, and more. Configurable IP, port, and encoding.",
    category: "Red Team and Adversary Simulation",
    tags: ["reverse shell", "payload", "generator", "cheat sheet"],
    level: "Intermediate",
    cisspDomains: ["cissp-d5"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["oscp"]
  },

  // ── Cybersecurity MCPs ──
  {
    name: "Shodan MCP Server",
    provider: "BurtTheCoder",
    url: "https://github.com/BurtTheCoder/mcp-shodan",
    description: "Model Context Protocol server providing AI assistants with access to Shodan's internet scanning data — host lookup, search, DNS, and exploits.",
    category: "AI and LLM Security",
    tags: ["MCP", "Shodan", "AI", "OSINT", "automation"],
    level: "Intermediate",
    cisspDomains: ["cissp-d4"],
    niceCategories: ["Investigate"],
    relatedCertIds: []
  },
  {
    name: "VirusTotal MCP Server",
    provider: "BurtTheCoder",
    url: "https://github.com/BurtTheCoder/mcp-virustotal",
    description: "MCP server providing AI agents with VirusTotal threat intelligence — file/URL/IP/domain scanning and analysis reports.",
    category: "AI and LLM Security",
    tags: ["MCP", "VirusTotal", "AI", "threat intelligence"],
    level: "Intermediate",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Investigate"],
    relatedCertIds: []
  },
  {
    name: "MITRE ATT&CK MCP Server",
    provider: "BurtTheCoder",
    url: "https://github.com/BurtTheCoder/mcp-mitre-attack",
    description: "MCP server enabling AI agents to query the MITRE ATT&CK knowledge base — techniques, tactics, software, groups, and mitigations.",
    category: "AI and LLM Security",
    tags: ["MCP", "MITRE ATT&CK", "AI", "threat intelligence"],
    level: "Intermediate",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Investigate"],
    relatedCertIds: []
  },

  // ── Programming Languages for Security ──
  {
    name: "Go by Example",
    provider: "Mark McGranaghan",
    url: "https://gobyexample.com/",
    description: "Hands-on introduction to Go using annotated example programs. Go is widely used for security tooling (ffuf, subfinder, nuclei, etc.).",
    category: "Computer Science Foundations",
    tags: ["Go", "Golang", "programming", "examples"],
    level: "Beginner",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "The Go Programming Language Tour",
    provider: "Google / Go Team",
    url: "https://go.dev/tour/",
    description: "Official interactive Go tutorial covering basics, methods, interfaces, concurrency, and error handling in an in-browser environment.",
    category: "Computer Science Foundations",
    tags: ["Go", "Golang", "tutorial", "official"],
    level: "Beginner",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "Rust Book – The Rust Programming Language",
    provider: "Rust Foundation",
    url: "https://doc.rust-lang.org/book/",
    description: "Official Rust language book. Rust's memory safety guarantees make it increasingly popular for security-critical systems and tooling.",
    category: "Computer Science Foundations",
    tags: ["Rust", "programming", "memory safety", "official"],
    level: "Beginner",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "Bash Scripting Cheatsheet",
    provider: "devhints.io",
    url: "https://devhints.io/bash",
    description: "Quick reference for Bash scripting — variables, conditionals, loops, functions, string manipulation, and file operations.",
    category: "Computer Science Foundations",
    tags: ["Bash", "shell", "scripting", "cheat sheet"],
    level: "Beginner",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "x86 Assembly Guide (UVA CS)",
    provider: "University of Virginia",
    url: "https://www.cs.virginia.edu/~evans/cs216/guides/x86.html",
    description: "Concise x86 assembly language reference covering registers, instructions, calling conventions, and memory addressing.",
    category: "Computer Science Foundations",
    tags: ["assembly", "x86", "low-level", "reverse engineering"],
    level: "Advanced",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "LangChain Documentation",
    provider: "LangChain",
    url: "https://python.langchain.com/docs/introduction/",
    description: "Framework for building LLM-powered applications. Critical for understanding AI agent architectures and their security implications.",
    category: "AI and LLM Security",
    tags: ["LangChain", "LLM", "AI agents", "Python"],
    level: "Intermediate",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },
  {
    name: "Markdown Guide",
    provider: "Matt Cone",
    url: "https://www.markdownguide.org/",
    description: "Comprehensive Markdown reference. Essential for documentation, security reports, pentest writeups, and README files.",
    category: "Computer Science Foundations",
    tags: ["Markdown", "documentation", "writing", "reference"],
    level: "Beginner",
    cisspDomains: ["cissp-d8"],
    niceCategories: ["Design and Development"],
    relatedCertIds: []
  },

  // ── C2 Framework ──
  {
    name: "PowerShell Empire – Post-Exploitation Framework",
    provider: "BC Security",
    url: "https://github.com/BC-SECURITY/Empire",
    description: "Post-exploitation and adversary emulation framework with PowerShell and Python agents. Maintained by BC Security after original project sunset.",
    category: "Red Team and Adversary Simulation",
    tags: ["C2", "post-exploitation", "PowerShell", "adversary emulation"],
    level: "Advanced",
    cisspDomains: ["cissp-d5", "cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["oscp"]
  },

  // ── Pentest Reporting ──
  {
    name: "SysReptor – Pentest Reporting Platform",
    provider: "SysReptor",
    url: "https://github.com/Syslifters/sysreptor",
    description: "Self-hosted pentest reporting platform with collaborative editing, customizable templates, and automated finding management.",
    category: "Red Team and Adversary Simulation",
    tags: ["pentest reporting", "self-hosted", "collaborative", "templates"],
    level: "Intermediate",
    cisspDomains: ["cissp-d6"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["oscp"]
  },
  {
    name: "Ghostwriter – Engagement Management & Reporting",
    provider: "SpecterOps",
    url: "https://github.com/GhostManager/Ghostwriter",
    description: "Red team engagement management and reporting platform — tracks infrastructure, findings, and generates client-ready reports.",
    category: "Red Team and Adversary Simulation",
    tags: ["pentest reporting", "engagement management", "SpecterOps"],
    level: "Intermediate",
    cisspDomains: ["cissp-d6"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["oscp"]
  },
  {
    name: "PwnDoc – Pentest Report Generator",
    provider: "PwnDoc Project",
    url: "https://github.com/pwndoc/pwndoc",
    description: "Pentest report generator with vulnerability management, customizable templates, and multi-user collaboration.",
    category: "Red Team and Adversary Simulation",
    tags: ["pentest reporting", "vulnerability management", "templates"],
    level: "Intermediate",
    cisspDomains: ["cissp-d6"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["oscp"]
  },
  {
    name: "WriteHat – Web-Based Pentest Reporting",
    provider: "WriteHat Project",
    url: "https://github.com/blacklanternsecurity/writehat",
    description: "Web-based pentest reporting tool with a simple interface for creating, editing, and exporting professional security reports.",
    category: "Red Team and Adversary Simulation",
    tags: ["pentest reporting", "web-based", "simple"],
    level: "Intermediate",
    cisspDomains: ["cissp-d6"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },

  // ── SIEM Query Languages ──
  {
    name: "Elastic EQL – Event Query Language Reference",
    provider: "Elastic",
    url: "https://www.elastic.co/guide/en/elasticsearch/reference/current/eql.html",
    description: "Reference for Elastic's Event Query Language — used for threat hunting, detection rules, and sequence analysis in Elastic Security.",
    category: "Threat Intelligence",
    tags: ["EQL", "Elastic", "SIEM", "query language", "detection"],
    level: "Intermediate",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "ES|QL & Lucene Query Syntax (Elasticsearch)",
    provider: "Elastic",
    url: "https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html",
    description: "Elasticsearch query string syntax reference — the foundation for Kibana searches, alerts, and SIEM dashboards.",
    category: "Threat Intelligence",
    tags: ["Lucene", "Elasticsearch", "SIEM", "query language"],
    level: "Intermediate",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "Kusto Detective Agency – KQL Training",
    provider: "Microsoft",
    url: "https://detective.kusto.io/",
    description: "Gamified KQL training — solve detective mysteries using Kusto Query Language. Essential for Microsoft Sentinel and Defender threat hunting.",
    category: "Threat Intelligence",
    tags: ["KQL", "Kusto", "Sentinel", "training", "gamified"],
    level: "Beginner",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "YARA-L 2.0 Reference (Chronicle/Google SecOps)",
    provider: "Google",
    url: "https://cloud.google.com/chronicle/docs/reference/yara-l-2-0-overview",
    description: "Reference for YARA-L 2.0, the detection rule language for Google Chronicle / SecOps. Used for writing custom detection rules.",
    category: "Threat Intelligence",
    tags: ["YARA-L", "Chronicle", "Google SecOps", "detection rules"],
    level: "Intermediate",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "Sigma Rules – Generic SIEM Detection Format",
    provider: "SigmaHQ",
    url: "https://github.com/SigmaHQ/sigma",
    description: "Open standard for SIEM detection rules. Write once, convert to Splunk SPL, Elastic EQL, Microsoft KQL, and other SIEM formats.",
    category: "Threat Intelligence",
    tags: ["Sigma", "detection rules", "SIEM", "open standard"],
    level: "Intermediate",
    cisspDomains: ["cissp-d7"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: []
  },
  {
    name: "Hack The Box Academy",
    provider: "Hack The Box",
    url: "https://academy.hackthebox.com/",
    description: "Structured cybersecurity training with hands-on labs covering networking, web exploitation, AD attacks, malware analysis, and more. Free tier available.",
    category: "Labs",
    tags: ["HTB", "labs", "training", "hands-on"],
    level: "Beginner",
    cisspDomains: ["cissp-d6"],
    niceCategories: ["Protect and Defend"],
    relatedCertIds: ["oscp", "ceh"]
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
console.log('Batch C complete: added ' + added + ', skipped ' + skipped + ', total now ' + resources.length);
